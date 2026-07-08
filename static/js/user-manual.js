/**
 * User Manual - Accordion and Language Switching
 * Vanilla JavaScript implementation
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ==================== ACCORDION FUNCTIONALITY ====================
  
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const content = document.getElementById(targetId);
      const arrow = this.querySelector('.accordion-arrow');
      
      // Check if this section is currently open
      const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
      
      if (isOpen) {
        // Close this section
        content.style.maxHeight = '0';
        arrow.style.transform = 'rotate(0deg)';
      } else {
        // Open this section
        content.style.maxHeight = content.scrollHeight + 'px';
        arrow.style.transform = 'rotate(180deg)';
      }
    });
  });
  
  // Set first section open by default
  const firstContent = document.getElementById('section1');
  const firstArrow = document.querySelector('[data-target="section1"] .accordion-arrow');
  if (firstContent && firstArrow) {
    firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
    firstArrow.style.transform = 'rotate(180deg)';
  }
  
  
  // ==================== LANGUAGE SWITCHING FUNCTIONALITY ====================
  
  const languageSelector = document.getElementById('languageSelector');
  
  languageSelector.addEventListener('change', function() {
    const selectedLanguage = this.value; // 'en' or 'hi'
    switchLanguage(selectedLanguage);
  });
  
  function switchLanguage(lang) {
    // Get all elements with language attributes
    const elementsWithLang = document.querySelectorAll('[data-lang-en][data-lang-hi]');
    
    elementsWithLang.forEach(element => {
      if (lang === 'en') {
        element.textContent = element.getAttribute('data-lang-en');
      } else if (lang === 'hi') {
        element.textContent = element.getAttribute('data-lang-hi');
      }
    });
    
    // Recalculate accordion heights after language change
    const openAccordions = document.querySelectorAll('.accordion-content');
    openAccordions.forEach(content => {
      if (content.style.maxHeight && content.style.maxHeight !== '0px') {
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  }
  
  // Set default language to English on page load
  switchLanguage('en');
  
});
