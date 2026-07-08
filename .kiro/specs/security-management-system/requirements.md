# Requirements Document

## Introduction

This document defines the requirements for the Indorama Security Management System (SMS) frontend — a professional enterprise-grade web application built with Spring Boot, Thymeleaf templates, Tailwind CSS, and raw JavaScript. The application provides a desktop-first dashboard with KPI cards, a current duty status table, and placeholder pages for future modules. The architecture is designed for future backend integration and SQLite data persistence.

## Glossary

- **SMS**: Security Management System — the overall application being built.
- **Sidebar**: The fixed left navigation panel containing the Indorama logo, menu items, and a Logout button.
- **Layout Fragment**: A reusable Thymeleaf HTML fragment (`layout.html`) that defines the common page shell, including the sidebar and main content slot.
- **Sidebar Fragment**: A reusable Thymeleaf HTML fragment (`sidebar.html`) containing the navigation menu markup.
- **Dashboard**: The main landing page of the SMS displaying KPI cards and the Current Duty Status table.
- **KPI Card**: A white-background card displaying a metric label, a large colored metric value, and a colored icon box in the top-right corner.
- **Current Duty Status Table**: A tabular view showing guard assignments across shifts (A, B, C) per location, switchable between Plant and Township datasets.
- **Plant Dataset**: A hardcoded JavaScript array of 5 sample rows representing Plant guard duty assignments.
- **Township Dataset**: A hardcoded JavaScript array of 5 sample rows representing Township guard duty assignments.
- **Active Pill**: The blue pill-shaped background highlight applied to the currently active sidebar menu item.
- **Stub Page**: A page template that displays a page title and "Content Coming Soon" text, serving as a placeholder for future modules.
- **Tailwind CSS**: The utility-first CSS framework used for all styling.
- **Thymeleaf**: The Java server-side template engine used for HTML rendering in the Spring Boot application.
- **sidebar.js**: The JavaScript file responsible for reading `window.location.pathname` and applying the Active Pill class to the matching sidebar menu item.
- **dashboard.js**: The JavaScript file responsible for switching the Current Duty Status table between the Plant and Township datasets.

---

## Requirements

### Requirement 1: Project File Structure

**User Story:** As a developer, I want a well-organised output file structure, so that the project integrates cleanly with a Spring Boot / Thymeleaf application.

#### Acceptance Criteria

1. THE SMS SHALL produce the following output files:
   - `templates/fragments/sidebar.html`
   - `templates/fragments/layout.html`
   - `templates/dashboard.html`
   - `templates/employee-management.html`
   - `templates/attendance.html`
   - `templates/leave-management.html`
   - `templates/reports.html`
   - `templates/user-manual.html`
   - `static/js/dashboard.js`
   - `static/js/sidebar.js`
2. THE SMS SHALL use only Thymeleaf template syntax, Tailwind CSS utility classes, and raw JavaScript with no external frontend frameworks, libraries, or build tools beyond Tailwind CDN.

---

### Requirement 2: Reusable Layout Fragment

**User Story:** As a developer, I want a shared layout fragment, so that all pages share a consistent shell without duplicating markup.

#### Acceptance Criteria

1. THE Layout Fragment SHALL define a full HTML5 document shell that includes a `<head>` element with the Tailwind CSS CDN link, a `charset` meta tag, a `viewport` meta tag, and a dynamic `<title>` slot.
2. THE Layout Fragment SHALL include the Sidebar Fragment via a Thymeleaf `th:replace` or `th:insert` directive.
3. THE Layout Fragment SHALL define a main content area slot using a Thymeleaf fragment expression (`th:fragment`) so that individual pages can inject their own content.
4. THE Layout Fragment SHALL apply a fixed left sidebar and a scrollable right main content area using Tailwind CSS flex layout classes.
5. THE Layout Fragment SHALL include a `<script src="/static/js/sidebar.js">` tag so that sidebar active-state logic loads on every page.
6. WHEN a page template uses the Layout Fragment, THE Layout Fragment SHALL render the sidebar and the page-specific content in the correct positions without layout shift.

---

### Requirement 3: Reusable Sidebar Fragment

**User Story:** As a developer, I want a reusable sidebar fragment, so that navigation markup is maintained in one place across all pages.

#### Acceptance Criteria

1. THE Sidebar Fragment SHALL display the Indorama logo (SVG or `<img>` tag) at the top of the sidebar.
2. THE Sidebar Fragment SHALL render the following navigation menu items as anchor (`<a>`) elements with their corresponding `href` paths:
   - Dashboard → `/dashboard`
   - Employee Management → `/employee-management`
   - Attendance → `/attendance`
   - Leave Management → `/leave-management`
   - Reports → `/reports`
   - User Manual → `/user-manual`
3. THE Sidebar Fragment SHALL render a Logout link at the bottom of the sidebar, visually separated from the navigation items.
4. THE Sidebar Fragment SHALL assign a unique `id` or consistent `href` attribute to each menu anchor element so that `sidebar.js` can identify and highlight the active item.
5. THE Sidebar Fragment SHALL use Tailwind CSS classes to produce a dark or neutral-toned fixed-width sidebar panel.

---

### Requirement 4: URL-Based Active Sidebar Highlighting

**User Story:** As a user, I want the active sidebar menu item to be visually highlighted, so that I always know which section of the application I am viewing.

#### Acceptance Criteria

1. THE sidebar.js SHALL read `window.location.pathname` at page load without requiring any server-side Thymeleaf variables.
2. WHEN the page loads, THE sidebar.js SHALL compare `window.location.pathname` against the `href` attribute of each navigation anchor in the sidebar.
3. WHEN a sidebar anchor's `href` matches `window.location.pathname`, THE sidebar.js SHALL apply the Active Pill CSS class (blue pill background) to that anchor element.
4. WHEN no sidebar anchor's `href` matches `window.location.pathname`, THE sidebar.js SHALL leave all menu items in their default (inactive) style.
5. THE sidebar.js SHALL execute after the DOM is fully loaded, using a `DOMContentLoaded` event listener or equivalent placement at the end of `<body>`.

---

### Requirement 5: Dashboard Page Layout

**User Story:** As a security manager, I want a dashboard page with a clear header, so that I know the context of the information I am viewing.

#### Acceptance Criteria

1. THE Dashboard SHALL display a page title of "Dashboard" and a subtitle of "Welcome to Indorama Security Management System" at the top of the main content area.
2. THE Dashboard SHALL use the Layout Fragment as its page shell via Thymeleaf fragment composition.
3. THE Dashboard SHALL apply a light-gray background color to the main content area using Tailwind CSS.

---

### Requirement 6: KPI Cards Section

**User Story:** As a security manager, I want seven KPI cards arranged in a 4+3 grid, so that I can view key guard metrics at a glance.

#### Acceptance Criteria

1. THE Dashboard SHALL render exactly 7 KPI cards with the following labels and values:
   - Total Guards: 48
   - On Duty: 36
   - On EL: 3
   - On CL: 2
   - On ML: 1
   - Absent: 2
   - On Rest: 5
2. THE Dashboard SHALL arrange the 7 KPI cards in a two-row grid: 4 cards on the first row and 3 cards on the second row, using Tailwind CSS grid classes.
3. EACH KPI Card SHALL display a small gray metric label text, a large colored metric value, and a colored icon box positioned in the top-right corner of the card.
4. EACH KPI Card SHALL have a white background, rounded corners, and a subtle box shadow, styled using Tailwind CSS utility classes.
5. THE Dashboard SHALL render KPI cards using static Thymeleaf markup; the card values SHALL be hardcoded inline in the template for the initial implementation.

---

### Requirement 7: Current Duty Status Section

**User Story:** As a security manager, I want a Current Duty Status table with a Plant/Township toggle, so that I can review guard assignments per shift for either site.

#### Acceptance Criteria

1. THE Dashboard SHALL render a "Current Duty Status" section header below the KPI cards.
2. THE Dashboard SHALL display a dropdown element in the top-right corner of the Current Duty Status section header with the options "Plant" and "Township", defaulting to "Plant".
3. THE Dashboard SHALL render a table with the columns: Ser No., Location, A SHIFT, Ord, B SHIFT, Ord, C SHIFT, Ord.
4. THE Dashboard SHALL use a Thymeleaf `th:each="duty : ${duties}"` iteration to render the table body rows, with the `duties` model attribute populated with the Plant dataset by default.
5. THE Plant Dataset SHALL contain exactly 5 hardcoded sample rows of guard shift assignment data for Plant locations.
6. THE Township Dataset SHALL contain exactly 5 hardcoded sample rows of guard shift assignment data for Township locations.
7. WHEN the user selects "Plant" from the dropdown, THE dashboard.js SHALL replace the table body rows with the 5 Plant Dataset rows using DOM manipulation.
8. WHEN the user selects "Township" from the dropdown, THE dashboard.js SHALL replace the table body rows with the 5 Township Dataset rows using DOM manipulation.
9. THE dashboard.js SHALL define both datasets as hardcoded JavaScript arrays and SHALL NOT make any network requests to populate table data.
10. THE Current Duty Status table SHALL use a clean, minimal style with Tailwind CSS; guard name cells SHALL display colored text to aid visual distinction.

---

### Requirement 8: Stub Pages for Future Modules

**User Story:** As a developer, I want placeholder pages for all non-dashboard modules, so that navigation links are functional and the application structure is ready for future development.

#### Acceptance Criteria

1. THE SMS SHALL provide a stub page template for each of the following routes: `/employee-management`, `/attendance`, `/leave-management`, `/reports`, `/user-manual`.
2. EACH Stub Page SHALL use the Layout Fragment as its page shell via Thymeleaf fragment composition.
3. EACH Stub Page SHALL display the module name as the page title and the text "Content Coming Soon" as the page body content.
4. EACH Stub Page SHALL apply consistent padding and typography using Tailwind CSS so that the stub content is visually aligned with the dashboard layout.

---

### Requirement 9: No Top Navbar or Header Toolbar

**User Story:** As a designer, I want no top navbar, header toolbar, profile section, or notification section in the layout, so that the interface remains clean and focused on the sidebar-driven navigation model.

#### Acceptance Criteria

1. THE Layout Fragment SHALL NOT render any top navigation bar, header toolbar, profile icon, notification bell, or user account section.
2. THE Layout Fragment SHALL render only the fixed left Sidebar Fragment and the main content area as the two top-level layout regions.

---

### Requirement 10: Desktop-First Responsive Design

**User Story:** As a security manager, I want the application optimised for desktop screens, so that the dashboard is fully usable on workstation monitors without horizontal scrolling.

#### Acceptance Criteria

1. THE SMS SHALL target desktop viewport widths as the primary design breakpoint, with a minimum supported layout width of 1024px.
2. THE Sidebar Fragment SHALL have a fixed pixel width (e.g., `w-64`) so that the main content area takes the remaining horizontal space.
3. THE Layout Fragment SHALL use a flex row layout so that the sidebar and main content sit side-by-side without overlap.
4. WHERE a mobile breakpoint class is applied, THE SMS SHALL do so only as a progressive enhancement and SHALL NOT break the desktop layout.
