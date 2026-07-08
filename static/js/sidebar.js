/**
 * sidebar.js
 * 
 * Handles active navigation highlighting in the sidebar based on the current URL path.
 * Applies the 'active' class to the navigation item whose href matches the current pathname.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Read the current page pathname
  const currentPath = window.location.pathname;
  
  // Get all navigation items
  const navLinks = document.querySelectorAll('.nav-item');
  
  // Iterate through each nav item and apply active class if href matches
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
});
