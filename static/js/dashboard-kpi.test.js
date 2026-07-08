/**
 * Property-based tests for KPI cards structure in dashboard
 * 
 * These tests verify that all KPI cards on the dashboard contain the required
 * structural elements and styling classes.
 */

import { describe, test, expect } from '@jest/globals';
import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory path for loading the dashboard HTML
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * **Validates: Requirements 6.3, 6.4**
 * 
 * Property 2: Every KPI card contains the required structural elements
 * 
 * For any KPI card rendered on the dashboard, the card SHALL contain a metric
 * label element with gray text, a numeric value element with a color class
 * matching the card's designated color scheme, and an icon box element
 * positioned in the top-right corner with a matching background color class.
 * The card SHALL also have a white background class, a rounded corners class,
 * and a shadow class.
 */
describe('Property 2: Every KPI card contains the required structural elements', () => {

  /**
   * Load the dashboard HTML template and strip Thymeleaf directives for testing
   */
  function loadDashboardHTML() {
    const dashboardPath = join(__dirname, '..', '..', 'templates', 'dashboard.html');
    let htmlContent = readFileSync(dashboardPath, 'utf-8');
    
    // Strip Thymeleaf namespace and directives to make it parseable
    htmlContent = htmlContent
      .replace(/xmlns:th="[^"]*"/g, '')
      .replace(/th:replace="[^"]*"/g, '')
      .replace(/th:fragment="[^"]*"/g, '')
      .replace(/th:each="[^"]*"/g, '')
      .replace(/th:text="\$\{[^}]*\}"/g, '');
    
    return htmlContent;
  }

  /**
   * Expected KPI card configurations
   */
  const expectedKPICards = [
    { label: 'Total Guards', value: '48', colorClass: 'blue', bgColorClass: 'bg-blue-100', textColorClass: 'text-blue-600' },
    { label: 'On Duty', value: '36', colorClass: 'green', bgColorClass: 'bg-green-100', textColorClass: 'text-green-600' },
    { label: 'On EL', value: '3', colorClass: 'purple', bgColorClass: 'bg-purple-100', textColorClass: 'text-purple-600' },
    { label: 'On CL', value: '2', colorClass: 'orange', bgColorClass: 'bg-orange-100', textColorClass: 'text-orange-600' },
    { label: 'On ML', value: '1', colorClass: 'teal', bgColorClass: 'bg-teal-100', textColorClass: 'text-teal-600' },
    { label: 'Absent', value: '2', colorClass: 'red', bgColorClass: 'bg-red-100', textColorClass: 'text-red-600' },
    { label: 'On Rest', value: '5', colorClass: 'indigo', bgColorClass: 'bg-indigo-100', textColorClass: 'text-indigo-600' }
  ];

  test('Property: All 7 KPI cards have required structural classes', () => {
    const htmlContent = loadDashboardHTML();
    const dom = new JSDOM(htmlContent);
    const { document } = dom.window;

    // Find all KPI cards (they should be direct children of the grid with specific classes)
    const kpiGrid = document.querySelector('.grid.grid-cols-4');
    expect(kpiGrid).toBeTruthy();

    const kpiCards = kpiGrid.querySelectorAll('div.bg-white.rounded-xl.shadow.relative');
    
    // Verify we have exactly 7 cards
    expect(kpiCards.length).toBe(7);

    // Test each card
    kpiCards.forEach((card, index) => {
      // Verify card has required structural classes
      expect(card.classList.contains('bg-white')).toBe(true);
      expect(card.classList.contains('rounded-xl')).toBe(true);
      expect(card.classList.contains('shadow')).toBe(true);
      expect(card.classList.contains('relative')).toBe(true);
    });
  });

  test('Property: Every KPI card contains a label element with gray text class', () => {
    const htmlContent = loadDashboardHTML();
    const dom = new JSDOM(htmlContent);
    const { document } = dom.window;

    const kpiGrid = document.querySelector('.grid.grid-cols-4');
    const kpiCards = kpiGrid.querySelectorAll('div.bg-white.rounded-xl.shadow.relative');

    kpiCards.forEach((card, index) => {
      // Find label element (should have text-gray-400 class)
      const labelElement = card.querySelector('p.text-xs.text-gray-400.uppercase.tracking-wide');
      
      expect(labelElement).toBeTruthy();
      expect(labelElement.classList.contains('text-gray-400')).toBe(true);
      expect(labelElement.classList.contains('uppercase')).toBe(true);
      expect(labelElement.classList.contains('tracking-wide')).toBe(true);
    });
  });

  test('Property: Every KPI card contains a value element with a color class', () => {
    const htmlContent = loadDashboardHTML();
    const dom = new JSDOM(htmlContent);
    const { document } = dom.window;

    const kpiGrid = document.querySelector('.grid.grid-cols-4');
    const kpiCards = kpiGrid.querySelectorAll('div.bg-white.rounded-xl.shadow.relative');

    // Color classes that should be present in value elements
    const validColorClasses = ['text-blue-600', 'text-green-600', 'text-purple-600', 
                               'text-orange-600', 'text-teal-600', 'text-red-600', 'text-indigo-600'];

    kpiCards.forEach((card, index) => {
      // Find value element (should have text-3xl font-bold and a color class)
      const valueElement = card.querySelector('p.text-3xl.font-bold');
      
      expect(valueElement).toBeTruthy();
      expect(valueElement.classList.contains('text-3xl')).toBe(true);
      expect(valueElement.classList.contains('font-bold')).toBe(true);
      
      // Check that the value element has at least one valid color class
      const hasColorClass = validColorClasses.some(colorClass => 
        valueElement.classList.contains(colorClass)
      );
      expect(hasColorClass).toBe(true);
    });
  });

  test('Property: Every KPI card contains an icon box with absolute positioning', () => {
    const htmlContent = loadDashboardHTML();
    const dom = new JSDOM(htmlContent);
    const { document } = dom.window;

    const kpiGrid = document.querySelector('.grid.grid-cols-4');
    const kpiCards = kpiGrid.querySelectorAll('div.bg-white.rounded-xl.shadow.relative');

    kpiCards.forEach((card, index) => {
      // Find icon box element (should have absolute positioning)
      const iconBox = card.querySelector('div.absolute.top-4.right-4');
      
      expect(iconBox).toBeTruthy();
      expect(iconBox.classList.contains('absolute')).toBe(true);
      expect(iconBox.classList.contains('top-4')).toBe(true);
      expect(iconBox.classList.contains('right-4')).toBe(true);
      expect(iconBox.classList.contains('rounded-lg')).toBe(true);
      expect(iconBox.classList.contains('flex')).toBe(true);
      expect(iconBox.classList.contains('items-center')).toBe(true);
      expect(iconBox.classList.contains('justify-center')).toBe(true);
    });
  });

  test('Property: Icon box has matching background color class', () => {
    const htmlContent = loadDashboardHTML();
    const dom = new JSDOM(htmlContent);
    const { document } = dom.window;

    const kpiGrid = document.querySelector('.grid.grid-cols-4');
    const kpiCards = kpiGrid.querySelectorAll('div.bg-white.rounded-xl.shadow.relative');

    // Background color classes that should be present
    const validBgColorClasses = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 
                                  'bg-orange-100', 'bg-teal-100', 'bg-red-100', 'bg-indigo-100'];

    kpiCards.forEach((card, index) => {
      const iconBox = card.querySelector('div.absolute.top-4.right-4');
      
      // Check that the icon box has at least one valid background color class
      const hasBgColorClass = validBgColorClasses.some(bgColorClass => 
        iconBox.classList.contains(bgColorClass)
      );
      expect(hasBgColorClass).toBe(true);
    });
  });

  test('Property-based: Card color consistency across label value and icon', () => {
    fc.assert(
      fc.property(
        // Generator: select a random card index (0-6)
        fc.integer({ min: 0, max: 6 }),
        (cardIndex) => {
          const htmlContent = loadDashboardHTML();
          const dom = new JSDOM(htmlContent);
          const { document } = dom.window;

          const kpiGrid = document.querySelector('.grid.grid-cols-4');
          const kpiCards = kpiGrid.querySelectorAll('div.bg-white.rounded-xl.shadow.relative');
          const card = kpiCards[cardIndex];

          const expectedCard = expectedKPICards[cardIndex];

          // Get value element and icon box
          const valueElement = card.querySelector('p.text-3xl.font-bold');
          const iconBox = card.querySelector('div.absolute.top-4.right-4');

          // Verify value element has the expected text color
          expect(valueElement.classList.contains(expectedCard.textColorClass)).toBe(true);

          // Verify icon box has the expected background color
          expect(iconBox.classList.contains(expectedCard.bgColorClass)).toBe(true);

          // Verify they share the same color theme
          const valueColor = expectedCard.textColorClass.match(/text-(\w+)-/)[1];
          const iconBgColor = expectedCard.bgColorClass.match(/bg-(\w+)-/)[1];
          expect(valueColor).toBe(iconBgColor);
        }
      ),
      { numRuns: 50 }
    );
  });

  test('Real-world scenario: All 7 expected KPI cards are present with correct data', () => {
    const htmlContent = loadDashboardHTML();
    const dom = new JSDOM(htmlContent);
    const { document } = dom.window;

    const kpiGrid = document.querySelector('.grid.grid-cols-4');
    const kpiCards = kpiGrid.querySelectorAll('div.bg-white.rounded-xl.shadow.relative');

    expect(kpiCards.length).toBe(7);

    expectedKPICards.forEach((expectedCard, index) => {
      const card = kpiCards[index];

      // Find and verify label
      const labelElement = card.querySelector('p.text-xs.text-gray-400.uppercase.tracking-wide');
      expect(labelElement.textContent.trim()).toBe(expectedCard.label);

      // Find and verify value
      const valueElement = card.querySelector('p.text-3xl.font-bold');
      expect(valueElement.textContent.trim()).toBe(expectedCard.value);
      expect(valueElement.classList.contains(expectedCard.textColorClass)).toBe(true);

      // Find and verify icon box
      const iconBox = card.querySelector('div.absolute.top-4.right-4');
      expect(iconBox.classList.contains(expectedCard.bgColorClass)).toBe(true);

      // Verify icon SVG exists within icon box
      const icon = iconBox.querySelector('svg');
      expect(icon).toBeTruthy();
    });
  });

  test('Edge case: Grid layout has correct structure', () => {
    const htmlContent = loadDashboardHTML();
    const dom = new JSDOM(htmlContent);
    const { document } = dom.window;

    const kpiGrid = document.querySelector('.grid.grid-cols-4');
    
    // Verify grid exists and has correct classes
    expect(kpiGrid).toBeTruthy();
    expect(kpiGrid.classList.contains('grid')).toBe(true);
    expect(kpiGrid.classList.contains('grid-cols-4')).toBe(true);
    expect(kpiGrid.classList.contains('gap-4')).toBe(true);
    expect(kpiGrid.classList.contains('mb-6')).toBe(true);
  });
});
