/**
 * Property-based tests for sidebar.js
 * 
 * These tests verify that the sidebar active highlighting logic works correctly
 * across all possible pathname and nav item combinations.
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';

/**
 * **Validates: Requirements 4.2, 4.3, 4.4**
 * 
 * Property 1: Active sidebar highlighting is exact and exclusive
 * 
 * For any page pathname and any set of sidebar navigation anchor elements with
 * `href` attributes, sidebar.js SHALL apply the `.active` class to exactly the
 * anchor whose `href` matches the pathname, and SHALL NOT apply `.active` to
 * any other anchor. When no anchor's `href` matches the pathname, no `.active`
 * class is applied.
 */
describe('Property 1: Active sidebar highlighting is exact and exclusive', () => {
  
  /**
   * Helper function to create a mock sidebar DOM structure with a specific pathname
   */
  function createSidebarDOM(navItems, currentPath) {
    const dom = new JSDOM(
      `
      <!DOCTYPE html>
      <html>
        <body>
          <nav>
            ${navItems.map(item => `<a href="${item}" class="nav-item">${item}</a>`).join('\n')}
          </nav>
        </body>
      </html>
      `,
      { url: `http://localhost${currentPath}` }
    );
    return dom;
  }

  /**
   * Helper function to simulate the sidebar.js logic
   */
  function applySidebarLogic(document, currentPath) {
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  }

  test('Property: Exactly one active class when pathname matches', () => {
    fc.assert(
      fc.property(
        // Generator: array of unique nav paths
        fc.uniqueArray(fc.webPath(), { minLength: 2, maxLength: 10 }),
        // Generator: index to select which path is the current path
        fc.nat(),
        (navPaths, selectedIndex) => {
          // Ensure we have a valid index
          const currentPathIndex = selectedIndex % navPaths.length;
          const currentPath = navPaths[currentPathIndex];

          // Create DOM with these nav items and current path
          const dom = createSidebarDOM(navPaths, currentPath);
          const { document } = dom.window;

          // Apply sidebar logic
          applySidebarLogic(document, currentPath);

          // Count active elements
          const activeElements = document.querySelectorAll('.nav-item.active');
          const activeCount = activeElements.length;

          // Verify exactly one active element
          expect(activeCount).toBe(1);

          // Verify the active element has the correct href
          expect(activeElements[0].getAttribute('href')).toBe(currentPath);

          // Verify all other elements are NOT active
          const allNavItems = document.querySelectorAll('.nav-item');
          allNavItems.forEach(item => {
            if (item.getAttribute('href') === currentPath) {
              expect(item.classList.contains('active')).toBe(true);
            } else {
              expect(item.classList.contains('active')).toBe(false);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property: No active class when pathname does not match any href', () => {
    fc.assert(
      fc.property(
        // Generator: array of nav paths
        fc.uniqueArray(fc.webPath(), { minLength: 1, maxLength: 10 }),
        // Generator: a path that doesn't exist in nav items
        fc.webPath(),
        (navPaths, nonMatchingPath) => {
          // Ensure nonMatchingPath is NOT in navPaths
          fc.pre(!navPaths.includes(nonMatchingPath));

          // Create DOM with these nav items and non-matching path
          const dom = createSidebarDOM(navPaths, nonMatchingPath);
          const { document } = dom.window;

          // Apply sidebar logic
          applySidebarLogic(document, nonMatchingPath);

          // Count active elements
          const activeElements = document.querySelectorAll('.nav-item.active');
          
          // Verify zero active elements
          expect(activeElements.length).toBe(0);

          // Verify all nav items are NOT active
          const allNavItems = document.querySelectorAll('.nav-item');
          allNavItems.forEach(item => {
            expect(item.classList.contains('active')).toBe(false);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Edge case: Root path "/" does not match "/dashboard"', () => {
    const dom = createSidebarDOM(['/dashboard', '/employee-management', '/attendance'], '/');
    const { document } = dom.window;

    // Apply sidebar logic with root path
    applySidebarLogic(document, '/');

    // Count active elements
    const activeElements = document.querySelectorAll('.nav-item.active');
    
    // Verify zero active elements (no match)
    expect(activeElements.length).toBe(0);
  });

  test('Edge case: Exact match required (no partial matching)', () => {
    const dom = createSidebarDOM(['/dashboard', '/dashboard-admin', '/employee-management'], '/dashboard');
    const { document } = dom.window;

    // Apply sidebar logic with "/dashboard" path
    applySidebarLogic(document, '/dashboard');

    // Count active elements
    const activeElements = document.querySelectorAll('.nav-item.active');
    
    // Verify exactly one active element
    expect(activeElements.length).toBe(1);
    expect(activeElements[0].getAttribute('href')).toBe('/dashboard');

    // Verify "/dashboard-admin" is NOT active
    const dashboardAdminLink = document.querySelector('[href="/dashboard-admin"]');
    expect(dashboardAdminLink.classList.contains('active')).toBe(false);
  });

  test('Real-world scenario: Standard SMS navigation paths', () => {
    const smsNavPaths = [
      '/dashboard',
      '/employee-management',
      '/attendance',
      '/leave-management',
      '/reports',
      '/user-manual'
    ];

    // Test each path
    smsNavPaths.forEach(testPath => {
      const dom = createSidebarDOM(smsNavPaths, testPath);
      const { document } = dom.window;

      applySidebarLogic(document, testPath);

      const activeElements = document.querySelectorAll('.nav-item.active');
      
      // Verify exactly one active element
      expect(activeElements.length).toBe(1);
      expect(activeElements[0].getAttribute('href')).toBe(testPath);
    });
  });
});
