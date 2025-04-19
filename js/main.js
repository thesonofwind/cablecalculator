// js/main.js
import { performCalculation } from './calculator.js';
import {
    setupTabs,
    setupMethodChangeListener,
    setupTableSelector,
    displayResults,
    getInputs,
    showError,
    clearErrors,
    setupFormSubmit // Import the new function
} from './ui.js';

// --- Initialization ---
function initialize() {
    console.log("Initializing Calculator...");
    setupTabs();
    setupMethodChangeListener();
    setupTableSelector();
    // Setup form submission to trigger calculations
    setupFormSubmit(handleCalculationRequest);
    console.log("Initialization Complete.");
}

// --- Calculation Handling ---
function handleCalculationRequest(inputs) {
     console.log("Calculating with inputs:", inputs);
     // The performCalculation function now handles its own try/catch
     const results = performCalculation(inputs);
     displayResults(results); // Display results or errors
}


// --- Run Initialization on DOM Load ---
document.addEventListener('DOMContentLoaded', initialize);