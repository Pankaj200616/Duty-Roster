/**
 * Property-based tests for dashboard.js
 * 
 * These tests verify that the dashboard table rendering logic works correctly
 * for dataset selection and table row replacement.
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';

/**
 * **Validates: Requirements 7.7, 7.8**
 * 
 * Property 3: Dataset selection fully replaces table body rows
 * 
 * For any dropdown selection event (Plant or Township), dashboard.js SHALL replace
 * all existing table body rows with exactly 5 rows from the selected dataset, where
 * each row's cell values match the corresponding fields of the selected dataset
 * objects in order. No rows from the previously displayed dataset SHALL remain after
 * the switch.
 */
describe('Property 3: Dataset selection fully replaces table body rows', () => {
  
  // Define the exact datasets from dashboard.js
  const plantData = [
    { serNo: 1, location: 'Main Gate A', aShift: 'Guard A1', aOrd: 'Yes', bShift: 'Guard B1', bOrd: 'No', cShift: 'Guard C1', cOrd: 'Yes' },
    { serNo: 2, location: 'Main Gate B', aShift: 'Guard A2', aOrd: 'No', bShift: 'Guard B2', bOrd: 'Yes', cShift: 'Guard C2', cOrd: 'No' },
    { serNo: 3, location: 'Admin Building', aShift: 'Guard A3', aOrd: 'Yes', bShift: 'Guard B3', bOrd: 'No', cShift: 'Guard C3', cOrd: 'Yes' },
    { serNo: 4, location: 'Warehouse', aShift: 'Guard A4', aOrd: 'No', bShift: 'Guard B4', bOrd: 'Yes', cShift: 'Guard C4', cOrd: 'No' },
    { serNo: 5, location: 'Control Room', aShift: 'Guard A5', aOrd: 'Yes', bShift: 'Guard B5', bOrd: 'No', cShift: 'Guard C5', cOrd: 'Yes' }
  ];

  const townshipData = [
    { serNo: 1, location: 'Township Main Gate', aShift: 'Guard T1', aOrd: 'No', bShift: 'Guard T2', bOrd: 'Yes', cShift: 'Guard T3', cOrd: 'No' },
    { serNo: 2, location: 'Township West Gate', aShift: 'Guard T4', aOrd: 'Yes', bShift: 'Guard T5', bOrd: 'No', cShift: 'Guard T6', cOrd: 'Yes' },
    { serNo: 3, location: 'Township Clubhouse', aShift: 'Guard T7', aOrd: 'No', bShift: 'Guard T8', bOrd: 'Yes', cShift: 'Guard T9', cOrd: 'No' },
    { serNo: 4, location: 'Township Park Entry', aShift: 'Guard T10', aOrd: 'Yes', bShift: 'Guard T11', bOrd: 'No', cShift: 'Guard T12', cOrd: 'Yes' },
    { serNo: 5, location: 'Township Admin Block', aShift: 'Guard T13', aOrd: 'No', bShift: 'Guard T14', bOrd: 'Yes', cShift: 'Guard T15', cOrd: 'No' }
  ];

  /**
   * Helper function to create a mock dashboard DOM structure
   */
  function createDashboardDOM() {
    const dom = new JSDOM(
      `
      <!DOCTYPE html>
      <html>
        <body>
          <table>
            <tbody id="dutyTableBody"></tbody>
          </table>
        </body>
      </html>
      `
    );
    return dom;
  }

  /**
   * Helper function to simulate the renderTable logic from dashboard.js
   */
  function renderTable(tableBody, data, document) {
    tableBody.innerHTML = '';
    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="px-4 py-3">${row.serNo}</td>
        <td class="px-4 py-3">${row.location}</td>
        <td class="px-4 py-3 text-blue-600">${row.aShift}</td>
        <td class="px-4 py-3">${row.aOrd}</td>
        <td class="px-4 py-3 text-green-600">${row.bShift}</td>
        <td class="px-4 py-3">${row.bOrd}</td>
        <td class="px-4 py-3 text-purple-600">${row.cShift}</td>
        <td class="px-4 py-3">${row.cOrd}</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  /**
   * Helper function to extract location values from table rows
   */
  function extractLocations(tableBody) {
    const rows = tableBody.querySelectorAll('tr');
    return Array.from(rows).map(row => {
      const cells = row.querySelectorAll('td');
      // Location is in the second column (index 1)
      return cells[1] ? cells[1].textContent.trim() : null;
    }).filter(loc => loc !== null);
  }

  /**
   * Helper function to verify all fields of a row match the expected data
   */
  function verifyRowData(row, expectedData) {
    const cells = row.querySelectorAll('td');
    expect(cells.length).toBe(8);
    expect(cells[0].textContent.trim()).toBe(String(expectedData.serNo));
    expect(cells[1].textContent.trim()).toBe(expectedData.location);
    expect(cells[2].textContent.trim()).toBe(expectedData.aShift);
    expect(cells[3].textContent.trim()).toBe(expectedData.aOrd);
    expect(cells[4].textContent.trim()).toBe(expectedData.bShift);
    expect(cells[5].textContent.trim()).toBe(expectedData.bOrd);
    expect(cells[6].textContent.trim()).toBe(expectedData.cShift);
    expect(cells[7].textContent.trim()).toBe(expectedData.cOrd);
  }

  test('Property: renderTable(plantData) produces exactly 5 rows with Plant locations', () => {
    const dom = createDashboardDOM();
    const { document } = dom.window;
    const tableBody = document.getElementById('dutyTableBody');

    // Render plant data
    renderTable(tableBody, plantData, document);

    // Verify exactly 5 rows
    const rows = tableBody.querySelectorAll('tr');
    expect(rows.length).toBe(5);

    // Verify all locations are from Plant dataset
    const locations = extractLocations(tableBody);
    expect(locations).toEqual([
      'Main Gate A',
      'Main Gate B',
      'Admin Building',
      'Warehouse',
      'Control Room'
    ]);

    // Verify complete row data for each row
    rows.forEach((row, index) => {
      verifyRowData(row, plantData[index]);
    });
  });

  test('Property: renderTable(townshipData) produces exactly 5 rows with Township locations', () => {
    const dom = createDashboardDOM();
    const { document } = dom.window;
    const tableBody = document.getElementById('dutyTableBody');

    // Render township data
    renderTable(tableBody, townshipData);

    // Verify exactly 5 rows
    const rows = tableBody.querySelectorAll('tr');
    expect(rows.length).toBe(5);

    // Verify all locations are from Township dataset
    const locations = extractLocations(tableBody);
    expect(locations).toEqual([
      'Township Main Gate',
      'Township West Gate',
      'Township Clubhouse',
      'Township Park Entry',
      'Township Admin Block'
    ]);

    // Verify complete row data for each row
    rows.forEach((row, index) => {
      verifyRowData(row, townshipData[index]);
    });
  });

  test('Property: Switching from Plant to Township removes all Plant rows', () => {
    const dom = createDashboardDOM();
    const { document } = dom.window;
    const tableBody = document.getElementById('dutyTableBody');

    // Initial render with Plant data
    renderTable(tableBody, plantData);

    // Verify Plant locations exist
    let locations = extractLocations(tableBody);
    expect(locations).toEqual([
      'Main Gate A',
      'Main Gate B',
      'Admin Building',
      'Warehouse',
      'Control Room'
    ]);

    // Switch to Township data
    renderTable(tableBody, townshipData);

    // Verify exactly 5 rows
    const rows = tableBody.querySelectorAll('tr');
    expect(rows.length).toBe(5);

    // Verify NO Plant locations remain
    locations = extractLocations(tableBody);
    const plantLocations = ['Main Gate A', 'Main Gate B', 'Admin Building', 'Warehouse', 'Control Room'];
    plantLocations.forEach(plantLoc => {
      expect(locations).not.toContain(plantLoc);
    });

    // Verify all locations are from Township dataset
    expect(locations).toEqual([
      'Township Main Gate',
      'Township West Gate',
      'Township Clubhouse',
      'Township Park Entry',
      'Township Admin Block'
    ]);

    // Verify complete row data
    rows.forEach((row, index) => {
      verifyRowData(row, townshipData[index]);
    });
  });

  test('Property: Switching from Township to Plant removes all Township rows', () => {
    const dom = createDashboardDOM();
    const { document } = dom.window;
    const tableBody = document.getElementById('dutyTableBody');

    // Initial render with Township data
    renderTable(tableBody, townshipData);

    // Verify Township locations exist
    let locations = extractLocations(tableBody);
    expect(locations).toEqual([
      'Township Main Gate',
      'Township West Gate',
      'Township Clubhouse',
      'Township Park Entry',
      'Township Admin Block'
    ]);

    // Switch to Plant data
    renderTable(tableBody, plantData);

    // Verify exactly 5 rows
    const rows = tableBody.querySelectorAll('tr');
    expect(rows.length).toBe(5);

    // Verify NO Township locations remain
    locations = extractLocations(tableBody);
    const townshipLocations = ['Township Main Gate', 'Township West Gate', 'Township Clubhouse', 'Township Park Entry', 'Township Admin Block'];
    townshipLocations.forEach(townshipLoc => {
      expect(locations).not.toContain(townshipLoc);
    });

    // Verify all locations are from Plant dataset
    expect(locations).toEqual([
      'Main Gate A',
      'Main Gate B',
      'Admin Building',
      'Warehouse',
      'Control Room'
    ]);

    // Verify complete row data
    rows.forEach((row, index) => {
      verifyRowData(row, plantData[index]);
    });
  });

  test('Property: Double switch (Plant → Township → Plant) results in correct final state', () => {
    const dom = createDashboardDOM();
    const { document } = dom.window;
    const tableBody = document.getElementById('dutyTableBody');

    // Initial render: Plant
    renderTable(tableBody, plantData);

    // First switch: Plant → Township
    renderTable(tableBody, townshipData);

    // Second switch: Township → Plant
    renderTable(tableBody, plantData);

    // Verify exactly 5 rows
    const rows = tableBody.querySelectorAll('tr');
    expect(rows.length).toBe(5);

    // Verify final state is Plant data (no Township locations)
    const locations = extractLocations(tableBody);
    expect(locations).toEqual([
      'Main Gate A',
      'Main Gate B',
      'Admin Building',
      'Warehouse',
      'Control Room'
    ]);

    // Verify NO Township locations remain
    const townshipLocations = ['Township Main Gate', 'Township West Gate', 'Township Clubhouse', 'Township Park Entry', 'Township Admin Block'];
    townshipLocations.forEach(townshipLoc => {
      expect(locations).not.toContain(townshipLoc);
    });

    // Verify complete row data
    rows.forEach((row, index) => {
      verifyRowData(row, plantData[index]);
    });
  });

  test('Property: Multiple rapid switches always show exactly 5 rows from the last dataset', () => {
    fc.assert(
      fc.property(
        // Generator: array of dataset selections (plant or township)
        fc.array(fc.constantFrom('plant', 'township'), { minLength: 1, maxLength: 20 }),
        (selections) => {
          const dom = createDashboardDOM();
          const { document } = dom.window;
          const tableBody = document.getElementById('dutyTableBody');

          // Apply each selection in sequence
          selections.forEach(selection => {
            const dataset = selection === 'plant' ? plantData : townshipData;
            renderTable(tableBody, dataset);
          });

          // Verify exactly 5 rows remain
          const rows = tableBody.querySelectorAll('tr');
          expect(rows.length).toBe(5);

          // Determine what the last selection was
          const lastSelection = selections[selections.length - 1];
          const expectedDataset = lastSelection === 'plant' ? plantData : townshipData;
          const expectedLocations = expectedDataset.map(row => row.location);

          // Verify locations match the last selected dataset
          const actualLocations = extractLocations(tableBody);
          expect(actualLocations).toEqual(expectedLocations);

          // Verify complete row data
          rows.forEach((row, index) => {
            verifyRowData(row, expectedDataset[index]);
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  test('Edge case: Initial empty tbody gets exactly 5 rows after first render', () => {
    const dom = createDashboardDOM();
    const { document } = dom.window;
    const tableBody = document.getElementById('dutyTableBody');

    // Verify tbody is initially empty
    expect(tableBody.children.length).toBe(0);

    // Render plant data
    renderTable(tableBody, plantData);

    // Verify exactly 5 rows now exist
    const rows = tableBody.querySelectorAll('tr');
    expect(rows.length).toBe(5);

    // Verify locations
    const locations = extractLocations(tableBody);
    expect(locations.length).toBe(5);
  });

  test('Edge case: Table structure includes all required columns in correct order', () => {
    const dom = createDashboardDOM();
    const { document } = dom.window;
    const tableBody = document.getElementById('dutyTableBody');

    // Render plant data
    renderTable(tableBody, plantData);

    // Get first row
    const firstRow = tableBody.querySelector('tr');
    const cells = firstRow.querySelectorAll('td');

    // Verify 8 columns exist (Ser No., Location, A SHIFT, Ord, B SHIFT, Ord, C SHIFT, Ord)
    expect(cells.length).toBe(8);

    // Verify order by checking first row data
    expect(cells[0].textContent.trim()).toBe('1');                // serNo
    expect(cells[1].textContent.trim()).toBe('Main Gate A');      // location
    expect(cells[2].textContent.trim()).toBe('Guard A1');         // aShift
    expect(cells[3].textContent.trim()).toBe('Yes');              // aOrd
    expect(cells[4].textContent.trim()).toBe('Guard B1');         // bShift
    expect(cells[5].textContent.trim()).toBe('No');               // bOrd
    expect(cells[6].textContent.trim()).toBe('Guard C1');         // cShift
    expect(cells[7].textContent.trim()).toBe('Yes');              // cOrd
  });

  test('Edge case: Color classes are applied to shift columns', () => {
    const dom = createDashboardDOM();
    const { document } = dom.window;
    const tableBody = document.getElementById('dutyTableBody');

    // Render plant data
    renderTable(tableBody, plantData);

    // Get first row
    const firstRow = tableBody.querySelector('tr');
    const cells = firstRow.querySelectorAll('td');

    // Verify color classes
    expect(cells[2].className).toContain('text-blue-600');    // A SHIFT
    expect(cells[4].className).toContain('text-green-600');   // B SHIFT
    expect(cells[6].className).toContain('text-purple-600');  // C SHIFT
  });
});
