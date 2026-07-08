# Design Document

## Introduction

This document describes the architecture and implementation design for the Indorama Security Management System (SMS) frontend. The system is a desktop-first web application built with Spring Boot, Thymeleaf templates, Tailwind CSS (CDN), and raw JavaScript. No frontend frameworks, build tools, or JavaScript bundlers are used beyond the Tailwind CDN script tag.

---

## Architecture Overview

The frontend follows a classic server-side rendering architecture using Thymeleaf as the template engine. Pages are composed from reusable fragments, and all interactivity is handled by vanilla JavaScript loaded from the `static/js/` directory.

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Desktop)                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Thymeleaf-rendered HTML + Tailwind CSS          │   │
│  │  ┌────────────┐  ┌───────────────────────────┐   │   │
│  │  │  Sidebar   │  │     Main Content Area     │   │   │
│  │  │ (Fragment) │  │  (Page-specific content)  │   │   │
│  │  └────────────┘  └───────────────────────────┘   │   │
│  └──────────────────────────────────────────────────┘   │
│  sidebar.js (active highlight)   dashboard.js (table)   │
└─────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Fragment-based composition**: Common shell (layout) and navigation (sidebar) are reusable Thymeleaf fragments.
2. **No build pipeline**: Tailwind CSS is loaded via CDN; no npm, webpack, or PostCSS.
3. **Pure DOM scripting**: All JavaScript is vanilla, event-driven, and side-effect-free beyond DOM manipulation.
4. **Hardcoded seed data**: All dashboard values and table datasets are static for the initial implementation — no AJAX or fetch calls.
5. **Backend-integration ready**: Thymeleaf model attributes (`${duties}`) and `th:each` iteration are structured so a Spring MVC controller can populate data in future.

---

## File Structure

```
src/main/
├── resources/
│   ├── templates/
│   │   ├── fragments/
│   │   │   ├── layout.html          # Shared page shell
│   │   │   └── sidebar.html         # Navigation sidebar
│   │   ├── dashboard.html           # Main dashboard page
│   │   ├── employee-management.html # Stub page
│   │   ├── attendance.html          # Stub page
│   │   ├── leave-management.html    # Stub page
│   │   ├── reports.html             # Stub page
│   │   └── user-manual.html         # Stub page
│   └── static/
│       └── js/
│           ├── sidebar.js           # Active nav highlighting
│           └── dashboard.js         # Duty status table switching
```

---

## Component Designs

### 2.1 Layout Fragment (`templates/fragments/layout.html`)

The layout fragment is the master page shell. Every page includes it via `th:replace`.

**Responsibilities:**
- Render the full HTML5 document structure
- Load Tailwind CSS via CDN in `<head>`
- Include the sidebar fragment
- Provide a `content` slot for page-specific markup
- Load `sidebar.js` before `</body>`

**Structure:**
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title th:text="${pageTitle} ?: 'SMS'">SMS</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex h-screen bg-gray-100 overflow-hidden">
  <!-- Sidebar slot -->
  <div th:replace="~{fragments/sidebar :: sidebar}"></div>
  <!-- Main content slot -->
  <main class="flex-1 overflow-y-auto" th:replace="~{::content}">
    <!-- Page content injected here -->
  </main>
  <script src="/static/js/sidebar.js"></script>
</body>
</html>
```

**Tailwind Layout Classes:**
- `flex`: Enables flex row layout on `<body>`
- `h-screen`: Full viewport height
- `overflow-hidden`: Prevents body scroll; each region scrolls independently
- `flex-1 overflow-y-auto`: Main area grows to fill remaining width, scrolls vertically


---

### 2.2 Sidebar Fragment (`templates/fragments/sidebar.html`)

**Responsibilities:**
- Display Indorama logo
- Render 6 navigation menu items with correct `href` paths
- Render Logout link at bottom
- Assign unique `href` attributes for active-state matching

**Structure:**
```html
<aside th:fragment="sidebar" class="w-64 bg-white shadow-lg flex flex-col">
  <!-- Logo -->
  <div class="p-6 border-b">
    <img src="/static/indorama-logo.svg" alt="Indorama" class="h-10" />
  </div>

  <!-- Navigation Menu -->
  <nav class="flex-1 py-4 px-2 space-y-1">
    <a href="/dashboard" class="nav-item">Dashboard</a>
    <a href="/employee-management" class="nav-item">Employee Management</a>
    <a href="/attendance" class="nav-item">Attendance</a>
    <a href="/leave-management" class="nav-item">Leave Management</a>
    <a href="/reports" class="nav-item">Reports</a>
    <a href="/user-manual" class="nav-item">User Manual</a>
  </nav>

  <!-- Logout -->
  <div class="p-4 border-t">
    <a href="/logout" class="nav-item">Logout</a>
  </div>
</aside>
```

**Tailwind Classes:**
- `w-64`: Fixed width of 16rem (256px)
- `bg-white`: White background
- `shadow-lg`: Drop shadow for visual separation
- `flex flex-col`: Vertical flex to push Logout to bottom
- `nav-item`: Custom class for anchor styling (hover, active)

**CSS for Active Pill (applied by sidebar.js):**
```css
.nav-item { @apply block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100; }
.nav-item.active { @apply bg-blue-500 text-white; }
```

---

### 2.3 sidebar.js — Active Navigation Highlighting

**Responsibilities:**
- Read `window.location.pathname` on page load
- Compare pathname to each nav anchor's `href`
- Apply `.active` class to matching anchor

**Implementation:**
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-item');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
});
```

**Edge Cases:**
- If no href matches, all links remain in default (gray hover) state
- Root path `/` does not match `/dashboard` (exact match only)

---

### 2.4 Dashboard Page (`templates/dashboard.html`)

**Responsibilities:**
- Compose with layout fragment
- Render page header (title + subtitle)
- Render 7 KPI cards in a 4+3 grid
- Render Current Duty Status section with dropdown + table
- Load `dashboard.js` for table switching

**Thymeleaf Composition Pattern:**
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
      th:replace="~{fragments/layout :: layout(~{::content})}">
<body>
  <th:block th:fragment="content">
    <!-- Dashboard-specific markup here -->
  </th:block>
</body>
</html>
```

**Page Header:**
```html
<div class="mb-6">
  <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
  <p class="text-gray-500 mt-1">Welcome to Indorama Security Management System</p>
</div>
```

---

### 2.5 KPI Cards Section

**Data Model (static, hardcoded in template):**

| Label         | Value | Color  | Icon Color |
|---------------|-------|--------|------------|
| Total Guards  | 48    | blue   | blue       |
| On Duty       | 36    | green  | green      |
| On EL         | 3     | purple | purple     |
| On CL         | 2     | orange | orange     |
| On ML         | 1     | teal   | teal       |
| Absent        | 2     | red    | red        |
| On Rest       | 5     | indigo | indigo     |

**Grid Layout (Tailwind):**
- Row 1: `grid grid-cols-4 gap-4` — 4 cards (Total Guards, On Duty, On EL, On CL)
- Row 2: `grid grid-cols-4 gap-4` — 3 cards starting from column 1 (On ML, Absent, On Rest) with `col-span-1` each

Alternative approach: single `grid grid-cols-4` with 7 items (last row has 3 + 1 empty cell).

**Card Structure (per card):**
```html
<div class="bg-white rounded-xl shadow p-5 relative">
  <!-- Top-right colored icon box -->
  <div class="absolute top-4 right-4 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
    <svg class="w-5 h-5 text-blue-600"><!-- icon --></svg>
  </div>
  <!-- Metric label -->
  <p class="text-xs text-gray-400 uppercase tracking-wide">Total Guards</p>
  <!-- Metric value -->
  <p class="text-3xl font-bold text-blue-600 mt-1">48</p>
</div>
```

---

### 2.6 Current Duty Status Section

**Structure:**
```html
<section class="bg-white rounded-xl shadow p-6 mt-6">
  <!-- Header with dropdown -->
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-lg font-bold text-gray-800">Current Duty Status</h2>
    <select id="siteSelector" class="border border-gray-300 rounded-md px-3 py-1 text-sm">
      <option value="plant" selected>Plant</option>
      <option value="township">Township</option>
    </select>
  </div>

  <!-- Table -->
  <table class="w-full text-sm text-left text-gray-700">
    <thead class="bg-gray-50">
      <tr>
        <th>Ser No.</th><th>Location</th>
        <th>A SHIFT</th><th>Ord</th>
        <th>B SHIFT</th><th>Ord</th>
        <th>C SHIFT</th><th>Ord</th>
      </tr>
    </thead>
    <tbody id="dutyTableBody">
      <tr th:each="duty : ${duties}">
        <td th:text="${duty.serNo}"></td>
        <td th:text="${duty.location}"></td>
        <td th:text="${duty.aShift}"></td>
        <td th:text="${duty.aOrd}"></td>
        <td th:text="${duty.bShift}"></td>
        <td th:text="${duty.bOrd}"></td>
        <td th:text="${duty.cShift}"></td>
        <td th:text="${duty.cOrd}"></td>
      </tr>
    </tbody>
  </table>
</section>
```

**Data Model (`dashboard.js` datasets):**

Each dataset is an array of 5 row objects:
```javascript
const plantData = [
  { serNo: 1, location: 'Main Gate A', aShift: 'Guard A1', aOrd: 'Yes', bShift: 'Guard B1', bOrd: 'No', cShift: 'Guard C1', cOrd: 'Yes' },
  // ... 4 more rows
];

const townshipData = [
  { serNo: 1, location: 'Township Gate 1', aShift: 'Guard T1', aOrd: 'No', bShift: 'Guard T2', bOrd: 'Yes', cShift: 'Guard T3', cOrd: 'No' },
  // ... 4 more rows
];
```

**dashboard.js logic:**
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('siteSelector');
  const tableBody = document.getElementById('dutyTableBody');

  const plantData = [ /* ... */ ];
  const townshipData = [ /* ... */ ];

  function renderTable(data) {
    tableBody.innerHTML = '';
    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.serNo}</td>
        <td>${row.location}</td>
        <td class="text-blue-600">${row.aShift}</td>
        <td>${row.aOrd}</td>
        <td class="text-green-600">${row.bShift}</td>
        <td>${row.bOrd}</td>
        <td class="text-purple-600">${row.cShift}</td>
        <td>${row.cOrd}</td>
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
```

**Note:** Colored text classes on guard name cells (A SHIFT = blue, B SHIFT = green, C SHIFT = purple) provide visual distinction.

---

### 2.7 Stub Pages (5 modules)

Each stub page follows an identical pattern. They differ only in the page title and module name.

| File                          | Route                   | Title               |
|-------------------------------|-------------------------|---------------------|
| `employee-management.html`    | `/employee-management`  | Employee Management |
| `attendance.html`             | `/attendance`           | Attendance          |
| `leave-management.html`       | `/leave-management`     | Leave Management    |
| `reports.html`                | `/reports`              | Reports             |
| `user-manual.html`            | `/user-manual`          | User Manual         |

**Stub Page Template Pattern:**
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
      th:replace="~{fragments/layout :: layout(~{::content})}">
<body>
  <th:block th:fragment="content">
    <div class="p-8">
      <h1 class="text-2xl font-bold text-gray-800">Employee Management</h1>
      <p class="text-gray-500 mt-2">Content Coming Soon</p>
    </div>
  </th:block>
</body>
</html>
```

---

## Data Models

### Duty Row Object

Used in both Plant and Township datasets:

```typescript
// Pseudocode interface
DutyRow {
  serNo:    number    // Serial number (1–5)
  location: string   // Location name (gate, building, etc.)
  aShift:   string   // Guard name for A Shift
  aOrd:     string   // Orderly for A Shift ("Yes"/"No" or a name)
  bShift:   string   // Guard name for B Shift
  bOrd:     string   // Orderly for B Shift
  cShift:   string   // Guard name for C Shift
  cOrd:     string   // Orderly for C Shift
}
```

### Plant Dataset (5 rows)

| Ser | Location         |
|-----|------------------|
| 1   | Main Gate A      |
| 2   | Main Gate B      |
| 3   | Admin Building   |
| 4   | Warehouse        |
| 5   | Control Room     |

### Township Dataset (5 rows)

| Ser | Location              |
|-----|-----------------------|
| 1   | Township Main Gate    |
| 2   | Township West Gate    |
| 3   | Township Clubhouse    |
| 4   | Township Park Entry   |
| 5   | Township Admin Block  |

---

## Error Handling

Since this is a static frontend with no network calls:

- **Missing Tailwind CDN**: If CDN fails to load, the page renders unstyled but remains functional. No error handling needed in JS.
- **No data from backend**: The initial render uses hardcoded JS data. Thymeleaf iteration falls back to the server-rendered rows on first load. `dashboard.js` re-renders on dropdown change using JS data.
- **Sidebar active state**: If pathname doesn't match any nav link, no error is thrown — all items remain in default state (Requirement 4.4).
- **DOM not ready**: Both `sidebar.js` and `dashboard.js` use `DOMContentLoaded` to prevent "element not found" errors.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Active sidebar highlighting is exact and exclusive

*For any* page pathname and any set of sidebar navigation anchor elements with `href` attributes, `sidebar.js` SHALL apply the `.active` class to exactly the anchor whose `href` matches the pathname, and SHALL NOT apply `.active` to any other anchor. When no anchor's `href` matches the pathname, no `.active` class is applied.

**Validates: Requirements 4.2, 4.3, 4.4**

---

### Property 2: Every KPI card contains the required structural elements

*For any* KPI card rendered on the dashboard, the card SHALL contain a metric label element with gray text, a numeric value element with a color class matching the card's designated color scheme, and an icon box element positioned in the top-right corner with a matching background color class. The card SHALL also have a white background class, a rounded corners class, and a shadow class.

**Validates: Requirements 6.3, 6.4**

---

### Property 3: Dataset selection fully replaces table rows

*For any* dropdown selection event (Plant or Township), `dashboard.js` SHALL replace all existing table body rows with exactly 5 rows from the selected dataset, where each row's cell values match the corresponding fields of the selected dataset objects in order. No rows from the previously displayed dataset SHALL remain after the switch.

**Validates: Requirements 7.7, 7.8**

---

### Property 4: Every stub page follows the required structural pattern

*For any* stub page template in the set of five module pages, the template SHALL include a Thymeleaf fragment composition reference to the layout fragment, SHALL display the module name as its page title heading, and SHALL display the text "Content Coming Soon" as its body content with Tailwind padding classes applied.

**Validates: Requirements 8.1, 8.2, 8.3, 8.4**
