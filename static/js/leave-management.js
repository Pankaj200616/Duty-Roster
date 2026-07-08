/**
 * leave-management.js
 *
 * Handles:
 *  - Opening / closing the Add/Edit Leave drawer
 *  - Client-side form validation before submit
 *  - Edit functionality (pre-fill form with existing data)
 *  - Filter interactions (ready for future backend integration)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------ */
  /*  DRAWER                                                              */
  /* ------------------------------------------------------------------ */

  const drawer        = document.getElementById('leaveDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const openBtn       = document.getElementById('openDrawerBtn');
  const closeBtn      = document.getElementById('closeDrawerBtn');
  const drawerTitle   = document.getElementById('drawerTitle');
  const submitBtn     = document.getElementById('submitBtn');

  let editMode = false;
  let editingLeaveId = null;

  /**
   * Opens the drawer for adding a new leave.
   */
  function openDrawer() {
    editMode = false;
    editingLeaveId = null;
    drawerTitle.textContent = 'Add New Leave';
    submitBtn.textContent = 'Submit';
    leaveForm.reset();
    clearErrors();
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
    drawerOverlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  /**
   * Opens the drawer for editing an existing leave.
   * @param {Object} leaveData - The leave data to edit
   */
  function openEditDrawer(leaveData) {
    editMode = true;
    editingLeaveId = leaveData.id;
    drawerTitle.textContent = 'Edit Leave';
    submitBtn.textContent = 'Update';
    
    // Pre-fill form fields
    document.getElementById('empId').value = leaveData.empId || '';
    document.getElementById('leaveType').value = leaveData.leaveType || '';
    document.getElementById('fromDate').value = leaveData.fromDate || '';
    document.getElementById('toDate').value = leaveData.toDate || '';
    
    // Add status dropdown if in edit mode
    const statusField = document.getElementById('statusField');
    const statusSelect = document.getElementById('status');
    if (statusField && statusSelect) {
      statusField.classList.remove('hidden');
      statusSelect.value = leaveData.status || 'Pending';
    }
    
    clearErrors();
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
    drawerOverlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  /**
   * Closes the drawer and resets it back off-screen.
   */
  function closeDrawer() {
    drawer.classList.remove('translate-x-0');
    drawer.classList.add('translate-x-full');
    drawerOverlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    
    // Hide status field when closing
    const statusField = document.getElementById('statusField');
    if (statusField) {
      statusField.classList.add('hidden');
    }
  }

  /**
   * Clears all validation error messages and styles.
   */
  function clearErrors() {
    const empId     = document.getElementById('empId');
    const leaveType = document.getElementById('leaveType');
    const fromDate  = document.getElementById('fromDate');
    const toDate    = document.getElementById('toDate');
    
    [empId, leaveType, fromDate, toDate].forEach(field => {
      if (field) {
        field.classList.remove('border-red-500');
        const errMsg = field.parentElement.querySelector('.field-error');
        if (errMsg) errMsg.remove();
      }
    });
  }

  if (openBtn)       openBtn.addEventListener('click', openDrawer);
  if (closeBtn)      closeBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // Also close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ------------------------------------------------------------------ */
  /*  EDIT BUTTON HANDLERS                                                */
  /* ------------------------------------------------------------------ */

  /**
   * Attach click handlers to all edit buttons in the table.
   */
  function attachEditHandlers() {
    const editButtons = document.querySelectorAll('.edit-leave-btn');
    editButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const leaveData = {
          id: btn.dataset.id,
          empId: btn.dataset.empid,
          leaveType: btn.dataset.leavetype,
          fromDate: btn.dataset.fromdate,
          toDate: btn.dataset.todate,
          status: btn.dataset.status
        };
        openEditDrawer(leaveData);
      });
    });
  }

  // Initialize edit handlers on page load
  attachEditHandlers();

  // Expose function globally for dynamic table updates
  window.attachEditHandlers = attachEditHandlers;

  /* ------------------------------------------------------------------ */
  /*  FORM VALIDATION                                                     */
  /* ------------------------------------------------------------------ */

  const leaveForm = document.getElementById('leaveForm');

  if (leaveForm) {
    leaveForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const empId     = document.getElementById('empId');
      const leaveType = document.getElementById('leaveType');
      const fromDate  = document.getElementById('fromDate');
      const toDate    = document.getElementById('toDate');
      const status    = document.getElementById('status');

      let valid = true;

      // Clear previous error states
      clearErrors();

      /**
       * Marks a field as invalid and shows an inline error message.
       * @param {HTMLElement} field
       * @param {string} message
       */
      function markInvalid(field, message) {
        field.classList.add('border-red-500');
        const msg = document.createElement('p');
        msg.className = 'field-error text-xs text-red-500 mt-1';
        msg.textContent = message;
        field.parentElement.appendChild(msg);
        valid = false;
      }

      if (!empId.value.trim())     markInvalid(empId,     'Employee ID is required.');
      if (!leaveType.value)        markInvalid(leaveType, 'Please select a leave type.');
      if (!fromDate.value)         markInvalid(fromDate,  'From Date is required.');
      if (!toDate.value)           markInvalid(toDate,    'To Date is required.');

      if (fromDate.value && toDate.value && toDate.value < fromDate.value) {
        markInvalid(toDate, 'To Date cannot be before From Date.');
      }

      if (editMode && status && !status.value) {
        markInvalid(status, 'Please select a status.');
      }

      if (!valid) return;

      // --- Future backend integration point ---
      const formData = {
        empId:     empId.value.trim(),
        leaveType: leaveType.value,
        fromDate:  fromDate.value,
        toDate:    toDate.value,
      };

      if (editMode) {
        formData.id = editingLeaveId;
        formData.status = status ? status.value : 'Pending';
        // Future: PUT /api/leaves/${editingLeaveId}
        console.log('Leave updated:', formData);
      } else {
        // Future: POST /api/leaves
        console.log('Leave created:', formData);
      }

      // Reset form and close drawer on success
      leaveForm.reset();
      closeDrawer();
    });
  }

  /* ------------------------------------------------------------------ */
  /*  FILTERS  (ready for future backend integration)                     */
  /* ------------------------------------------------------------------ */

  const filterDate      = document.getElementById('filterDate');
  const filterName      = document.getElementById('filterName');
  const filterLeaveType = document.getElementById('filterLeaveType');

  /**
   * Collects current filter values.
   * Hook this up to a fetch() call when the backend is ready.
   */
  function getFilterValues() {
    return {
      date:      filterDate      ? filterDate.value      : '',
      name:      filterName      ? filterName.value      : '',
      leaveType: filterLeaveType ? filterLeaveType.value : 'ALL',
    };
  }

  // Wire up filter change events for future use
  [filterDate, filterName, filterLeaveType].forEach(el => {
    if (el) {
      el.addEventListener('change', () => {
        // Future: fetch('/api/leaves?' + new URLSearchParams(getFilterValues()))
        //         .then(res => res.json()).then(data => renderTable(data));
        console.log('Filter changed:', getFilterValues());
      });
    }
  });

  if (filterName) {
    filterName.addEventListener('input', () => {
      console.log('Name filter:', getFilterValues());
    });
  }

});
