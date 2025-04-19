// js/data.js

// Cable sizes reference array
export const SIZES = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300];

// Cable capacity data from IEC 60364-5-52 tables (Amps)
export const CABLE_DATA = {
    // Table B.52.2 - PVC insulation, two loaded conductors, 70°C
    'PVC_2': { 'copper': { 'A1': [14.5, 19.5, 26, 34, 46, 61, 80, 99, 119, 151, 182, 210, 240, 273, 321, 367], 'A2': [14, 18.5, 25, 32, 43, 57, 75, 92, 110, 139, 167, 192, 219, 248, 291, 334], 'B1': [17.5, 24, 32, 41, 57, 76, 101, 125, 151, 192, 232, 269, 300, 341, 400, 458], 'B2': [16.5, 23, 30, 38, 52, 69, 90, 111, 133, 168, 201, 232, 258, 294, 344, 394], 'C': [19.5, 27, 36, 46, 63, 85, 112, 138, 168, 213, 258, 299, 344, 392, 461, 530], 'D1': [22, 29, 37, 46, 60, 78, 99, 119, 140, 173, 204, 231, 261, 292, 336, 379], 'D2': [22, 28, 38, 48, 64, 83, 110, 132, 156, 192, 230, 261, 293, 331, 382, 427] }, 'aluminium': { 'A1': [null, 15, 20, 26, 36, 48, 63, 77, 93, 118, 142, 164, 189, 215, 252, 289], 'A2': [null, 14.5, 19.5, 25, 33, 44, 58, 71, 86, 108, 130, 150, 172, 195, 229, 263], 'B1': [null, 18.5, 25, 32, 44, 60, 79, 97, 118, 150, 181, 210, 234, 266, 312, 358], 'B2': [null, 17.5, 24, 30, 41, 54, 71, 86, 104, 131, 157, 181, 201, 230, 269, 308], 'C': [null, 21, 28, 36, 49, 66, 83, 103, 125, 160, 195, 226, 261, 298, 352, 406], 'D1': [null, 22, 29, 36, 47, 61, 77, 93, 109, 135, 159, 180, 204, 228, 262, 296], 'D2': [null, null, null, 36, 47, 63, 82, 98, 117, 145, 173, 200, 224, 255, 298, 336] } },
    // Table B.52.3 - XLPE/EPR insulation, two loaded conductors, 90°C
    'XLPE_2': { 'copper': { 'A1': [19, 26, 35, 45, 61, 81, 106, 131, 158, 200, 241, 278, 318, 362, 424, 486], 'A2': [18.5, 25, 33, 42, 57, 76, 99, 121, 145, 183, 220, 253, 290, 329, 386, 442], 'B1': [23, 31, 42, 54, 75, 100, 133, 164, 198, 253, 306, 354, 393, 449, 528, 603], 'B2': [22, 30, 40, 51, 69, 91, 119, 146, 175, 221, 265, 305, 334, 384, 459, 532], 'C': [24, 33, 45, 58, 80, 107, 138, 171, 209, 269, 328, 382, 441, 506, 599, 693], 'D1': [25, 33, 43, 53, 71, 91, 116, 139, 164, 203, 239, 271, 306, 343, 395, 446], 'D2': [27, 35, 46, 58, 77, 100, 129, 155, 183, 225, 270, 306, 343, 387, 448, 502] }, 'aluminium': { 'A1': [null, 20, 27, 35, 48, 64, 84, 103, 125, 158, 191, 220, 253, 288, 338, 387], 'A2': [null, 19.5, 26, 33, 45, 60, 78, 96, 115, 145, 175, 201, 230, 262, 307, 352], 'B1': [null, 25, 33, 43, 59, 79, 105, 130, 157, 200, 242, 281, 307, 351, 412, 471], 'B2': [null, 23, 31, 40, 54, 72, 94, 115, 138, 175, 210, 242, 261, 300, 358, 415], 'C': [null, 26, 35, 45, 62, 84, 101, 126, 154, 198, 241, 280, 324, 371, 439, 508], 'D1': [null, 26, 33, 42, 55, 71, 90, 108, 128, 158, 186, 211, 238, 267, 307, 346], 'D2': [null, null, null, 42, 55, 76, 98, 117, 139, 170, 204, 233, 261, 296, 343, 386] } },
    // Table B.52.4 - PVC insulation, three loaded conductors, 70°C
    'PVC_3': { 'copper': { 'A1': [13.5, 18, 24, 31, 42, 56, 73, 89, 108, 136, 164, 188, 216, 245, 266, 328], 'A2': [13, 17.5, 23, 29, 39, 52, 68, 83, 99, 125, 150, 172, 196, 223, 261, 298], 'B1': [15.5, 21, 28, 36, 50, 68, 89, 110, 134, 171, 207, 239, 262, 296, 346, 394], 'B2': [15, 20, 27, 34, 46, 62, 80, 99, 118, 149, 179, 206, 225, 255, 297, 339], 'C': [17.5, 24, 32, 41, 57, 76, 96, 119, 144, 184, 223, 259, 299, 341, 403, 464], 'D1': [18, 24, 30, 38, 50, 64, 82, 98, 116, 143, 169, 192, 217, 243, 280, 316], /* Corrected D1 120mm2 value */ 'D2': [19, 24, 33, 41, 54, 70, 92, 110, 130, 162, 193, 220, 246, 278, 320, 359] }, 'aluminium': { 'A1': [null, 14, 18.5, 24, 32, 43, 57, 70, 84, 107, 129, 149, 170, 194, 227, 261], 'A2': [null, 13.5, 17.5, 23, 31, 41, 53, 65, 78, 98, 118, 135, 155, 176, 207, 237], 'B1': [null, 16.5, 22, 28, 39, 53, 70, 86, 104, 133, 161, 186, 204, 230, 269, 306], 'B2': [null, 15.5, 21, 27, 36, 48, 62, 77, 92, 116, 139, 160, 176, 199, 232, 265], 'C': [null, 18.5, 25, 32, 44, 59, 73, 90, 110, 140, 170, 197, 227, 259, 305, 351], 'D1': [null, 18.5, 24, 30, 39, 50, 64, 77, 91, 112, 132, 150, 169, 190, 218, 247], 'D2': [null, null, null, 30, 39, 53, 69, 83, 99, 122, 148, 169, 189, 214, 250, 282] } },
    // Table B.52.5 - XLPE/EPR insulation, three loaded conductors, 90°C
    'XLPE_3': { 'copper': { 'A1': [17, 23, 31, 40, 54, 73, 95, 117, 141, 179, 216, 249, 285, 324, 380, 435], 'A2': [16.5, 22, 30, 38, 51, 68, 89, 109, 130, 164, 197, 227, 259, 295, 346, 396], 'B1': [20, 28, 37, 48, 66, 88, 117, 144, 175, 222, 269, 312, 342, 384, 450, 514], 'B2': [19.5, 26, 35, 44, 60, 80, 105, 128, 154, 194, 233, 268, 300, 340, 398, 455], 'C': [22, 30, 40, 52, 71, 96, 119, 147, 179, 229, 278, 322, 371, 424, 500, 576], 'D1': [21, 28, 36, 44, 58, 75, 96, 115, 135, 167, 197, 223, 251, 281, 324, 365], 'D2': [23, 30, 39, 49, 65, 84, 107, 129, 153, 188, 226, 257, 287, 324, 375, 419] }, 'aluminium': { 'A1': [null, 19, 25, 32, 44, 58, 76, 94, 113, 142, 171, 197, 226, 256, 300, 344], 'A2': [null, 18, 24, 31, 41, 55, 71, 87, 104, 131, 157, 180, 206, 233, 273, 313], 'B1': [null, 22, 29, 38, 52, 71, 93, 116, 140, 179, 217, 251, 267, 300, 351, 402], 'B2': [null, 21, 28, 35, 48, 64, 84, 103, 124, 156, 188, 216, 240, 272, 318, 364], 'C': [null, 24, 32, 41, 57, 76, 90, 112, 136, 174, 211, 245, 283, 323, 382, 440], 'D1': [null, 22, 28, 35, 46, 59, 75, 90, 106, 130, 154, 174, 197, 220, 253, 286], 'D2': [null, null, null, 35, 46, 59, 75, 90, 106, 130, 154, 174, 197, 220, 253, 286] } }, // Note: D2 Al values same as D1 in source, might need verification from standard
    // Table B.52.10/11 - PVC insulation, copper/aluminium, methods E,F,G, 70°C
    'PVC_EFG': { 'copper': { 'E': [22, 30, 40, 51, 70, 94, 119, 148, 180, 232, 282, 328, 379, 434, 514, 593], 'F': [null, null, null, null, null, 108, 131, 162, 196, 251, 304, 352, 406, 463, 546, 629], 'G': [null, null, null, null, null, 119, 146, 181, 219, 281, 341, 396, 456, 521, 615, 709] }, 'aluminium': { 'E': [null, 23, 31, 40, 55, 73, 93, 115, 140, 181, 220, 256, 296, 339, 401, 463], 'F': [null, null, null, null, null, 84, 102, 126, 153, 196, 237, 275, 317, 361, 426, 491], 'G': [null, null, null, null, null, 93, 114, 141, 171, 219, 266, 309, 356, 407, 480, 553] } },
    // Table B.52.12/13 - XLPE/EPR insulation, copper/aluminium, methods E,F,G, 90°C
    'XLPE_EFG': { 'copper': { 'E': [26, 36, 49, 63, 86, 115, 149, 185, 225, 289, 352, 410, 473, 542, 641, 741], 'F': [null, null, null, null, null, 134, 161, 200, 242, 310, 377, 437, 504, 575, 679, 783], 'G': [null, null, null, null, null, 148, 182, 226, 275, 353, 430, 500, 577, 661, 781, 902] }, 'aluminium': { 'E': [null, 28, 38, 49, 67, 90, 116, 144, 176, 226, 275, 320, 369, 423, 500, 578], 'F': [null, null, null, null, null, 105, 126, 156, 189, 242, 294, 341, 393, 449, 530, 611], 'G': [null, null, null, null, null, 116, 142, 176, 215, 275, 335, 390, 450, 516, 609, 704] } },
    // Mineral Insulated Simplified (Method C Only)
    'Mineral_PVC': { 'copper': { 'C': [23, 31, 40, null, null, null, null, null, null, null, null, null, null, null, null, null] }, 'aluminium': { 'C': [] } },
    'Mineral_bare': { 'copper': { 'C': [28, 38, 51, null, null, null, null, null, null, null, null, null, null, null, null, null] }, 'aluminium': { 'C': [] } }
};

// Temperature correction factors (Table B.52.14 / B.52.15)
// Keys map to '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60' °C
export const TEMP_CORRECTION_AIR = { // Ref 30°C
    'PVC':        [1.22, 1.17, 1.12, 1.06, 1.00, 0.94, 0.87, 0.79, 0.71, 0.61, 0.50],
    'XLPE':       [1.15, 1.12, 1.08, 1.04, 1.00, 0.96, 0.91, 0.87, 0.82, 0.76, 0.71],
    'Mineral_70': [1.26, 1.20, 1.14, 1.07, 1.00, 0.93, 0.85, 0.78, 0.67, 0.57, 0.45], // Assuming 70°C rated mineral behaves like PVC for temp
    'Mineral_105':[1.14, 1.11, 1.07, 1.04, 1.00, 0.96, 0.92, 0.88, 0.84, 0.80, 0.75]  // Ref 105°C max temp for B.52.7
};
export const TEMP_CORRECTION_GROUND = { // Ref 20°C
    'PVC':        [1.10, 1.05, 1.00, 0.95, 0.89, 0.84, 0.77, 0.71, 0.63, 0.55, 0.45],
    'XLPE':       [1.07, 1.04, 1.00, 0.96, 0.93, 0.89, 0.85, 0.80, 0.76, 0.71, 0.65]
};
// Index mapping for temperatures
export const TEMP_VALUES = ['10','15','20','25','30','35','40','45','50','55','60'];

// Soil resistivity correction factors (Table B.52.16)
// Keys map to '0.5','0.7','1.0','1.5','2.0','2.5','3.0' K·m/W
export const SOIL_CORRECTION_DUCTS =  [1.28, 1.20, 1.18, 1.10, 1.05, 1.00, 0.96];
export const SOIL_CORRECTION_DIRECT = [1.88, 1.62, 1.50, 1.28, 1.12, 1.00, 0.90];
// Index mapping for soil resistivity
export const SOIL_RESISTIVITY_VALUES = ['0.5','0.7','1.0','1.5','2.0','2.5','3.0'];

// Group reduction factors (Table B.52.17 - General, non-buried)
// Keys are number of circuits/cables
export const GROUP_REDUCTION_GENERAL = { '1': 1.00, '2': 0.80, '3': 0.70, '4': 0.65, '5': 0.60, '6': 0.57, '7': 0.54, '8': 0.52, '9': 0.50, '12': 0.45, '16': 0.41, '20': 0.38 };
export const GROUP_REDUCTION_GENERAL_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 16, 20]; // For easier lookup/interpolation

// Direct burial reduction factors (Table B.52.18 - Method D2)
// Keys are clearance types, values are arrays corresponding to counts in BURIAL_REDUCTION_COUNTS
export const BURIAL_REDUCTION_FACTORS = {
    'touching': [0.75, 0.65, 0.60, 0.55, 0.50, 0.45, 0.43, 0.41, 0.36, 0.32, 0.29],
    '1d':       [0.80, 0.70, 0.60, 0.55, 0.55, 0.51, 0.48, 0.46, 0.42, 0.38, 0.35],
    '0.125m':   [0.85, 0.75, 0.70, 0.65, 0.60, 0.59, 0.57, 0.55, 0.51, 0.47, 0.44],
    '0.25m':    [0.90, 0.80, 0.75, 0.70, 0.70, 0.67, 0.65, 0.63, 0.59, 0.56, 0.53],
    '0.5m':     [0.90, 0.85, 0.80, 0.80, 0.80, 0.76, 0.75, 0.74, 0.71, 0.68, 0.66]
};
export const BURIAL_REDUCTION_COUNTS = [2, 3, 4, 5, 6, 7, 8, 9, 12, 16, 20]; // Number of circuits

// Duct burial reduction factors (Table B.52.19 - Method D1)
// Keys are clearance types, values are arrays corresponding to counts in DUCT_REDUCTION_COUNTS
export const DUCT_REDUCTION_FACTORS = {
    'touching': [0.85, 0.75, 0.70, 0.65, 0.60, 0.57, 0.54, 0.52, 0.49, 0.47, 0.45],
    '0.25m':    [0.90, 0.85, 0.80, 0.80, 0.80, 0.76, 0.74, 0.73, 0.72, 0.70, 0.69],
    '0.5m':     [0.95, 0.90, 0.85, 0.85, 0.80, 0.80, 0.78, 0.77, 0.76, 0.75, 0.74],
    '1.0m':     [0.95, 0.95, 0.90, 0.90, 0.90, 0.88, 0.88, 0.87, 0.86, 0.86, 0.85]
};
export const DUCT_REDUCTION_COUNTS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Number of cables/ducts

// Installation method details (for descriptions)
export const METHOD_DESCRIPTIONS = {
    'A1': 'Insulated conductors or single-core cables in conduit in a thermally insulated wall.',
    'A2': 'Multi-core cable in conduit in a thermally insulated wall.',
    'B1': 'Insulated conductors or single-core cables in conduit on a wooden or masonry wall.',
    'B2': 'Multi-core cable in conduit on a wooden or masonry wall.',
    'C': 'Single-core or multi-core cables fixed on, or spaced less than 0.3× cable diameter from a wooden or masonry wall.',
    'D1': 'Multi-core cable in conduit or in cable ducting in the ground.',
    'D2': 'Sheathed single-core or multi-core cables direct in the ground (with or without added mechanical protection).',
    'E': 'Multi-core cable in free air.',
    'F': 'Single core/Multi-core cable in free air with clearance to wall ≥ 0.3 times cable diameter.',
    'G': 'Single-core cables, touching in free air.'
};