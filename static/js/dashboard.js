document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('siteSelector');
  const tableBody = document.getElementById('dutyTableBody');

  // Plant dataset with exactly 5 locations
  const plantData = [
    { serNo: 1, location: 'Main Gate A', aShift: 'Guard A1', aOrd: 'Yes', bShift: 'Guard B1', bOrd: 'No', cShift: 'Guard C1', cOrd: 'Yes' },
    { serNo: 2, location: 'Main Gate B', aShift: 'Guard A2', aOrd: 'No', bShift: 'Guard B2', bOrd: 'Yes', cShift: 'Guard C2', cOrd: 'No' },
    { serNo: 3, location: 'Admin Building', aShift: 'Guard A3', aOrd: 'Yes', bShift: 'Guard B3', bOrd: 'No', cShift: 'Guard C3', cOrd: 'Yes' },
    { serNo: 4, location: 'Warehouse', aShift: 'Guard A4', aOrd: 'No', bShift: 'Guard B4', bOrd: 'Yes', cShift: 'Guard C4', cOrd: 'No' },
    { serNo: 5, location: 'Control Room', aShift: 'Guard A5', aOrd: 'Yes', bShift: 'Guard B5', bOrd: 'No', cShift: 'Guard C5', cOrd: 'Yes' }
  ];

  // Township dataset with exactly 5 locations
  const townshipData = [
    { serNo: 1, location: 'Township Main Gate', aShift: 'Guard T1', aOrd: 'No', bShift: 'Guard T2', bOrd: 'Yes', cShift: 'Guard T3', cOrd: 'No' },
    { serNo: 2, location: 'Township West Gate', aShift: 'Guard T4', aOrd: 'Yes', bShift: 'Guard T5', bOrd: 'No', cShift: 'Guard T6', cOrd: 'Yes' },
    { serNo: 3, location: 'Township Clubhouse', aShift: 'Guard T7', aOrd: 'No', bShift: 'Guard T8', bOrd: 'Yes', cShift: 'Guard T9', cOrd: 'No' },
    { serNo: 4, location: 'Township Park Entry', aShift: 'Guard T10', aOrd: 'Yes', bShift: 'Guard T11', bOrd: 'No', cShift: 'Guard T12', cOrd: 'Yes' },
    { serNo: 5, location: 'Township Admin Block', aShift: 'Guard T13', aOrd: 'No', bShift: 'Guard T14', bOrd: 'Yes', cShift: 'Guard T15', cOrd: 'No' }
  ];

  function renderTable(data) {
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

  selector.addEventListener('change', (e) => {
    const selected = e.target.value === 'plant' ? plantData : townshipData;
    renderTable(selected);
  });

  // Initial render (Plant by default)
  renderTable(plantData);
});
