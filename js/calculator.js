// js/calculator.js
import * as data from './data.js';

const MAX_ITERATIONS = 10;

// Helper: Get base capacity value
function getBaseCapacity(cableType, conductor, method, size) {
    const sizeIndex = data.SIZES.indexOf(size);
    if (sizeIndex === -1) throw new Error(`Invalid cable size: ${size}`);

    let tableSource = cableType; // Default table source is the cable type itself
    let specificMethod = method; // Method within the table

    // Handle EFG methods which use different tables
    if (['E', 'F', 'G'].includes(method)) {
        if (cableType.startsWith('PVC_')) {
            tableSource = 'PVC_EFG';
        } else if (cableType.startsWith('XLPE_')) {
            tableSource = 'XLPE_EFG';
        }
        // Note: Mineral Insulated cables typically use Method C, not E/F/G here. Add checks if needed.
    }

    // Check if data path exists
    if (!data.CABLE_DATA[tableSource] ||
        !data.CABLE_DATA[tableSource][conductor] ||
        !data.CABLE_DATA[tableSource][conductor][specificMethod]) {
        throw new Error(`Base capacity data not found for: ${tableSource}, ${conductor}, Method ${specificMethod}`);
    }

    const capacity = data.CABLE_DATA[tableSource][conductor][specificMethod][sizeIndex];

    if (capacity === null || capacity === undefined || isNaN(capacity)) {
        throw new Error(`Invalid base capacity for: ${tableSource}, ${conductor}, Method ${specificMethod}, Size ${size}mm²`);
    }
    return capacity;
}

// Helper: Get temperature correction factor
function getTempCorrectionFactor(method, cableType, tempValue) {
    const isBuried = ['D1', 'D2'].includes(method);
    const tempIndex = data.TEMP_VALUES.indexOf(tempValue);
    if (tempIndex === -1) throw new Error(`Invalid temperature value: ${tempValue}`);

    let insulationType;
    let correctionTable;
    let referenceTemp;

    if (isBuried) {
        insulationType = cableType.startsWith('XLPE') ? 'XLPE' : 'PVC';
        correctionTable = data.TEMP_CORRECTION_GROUND;
        referenceTemp = 20;
    } else {
        correctionTable = data.TEMP_CORRECTION_AIR;
        referenceTemp = 30;
        if (cableType === 'Mineral_PVC') insulationType = 'Mineral_70';
        else if (cableType === 'Mineral_bare') insulationType = 'Mineral_105';
        else insulationType = cableType.startsWith('XLPE') ? 'XLPE' : 'PVC';
    }

    if (!correctionTable[insulationType]) {
        throw new Error(`Temperature correction data not found for insulation: ${insulationType}`);
    }

    const factor = correctionTable[insulationType][tempIndex];
    if (factor === undefined) throw new Error(`Invalid temp factor for ${insulationType} at ${tempValue}°C`);

    const type = isBuried ? 'Ground' : 'Air';
    const description = `${type} ${tempValue}°C (Ref ${referenceTemp}°C)`;
    return { factor, description };
}

// Helper: Get soil resistivity correction factor
function getSoilCorrectionFactor(method, soilResistivityValue) {
    if (!['D1', 'D2'].includes(method)) return { factor: 1, description: 'N/A' };

    const resIndex = data.SOIL_RESISTIVITY_VALUES.indexOf(soilResistivityValue);
    if (resIndex === -1) throw new Error(`Invalid soil resistivity value: ${soilResistivityValue}`);

    const factor = (method === 'D1') ? data.SOIL_CORRECTION_DUCTS[resIndex] : data.SOIL_CORRECTION_DIRECT[resIndex];
    if (factor === undefined) throw new Error(`Invalid soil factor for ${method} at ${soilResistivityValue} K·m/W`);

    const description = `Soil ${soilResistivityValue} K·m/W (Ref 2.5)`;
    return { factor, description };
}


// Helper: Interpolate or lookup grouping factor for D2 (Direct Burial)
function getGroupFactorD2(clearance, groupCount) {
    if (groupCount <= 1) return 1.0;
    const factors = data.BURIAL_REDUCTION_FACTORS[clearance];
    const knownCounts = data.BURIAL_REDUCTION_COUNTS;
    if (!factors) throw new Error(`Invalid D2 clearance: ${clearance}`);

    // Find position in knownCounts array
    for (let i = 0; i < knownCounts.length; i++) {
        if (groupCount === knownCounts[i]) return factors[i];
        if (groupCount < knownCounts[i]) {
            // Interpolate between knownCounts[i-1] and knownCounts[i]
            if (i === 0) return factors[0]; // Less than the smallest count (2)
            const lowerCount = knownCounts[i-1];
            const upperCount = knownCounts[i];
            const lowerFactor = factors[i-1];
            const upperFactor = factors[i];
            const interpolated = lowerFactor + (upperFactor - lowerFactor) * ((groupCount - lowerCount) / (upperCount - lowerCount));
            return interpolated;
        }
    }
    // If groupCount is greater than the largest known count
    return factors[factors.length - 1];
}

// Helper: Lookup grouping factor for D1 (Duct Burial)
function getGroupFactorD1(clearance, groupCount) {
    if (groupCount <= 1) return 1.0;
    const factors = data.DUCT_REDUCTION_FACTORS[clearance];
    const knownCounts = data.DUCT_REDUCTION_COUNTS;
     if (!factors) throw new Error(`Invalid D1 clearance: ${clearance}`);

    // Find the index or the next lower index
    let applicableIndex = -1;
    for (let i = 0; i < knownCounts.length; i++) {
        if (groupCount >= knownCounts[i]) {
            applicableIndex = i;
        } else {
            break;
        }
    }

    if (applicableIndex === -1) {
        // groupCount is less than the smallest known count (2), but > 1
        return factors[0];
    }
    return factors[applicableIndex];
}

// Helper: Lookup grouping factor for General cases (non-buried)
function getGroupFactorGeneral(groupCount) {
    if (groupCount <= 1) return 1.0;
    const knownCounts = data.GROUP_REDUCTION_GENERAL_COUNTS;
    let applicableCount = 1;

     for (let i = 0; i < knownCounts.length; i++) {
        if (groupCount >= knownCounts[i]) {
            applicableCount = knownCounts[i];
        } else {
            break;
        }
    }
    // Handle cases larger than the table max (20)
    if (groupCount > knownCounts[knownCounts.length - 1]) {
        applicableCount = knownCounts[knownCounts.length - 1];
    }

    return data.GROUP_REDUCTION_GENERAL[applicableCount.toString()];
}


// Main Calculation Function
export function performCalculation(inputs) {
    const {
        loadCurrent, installationMethod, cableType, conductorMaterial,
        cableSize, ambientAirTemp, groundTemp, soilResistivity,
        ductClearance, burialClearance
    } = inputs;

    let results = {
        baseCapacity: null,
        tempCorrectionFactor: 1,
        tempCorrectionDescription: 'N/A',
        tempCorrectedCapacity: null,
        soilCorrectionFactor: 1,
        soilCorrectionDescription: 'N/A',
        soilCorrectedCapacity: null,
        groupReductionFactor: 1,
        groupingTableUsed: 'N/A (1 cable)',
        finalCapacityPerCable: null,
        cablesRequired: 1,
        totalCapacity: null,
        iterationSteps: '',
        error: null
    };

    try {
        // 1. Base Capacity
        results.baseCapacity = getBaseCapacity(cableType, conductorMaterial, installationMethod, cableSize);
        results.tempCorrectedCapacity = results.baseCapacity; // Start point for corrections

        // 2. Temperature Correction
        const tempValue = ['D1', 'D2'].includes(installationMethod) ? groundTemp : ambientAirTemp;
        const tempCorrection = getTempCorrectionFactor(installationMethod, cableType, tempValue);
        results.tempCorrectionFactor = tempCorrection.factor;
        results.tempCorrectionDescription = tempCorrection.description;
        results.tempCorrectedCapacity = results.baseCapacity * results.tempCorrectionFactor;

        // 3. Soil Resistivity Correction
        results.soilCorrectedCapacity = results.tempCorrectedCapacity; // Start point
        const soilCorrection = getSoilCorrectionFactor(installationMethod, soilResistivity);
        results.soilCorrectionFactor = soilCorrection.factor;
        results.soilCorrectionDescription = soilCorrection.description;
        results.soilCorrectedCapacity = results.tempCorrectedCapacity * results.soilCorrectionFactor;

        // 4. Grouping Iteration
        let currentCapacity = results.soilCorrectedCapacity;
        results.finalCapacityPerCable = currentCapacity; // Initial assumption
        let iterationLog = '<h4>Grouping Calculation Steps:</h4>';
        let cablesNeeded = Math.ceil(loadCurrent / currentCapacity);
        if (cablesNeeded <= 0) cablesNeeded = 1;
        results.cablesRequired = cablesNeeded; // Initial estimate

        if (cablesNeeded > 1) {
            let previousCables = 0;
            let iterations = 0;
            results.groupingTableUsed = 'Calculating...'; // Placeholder

            while (cablesNeeded !== previousCables && iterations < MAX_ITERATIONS) {
                previousCables = cablesNeeded; // Store cables from previous iteration
                iterations++;
                let groupFactor = 1.0;
                let tableDesc = '';

                 // Determine grouping factor based on current estimate (previousCables)
                if (installationMethod === 'D1') {
                    groupFactor = getGroupFactorD1(ductClearance, previousCables);
                    tableDesc = `B.52.19 (Ducts, ${ductClearance})`;
                } else if (installationMethod === 'D2') {
                    groupFactor = getGroupFactorD2(burialClearance, previousCables);
                    tableDesc = `B.52.18 (Direct, ${burialClearance})`;
                } else {
                    groupFactor = getGroupFactorGeneral(previousCables);
                    tableDesc = `B.52.17 (General)`;
                }

                results.groupReductionFactor = groupFactor; // Store the latest factor
                results.groupingTableUsed = tableDesc;
                results.finalCapacityPerCable = currentCapacity * groupFactor; // De-rated capacity

                if (results.finalCapacityPerCable <= 0) {
                     iterationLog += `<div class="iteration error">Error: Capacity per cable became zero or negative in iteration ${iterations}.</div>`;
                     throw new Error("Calculation resulted in non-positive capacity per cable during grouping.");
                }

                cablesNeeded = Math.ceil(loadCurrent / results.finalCapacityPerCable); // Recalculate needed cables
                if (cablesNeeded <= 0) cablesNeeded = 1;

                iterationLog += `
                    <div class="iteration">
                        <strong>Iteration ${iterations}:</strong><br>
                        - Assuming ${previousCables} cable(s) -> Group Factor (${tableDesc}): ${groupFactor.toFixed(3)}<br>
                        - Resulting Capacity/Cable: ${currentCapacity.toFixed(1)} * ${groupFactor.toFixed(3)} = ${results.finalCapacityPerCable.toFixed(1)} A<br>
                        - Cables needed: ${loadCurrent.toFixed(1)} / ${results.finalCapacityPerCable.toFixed(1)} = ${cablesNeeded}
                    </div>
                `;
            } // End while loop

            if (iterations >= MAX_ITERATIONS) {
                 iterationLog += `<div class="iteration warning">Warning: Max iterations (${MAX_ITERATIONS}) reached. Result may be unstable.</div>`;
            }

             results.cablesRequired = cablesNeeded; // Final number of cables

        } else {
            iterationLog += `<div class="iteration">Only 1 cable required based on corrected capacity (${currentCapacity.toFixed(1)} A). No grouping reduction applied.</div>`;
            results.groupReductionFactor = 1.0;
            results.groupingTableUsed = 'N/A (1 cable)';
            results.finalCapacityPerCable = currentCapacity; // No change
        }

        results.iterationSteps = iterationLog;
        results.totalCapacity = results.cablesRequired * results.finalCapacityPerCable;

    } catch (error) {
        console.error("Calculation Error:", error);
        results.error = error.message || "An unknown calculation error occurred.";
        // Reset possibly invalid intermediate results
        results.finalCapacityPerCable = null;
        results.cablesRequired = null;
        results.totalCapacity = null;
    }

    return results;
}