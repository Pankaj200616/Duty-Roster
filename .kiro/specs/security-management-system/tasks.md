# Implementation Plan: Security Management System Frontend

## Overview

Implement the Indorama Security Management System frontend as a set of Thymeleaf templates and vanilla JavaScript files, structured for direct integration with a Spring Boot application. All output files are frontend-only — no backend code, controllers, services, or database code. Tailwind CSS is loaded via CDN; no build pipeline is used.

Tech stack: Thymeleaf, Tailwind CSS CDN, raw vanilla JavaScript.

---

## Tasks

- [x] 1. Create reusable Thymeleaf fragments (layout and sidebar)
  - [x] 1.1 Implement `templates/fragments/layout.html`
    - Create the full HTML5 document shell with `<head>` containing Tailwind CSS CDN link, `charset` meta tag, `viewport` meta tag, and a dynamic `<title th:text="${pageTitle} ?: 'SMS'">` slot
    - Include the Sidebar Fragment via `<div th:replace="~{fragments/sidebar :: sidebar}"></div>`
    - Define a `<main>` content slot using `th:replace="~{::content}"` so each page can inject its own markup
    - Apply Tailwind flex layout classes: `flex h-screen bg-gray-100 overflow-hidden` on `<body>`, `flex-1 overflow-y-auto` on `<main>`
    - Include `<script src="/static/js/sidebar.js"></script>` just before `</body>`
    - DO NOT render any top navbar, header toolbar, profile icon, or notification section
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 9.1, 9.2, 10.3_

  - [x] 1.2 Implement `templates/fragments/sidebar.html`
    - Declare the fragment with `th:fragment="sidebar"` on an `<aside>` element with classes `w-64 bg-white shadow-lg flex flex-col`
    - Render the Indorama logo using `<img src="/static/indorama-logo.svg" alt="Indorama" class="h-10" />` inside a bordered `<div class="p-6 border-b">`
    - Render the 6 navigation anchor elements inside `<nav class="flex-1 py-4 px-2 space-y-1">` with class `nav-item` and exact `href` values: `/dashboard`, `/employee-management`, `/attendance`, `/leave-management`, `/reports`, `/user-manual`
    - Render a Logout anchor at the bottom inside `<div class="p-4 border-t">` using the same `nav-item` class and `href="/logout"`
    - Add inline `<style>` block defining `.nav-item` (block, padded, rounded, gray text, hover bg) and `.nav-item.active` (blue bg, white text)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 10.2_

- [x] 2. Implement sidebar active-state JavaScript
  - [x] 2.1 Implement `static/js/sidebar.js`
    - Wrap logic in a `DOMContentLoaded` event listener
    - Read `window.location.pathname`
    - Use `document.querySelectorAll('.nav-item')` to get all nav anchors
    - Iterate and apply `link.classList.add('active')` where `link.getAttribute('href') === currentPath` (exact match only)
    - If no href matches, leave all items in default state — do not throw errors
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 2.2 Write property test for sidebar active highlighting (Property 1)
    - **Property 1: Active sidebar highlighting is exact and exclusive**
    - Test that for any given pathname, exactly one `.active` class is applied when a match exists, and zero when no match exists
    - Test the no-match case (e.g., `/` does not match `/dashboard`)
    - **Validates: Requirements 4.2, 4.3, 4.4**

- [ ] 3. Implement the Dashboard page
  - [x] 3.1 Implement `templates/dashboard.html` — page shell and header
    - Use Thymeleaf fragment composition: `th:replace="~{fragments/layout :: layout(~{::content})}"` on `<html>`
    - Declare `<th:block th:fragment="content">` inside `<body>` to wrap all dashboard markup
    - Wrap all content in `<div class="p-8">` for consistent padding
    - Render the page header: `<h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>` and `<p class="text-gray-500 mt-1">Welcome to Indorama Security Management System</p>`
    - Include `<script src="/static/js/dashboard.js"></script>` at the bottom of the content block
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 3.2 Add KPI cards section to `templates/dashboard.html`
    - Render exactly 7 KPI cards with hardcoded inline values (Total Guards: 48, On Duty: 36, On EL: 3, On CL: 2, On ML: 1, Absent: 2, On Rest: 5)
    - Use a single `<div class="grid grid-cols-4 gap-4 mb-6">` grid; the 7th card starts the second row naturally
    - Each card: `<div class="bg-white rounded-xl shadow p-5 relative">` containing a top-right icon box (`absolute top-4 right-4 w-10 h-10 rounded-lg flex items-center justify-center` + color classes), a `<p>` label with `text-xs text-gray-400 uppercase tracking-wide`, and a `<p>` value with `text-3xl font-bold` + per-card color class
    - Color scheme per card: Total Guards = blue, On Duty = green, On EL = purple, On CL = orange, On ML = teal, Absent = red, On Rest = indigo
    - Use inline SVG icons inside each icon box (shield, user-check, calendar, or equivalent minimal icons)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [-] 3.3 Write property test for KPI card structure (Property 2)
    - **Property 2: Every KPI card contains the required structural elements**
    - Test that each of the 7 rendered cards contains: a label element with gray text class, a value element with a color class, and an icon box with `absolute` positioning
    - Test that each card has `bg-white`, `rounded-xl`, and `shadow` classes
    - **Validates: Requirements 6.3, 6.4**

  - [x] 3.4 Add Current Duty Status section to `templates/dashboard.html`
    - Render a `<section class="bg-white rounded-xl shadow p-6 mt-6">` below the KPI grid
    - Inside, render a flex header row with the `<h2>Current Duty Status</h2>` heading and a `<select id="siteSelector">` with `<option value="plant" selected>Plant</option>` and `<option value="township">Township</option>`
    - Render the duty table with columns: Ser No., Location, A SHIFT, Ord, B SHIFT, Ord, C SHIFT, Ord — with `<thead class="bg-gray-50">` and styled `<th>` cells
    - Add a `<tbody id="dutyTableBody">` with a `th:each="duty : ${duties}"` loop rendering each field via `th:text` — this enables future backend integration
    - Apply table styling: `w-full text-sm text-left text-gray-700`, `<th>` with padding and border-bottom
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 4. Implement Dashboard JavaScript
  - [x] 4.1 Implement `static/js/dashboard.js`
    - Wrap all logic in a `DOMContentLoaded` event listener
    - Define `plantData` as a hardcoded array of exactly 5 objects: `{ serNo, location, aShift, aOrd, bShift, bOrd, cShift, cOrd }` for locations: Main Gate A, Main Gate B, Admin Building, Warehouse, Control Room
    - Define `townshipData` as a hardcoded array of exactly 5 objects for locations: Township Main Gate, Township West Gate, Township Clubhouse, Township Park Entry, Township Admin Block
    - Implement `renderTable(data)` that sets `tableBody.innerHTML = ''` then appends one `<tr>` per row; A SHIFT cells use `text-blue-600`, B SHIFT cells use `text-green-600`, C SHIFT cells use `text-purple-600`
    - Attach a `change` event listener to `#siteSelector` that calls `renderTable(plantData)` or `renderTable(townshipData)` based on `e.target.value`
    - Call `renderTable(plantData)` immediately on load as the initial render
    - Make NO network requests (no fetch, no XHR)
    - _Requirements: 7.5, 7.6, 7.7, 7.8, 7.9, 7.10_

  - [-] 4.2 Write property test for dataset selection (Property 3)
    - **Property 3: Dataset selection fully replaces table body rows**
    - Test that after calling `renderTable(plantData)`, the tbody contains exactly 5 rows with Plant location values
    - Test that after calling `renderTable(townshipData)`, the tbody contains exactly 5 rows with Township location values and zero rows from the Plant dataset
    - Test that switching datasets twice (Plant → Township → Plant) results in the correct final state
    - **Validates: Requirements 7.7, 7.8**

- [~] 5. Checkpoint — Verify core layout and dashboard
  - Ensure all tests pass, ask the user if questions arise.
  - Confirm: layout.html and sidebar.html fragments load without Thymeleaf errors
  - Confirm: dashboard.html renders header, 7 KPI cards, and the duty table
  - Confirm: sidebar.js highlights the correct nav item
  - Confirm: dashboard.js switches table data on dropdown change

- [ ] 6. Implement stub pages for future modules
  - [-] 6.1 Implement `templates/employee-management.html`
    - Use `th:replace="~{fragments/layout :: layout(~{::content})}"` on `<html>`
    - Declare `<th:block th:fragment="content">` inside `<body>`
    - Render `<div class="p-8"><h1 class="text-2xl font-bold text-gray-800">Employee Management</h1><p class="text-gray-500 mt-2">Content Coming Soon</p></div>`
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [-] 6.2 Implement `templates/attendance.html`
    - Same pattern as 6.1 with title "Attendance"
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [-] 6.3 Implement `templates/leave-management.html`
    - Same pattern as 6.1 with title "Leave Management"
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [-] 6.4 Implement `templates/reports.html`
    - Same pattern as 6.1 with title "Reports"
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [-] 6.5 Implement `templates/user-manual.html`
    - Same pattern as 6.1 with title "User Manual"
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [~] 6.6 Write structural validation tests for stub pages (Property 4)
    - **Property 4: Every stub page follows the required structural pattern**
    - Test that each stub page HTML contains a `th:replace` reference to `fragments/layout`
    - Test that each stub page contains the module name as an `<h1>` heading
    - Test that each stub page contains the text "Content Coming Soon"
    - Test that each stub page's content is wrapped in a `<div class="p-8">`
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4**

- [~] 7. Final checkpoint — All files verified
  - Ensure all tests pass, ask the user if questions arise.
  - Confirm all 10 output files are present: `templates/fragments/sidebar.html`, `templates/fragments/layout.html`, `templates/dashboard.html`, `templates/employee-management.html`, `templates/attendance.html`, `templates/leave-management.html`, `templates/reports.html`, `templates/user-manual.html`, `static/js/dashboard.js`, `static/js/sidebar.js`
  - Confirm no frontend framework, npm dependency, or build tool was introduced
  - _Requirements: 1.1, 1.2_

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- All files are frontend-only — no Spring MVC controllers, services, or database code should be created
- The Thymeleaf `th:each="duty : ${duties}"` loop in the duty table is intentionally left in place for future backend integration; `dashboard.js` re-renders via DOM manipulation on dropdown change
- The indorama-logo.svg reference in sidebar.html assumes the file will be placed at `src/main/resources/static/indorama-logo.svg` by the project team
- Tailwind CDN is the only external dependency; no npm or build pipeline is needed
- Property tests (tasks 2.2, 3.3, 4.2, 6.6) are best implemented as simple JavaScript/HTML DOM assertions using a lightweight test runner or plain Node.js scripts, since no frontend framework is in use

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "3.1"] },
    { "id": 2, "tasks": ["2.2", "3.2", "3.4", "4.1"] },
    { "id": 3, "tasks": ["3.3", "4.2", "6.1", "6.2", "6.3", "6.4", "6.5"] },
    { "id": 4, "tasks": ["6.6"] }
  ]
}
```
