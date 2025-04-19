// js/ui.js
import * as data from './data.js';

// Cache DOM elements for performance
const DOMElements = {
    tabs: document.querySelectorAll('.tab'),
    tabContents: document.querySelectorAll('.tab-content'),
    installationMethodSelect: document.getElementById('installationMethod'),
    methodDescription: document.getElementById('methodDescription'),
    ambientAirGroup: document.getElementById('ambientAirGroup'),
    groundTempGroup: document.getElementById('groundTempGroup'),
    soilResistivityGroup: document.getElementById('soilResistivityGroup'),
    ductClearanceGroup: document.getElementById('ductClearanceGroup'),
    burialClearanceGroup: document.getElementById('burialClearanceGroup'),
    tableSelector: document.getElementById('tableSelector'),
    tableDisplay: document.getElementById('tableDisplay'),
    calculatorForm: document.getElementById('calculator-form'),
    resultDisplay: document.getElementById('result'),
    errorMessage: document.getElementById('error-message'),
    // Result fields
    selectedCapacity: document.getElementById('selectedCapacity'),
    tempCorrectedCapacity: document.getElementById('tempCorrectedCapacity'),
    soilCorrectedCapacity: document.getElementById('soilCorrectedCapacity'),
    finalGroupFactor: document.getElementById('finalGroupFactor'),
    finalCapacity: document.getElementById('finalCapacity'),
    cablesRequired: document.getElementById('cablesRequired'),
    totalCapacity: document.getElementById('totalCapacity'),
    iterationSteps: document.getElementById('iterationSteps'),
    calculationBreakdown: document.getElementById('calculation-breakdown'), // Cache the new div
};

// --- Tab Handling ---
export function setupTabs() {
    DOMElements.tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
}

function switchTab(tabId) {
    DOMElements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabId);
    });
    DOMElements.tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabId);
    });
}

// --- Form/Input Updates ---
export function updateMethodDetails() {
    const method = DOMElements.installationMethodSelect.value;
    const description = data.METHOD_DESCRIPTIONS[method] || 'Description not found.';
    DOMElements.methodDescription.textContent = description;

    const showGroundFields = ['D1', 'D2'].includes(method);
    const showD1Clearance = method === 'D1';
    const showD2Clearance = method === 'D2';

    DOMElements.ambientAirGroup.style.display = showGroundFields ? 'none' : 'block';
    DOMElements.groundTempGroup.style.display = showGroundFields ? 'block' : 'none';
    DOMElements.soilResistivityGroup.style.display = showGroundFields ? 'block' : 'none';
    DOMElements.ductClearanceGroup.style.display = showD1Clearance ? 'block' : 'none';
    DOMElements.burialClearanceGroup.style.display = showD2Clearance ? 'block' : 'none';
}

export function setupMethodChangeListener() {
    DOMElements.installationMethodSelect.addEventListener('change', updateMethodDetails);
    updateMethodDetails(); // Initial call
}

// --- Reference Table Display ---
export function setupTableSelector() {
    DOMElements.tableSelector.addEventListener('change', showSelectedTable);
    showSelectedTable(); // Initial call
}

function generateTableRows(capacityData, methods) {
    if (!capacityData) return '<tr><td colspan="8">Data not available for this selection.</td></tr>';

    return data.SIZES.map((size, i) => {
        const cells = methods.map(method => {
            // Ensure the method and index exist
            const value = capacityData[method]?.[i];
            return `<td>${(value !== null && value !== undefined) ? value : '-'}</td>`;
        }).join('');
        return `<tr><td>${size}</td>${cells}</tr>`;
    }).join('');
}


function showSelectedTable() {
    const tableId = DOMElements.tableSelector.value;
    let tableHTML = '';
    let title = '';
    let notes = '';

    // Structure to generate table HTML more dynamically
    const generateCapacityTable = (tableKey, insulation, conductors, temp, refTempAir, refTempGround) => {
         title = `Table ${tableKey} - ${insulation}, ${conductors} conductors, ${temp}°C`;
         notes = `<p>Conductor temperature: ${temp}°C, ambient temperature: ${refTempAir}°C in air, ${refTempGround}°C in ground</p>
                  <p class="note">Note: Values shown for Copper. Aluminium values approx. 20-25% lower.</p>`;
         const methods = ['A1', 'A2', 'B1', 'B2', 'C', 'D1', 'D2'];
         // Handle EFG tables separately if needed
         let capacityDataSource = data.CABLE_DATA[tableKey]?.copper;
         if (tableKey.includes('EFG')) {
             // Adjust methods/data source if displaying EFG tables
             // This part needs refinement if you add EFG tables to the dropdown
             console.warn('EFG Table display in Reference Tab needs specific handling.');
             methods = ['E', 'F', 'G']; // Example
             // capacityDataSource = data.CABLE_DATA[tableKey]?.copper; // Ensure correct source
         }

         const rows = generateTableRows(capacityDataSource, methods);
         return `<table><thead><tr><th>Size (mm²)</th>${methods.map(m => `<th>${m}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>`;
    };

     const generateFactorTable = (header, rowsData) => {
         const headers = rowsData[0].map(h => `<th>${h}</th>`).join('');
         const rows = rowsData.slice(1).map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');
         return `<h3>${header}</h3><table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
     };


    switch (tableId) {
        case 'B.52.2':
            tableHTML = generateCapacityTable('PVC_2', 'PVC insulation', 'two loaded', 70, 30, 20);
            break;
        case 'B.52.3':
            tableHTML = generateCapacityTable('XLPE_2', 'XLPE/EPR insulation', 'two loaded', 90, 30, 20);
            break;
        case 'B.52.4':
             tableHTML = generateCapacityTable('PVC_3', 'PVC insulation', 'three loaded', 70, 30, 20);
            break;
        case 'B.52.5':
             tableHTML = generateCapacityTable('XLPE_3', 'XLPE/EPR insulation', 'three loaded', 90, 30, 20);
            break;
        case 'B.52.14':
             tableHTML = generateFactorTable('Table B.52.14 - Correction factor for ambient air temperatures other than 30 °C', [
                 ['Ambient temp (°C)', 'PVC (70°C)', 'XLPE/EPR (90°C)', 'Mineral (70°C)', 'Mineral (105°C)'],
                 [10, 1.22, 1.15, 1.26, 1.14], [15, 1.17, 1.12, 1.20, 1.11], [20, 1.12, 1.08, 1.14, 1.07],
                 [25, 1.06, 1.04, 1.07, 1.04], [30, 1.00, 1.00, 1.00, 1.00], [35, 0.94, 0.96, 0.93, 0.96],
                 [40, 0.87, 0.91, 0.85, 0.92], [45, 0.79, 0.87, 0.78, 0.88], [50, 0.71, 0.82, 0.67, 0.84],
                 [55, 0.61, 0.76, 0.57, 0.80], [60, 0.50, 0.71, 0.45, 0.75]
             ]);
             break;
        case 'B.52.15':
             tableHTML = generateFactorTable('Table B.52.15 - Correction factors for ambient ground temperatures other than 20 °C', [
                 ['Ground temp (°C)', 'PVC (70°C)', 'XLPE/EPR (90°C)'],
                 [10, 1.10, 1.07], [15, 1.05, 1.04], [20, 1.00, 1.00], [25, 0.95, 0.96], [30, 0.89, 0.93],
                 [35, 0.84, 0.89], [40, 0.77, 0.85], [45, 0.71, 0.80], [50, 0.63, 0.76], [55, 0.55, 0.71], [60, 0.45, 0.65]
             ]);
             break;
        case 'B.52.16':
             tableHTML = generateFactorTable('Table B.52.16 - Correction factors for soil thermal resistivities other than 2.5 K·m/W', [
                 ['Thermal resistivity (K·m/W)', 'Cables in buried ducts (D1)', 'Direct buried cables (D2)'],
                 [0.5, 1.28, 1.88], [0.7, 1.20, 1.62], [1.0, 1.18, 1.50], [1.5, 1.10, 1.28], [2.0, 1.05, 1.12],
                 [2.5, 1.00, 1.00], [3.0, 0.96, 0.90]
             ]);
             break;
        case 'B.52.17':
             tableHTML = generateFactorTable('Table B.52.17 - Reduction factors for groups (General - Not for D1/D2 Grouping)', [
                 ['Number of circuits/cables', 'Reduction factor'],
                 [1, 1.00], [2, 0.80], [3, 0.70], [4, 0.65], [5, 0.60], [6, 0.57], [7, 0.54], [8, 0.52],
                 [9, 0.50], [12, 0.45], [16, 0.41], [20, 0.38]
             ]);
             notes = `<p class="note">Applies to cables on trays, ladders, cleats, etc. For buried cables use B.52.18 or B.52.19.</p>`;
            break;
        case 'B.52.18':
             tableHTML = generateFactorTable('Table B.52.18 - Reduction factors for cables laid directly in the ground (Method D2 Grouping)', [
                 ['Number of circuits', 'Touching', '1× dia.', '0.125 m', '0.25 m', '0.5 m'],
                 [2, 0.75, 0.80, 0.85, 0.90, 0.90], [3, 0.65, 0.70, 0.75, 0.80, 0.85], [4, 0.60, 0.60, 0.70, 0.75, 0.80],
                 [5, 0.55, 0.55, 0.65, 0.70, 0.80], [6, 0.50, 0.55, 0.60, 0.70, 0.80], [7, 0.45, 0.51, 0.59, 0.67, 0.76],
                 [8, 0.43, 0.48, 0.57, 0.65, 0.75], [9, 0.41, 0.46, 0.55, 0.63, 0.74], [12, 0.36, 0.42, 0.51, 0.59, 0.71],
                 [16, 0.32, 0.38, 0.47, 0.56, 0.68], [20, 0.29, 0.35, 0.44, 0.53, 0.66]
             ]);
             notes = `<p class="note">Horizontal spacing between centres of cables/circuits.</p>`;
            break;
        case 'B.52.19':
             tableHTML = generateFactorTable('Table B.52.19 - Reduction factors for cables laid in ducts in the ground (Method D1 Grouping)', [
                 ['Number of cables/ducts', 'Ducts touching', '0.25 m', '0.5 m', '1.0 m'],
                 [2, 0.85, 0.90, 0.95, 0.95], [3, 0.75, 0.85, 0.90, 0.95], [4, 0.70, 0.80, 0.85, 0.90],
                 [5, 0.65, 0.80, 0.85, 0.90], [6, 0.60, 0.80, 0.80, 0.90], [7, 0.57, 0.76, 0.80, 0.88],
                 [8, 0.54, 0.74, 0.78, 0.88], [9, 0.52, 0.73, 0.77, 0.87], [10, 0.49, 0.72, 0.76, 0.86],
                 [11, 0.47, 0.70, 0.75, 0.86], [12, 0.45, 0.69, 0.74, 0.85]
             ]);
             notes = `<p class="note">Horizontal spacing between centres of ducts.</p>`;
            break;
        default:
             tableHTML = '<p>Select a table from the dropdown above.</p>';
    }

    DOMElements.tableDisplay.innerHTML = `<h2>${title || tableId}</h2>${tableHTML}${notes || ''}`;
}


// --- Results Display ---
export function displayResults(results) {
    clearErrors();
    // Clear previous breakdown and iterations
    DOMElements.calculationBreakdown.innerHTML = '';
    DOMElements.iterationSteps.innerHTML = ''; // Clear grouping iterations too

    if (results.error) {
        showError(results.error);
        DOMElements.resultDisplay.style.display = 'none';
        return;
    }

    // Helper to format output
    const formatValue = (val, digits = 1) => (val !== null && !isNaN(val)) ? val.toFixed(digits) : 'N/A';
    const formatFactor = (val, digits = 3) => (val !== null && !isNaN(val)) ? val.toFixed(digits) : 'N/A'; // Use 3 digits for factors

    // Populate standard results
    DOMElements.selectedCapacity.textContent = formatValue(results.baseCapacity);
    // Clear these lines as they are shown in the breakdown now
    DOMElements.tempCorrectedCapacity.textContent = '';
    DOMElements.soilCorrectedCapacity.textContent = '';
    // Display grouping factor and final results
    DOMElements.finalGroupFactor.textContent = `${formatFactor(results.groupReductionFactor)} (${results.groupingTableUsed})`;
    DOMElements.finalCapacity.textContent = formatValue(results.finalCapacityPerCable);
    DOMElements.cablesRequired.textContent = results.cablesRequired ?? 'N/A';
    DOMElements.totalCapacity.textContent = formatValue(results.totalCapacity);
    // Display grouping iterations *after* breakdown
    DOMElements.iterationSteps.innerHTML = results.iterationSteps || '';

    // Build and display calculation breakdown
    let breakdownHTML = '<h4>Calculation Breakdown:</h4>';
    breakdownHTML += `<p><small><i>Formula: I<sub>z</sub> = I<sub>b</sub> * k<sub>temp</sub> * k<sub>soil</sub> * k<sub>group</sub></i></small></p>`;

    // 1. Base Capacity
    breakdownHTML += `<p><strong>1. Base Capacity (I<sub>b</sub>):</strong> ${formatValue(results.baseCapacity)} A</p>`;

    // 2. Temperature Correction
    breakdownHTML += `<p><strong>2. Temp. Correction (k<sub>temp</sub>):</strong> ${formatFactor(results.tempCorrectionFactor)} <small>(${results.tempCorrectionDescription})</small></p>`;
    breakdownHTML += `<p style="padding-left: 15px;">Intermediate Capacity = ${formatValue(results.baseCapacity)} A * ${formatFactor(results.tempCorrectionFactor)} = ${formatValue(results.tempCorrectedCapacity)} A</p>`;

    // 3. Soil Correction (if applicable)
    let capacityBeforeGrouping = results.tempCorrectedCapacity; // Start with temp corrected
    if (results.soilCorrectionFactor !== 1) {
        breakdownHTML += `<p><strong>3. Soil Correction (k<sub>soil</sub>):</strong> ${formatFactor(results.soilCorrectionFactor)} <small>(${results.soilCorrectionDescription})</small></p>`;
        breakdownHTML += `<p style="padding-left: 15px;">Intermediate Capacity = ${formatValue(results.tempCorrectedCapacity)} A * ${formatFactor(results.soilCorrectionFactor)} = ${formatValue(results.soilCorrectedCapacity)} A</p>`;
        capacityBeforeGrouping = results.soilCorrectedCapacity; // Update capacity before grouping
    } else {
         breakdownHTML += `<p><strong>3. Soil Correction (k<sub>soil</sub>):</strong> 1.000 (N/A)</p>`; // Indicate factor is 1 if not applicable
    }

    // 4. Grouping Correction (using final factor)
    breakdownHTML += `<p><strong>4. Grouping Factor (k<sub>group</sub>):</strong> ${formatFactor(results.groupReductionFactor)} <small>(${results.groupingTableUsed})</small></p>`;
    breakdownHTML += `<p style="padding-left: 15px;"><strong>Final Capacity/Cable (I<sub>z</sub>)</strong> = ${formatValue(capacityBeforeGrouping)} A * ${formatFactor(results.groupReductionFactor)} = <strong>${formatValue(results.finalCapacityPerCable)} A</strong></p>`;

    // 5. Verification
    breakdownHTML += `<p><strong>5. Verification Check:</strong></p>`;
    breakdownHTML += `<p style="padding-left: 15px;"><small><i>Total Capacity (N * I<sub>z</sub>) ≥ Load Current (I<sub>L</sub>)</i></small></p>`;
    // Ensure values are numbers before comparing
    const totalCapNum = parseFloat(results.totalCapacity);
    const loadCurrentNum = parseFloat(results.loadCurrent);
    const checkOk = !isNaN(totalCapNum) && !isNaN(loadCurrentNum) && totalCapNum >= loadCurrentNum;
    const checkSymbol = checkOk ? '≥' : '<';
    const checkResult = checkOk ? '<span style="color:green; font-weight:bold;">OK</span>' : '<span style="color:red; font-weight:bold;">NOT OK</span>';
    breakdownHTML += `<p style="padding-left: 15px;">${results.cablesRequired} * ${formatValue(results.finalCapacityPerCable)} A = ${formatValue(results.totalCapacity)} A   ${checkSymbol}   ${formatValue(results.loadCurrent)} A   -> ${checkResult}</p>`;


    DOMElements.calculationBreakdown.innerHTML = breakdownHTML;


    DOMElements.resultDisplay.style.display = 'block';
}


// --- Error Handling ---
export function showError(message) {
    DOMElements.errorMessage.textContent = `Error: ${message}`; // Add prefix
    DOMElements.errorMessage.style.display = 'block';
    DOMElements.resultDisplay.style.display = 'none'; // Hide results on error
}

export function clearErrors() {
    DOMElements.errorMessage.textContent = '';
    DOMElements.errorMessage.style.display = 'none';
}

// --- Get Inputs ---
export function getInputs() {
    // Simple validation could be added here
    return {
        loadCurrent: parseFloat(document.getElementById('loadCurrent').value),
        installationMethod: DOMElements.installationMethodSelect.value,
        cableType: document.getElementById('cableType').value,
        conductorMaterial: document.getElementById('conductorMaterial').value,
        cableSize: parseFloat(document.getElementById('cableSize').value),
        ambientAirTemp: document.getElementById('ambientAirTemp').value,
        groundTemp: document.getElementById('groundTemp').value,
        soilResistivity: document.getElementById('soilResistivity').value,
        ductClearance: document.getElementById('ductClearance').value, // Read even if hidden
        burialClearance: document.getElementById('burialClearance').value, // Read even if hidden
    };
}

// --- Form Submission ---
export function setupFormSubmit(calculateCallback) {
     DOMElements.calculatorForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission
        clearErrors(); // Clear previous errors
        try {
            const inputs = getInputs();
            // Basic validation
            if (isNaN(inputs.loadCurrent) || inputs.loadCurrent <= 0) {
                throw new Error("Please enter a valid positive Load Current.");
            }
             if (isNaN(inputs.cableSize)) {
                throw new Error("Please select a valid Cable Size.");
            }
            // Add more validation as needed...

            calculateCallback(inputs); // Call the main calculation logic
        } catch (error) {
            showError(error.message);
             DOMElements.resultDisplay.style.display = 'none';
        }
    });
}
