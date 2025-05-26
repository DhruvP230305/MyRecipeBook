/**
 * Main Module - Core functionality and event handlers
 */

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!menuToggle || !navLinks) return;
  
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Change icon based on menu state
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.className = 'fas fa-times';
    } else {
      icon.className = 'fas fa-bars';
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    if (!menuToggle.contains(event.target) && !navLinks.contains(event.target) && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      menuToggle.querySelector('i').className = 'fas fa-bars';
    }
  });
}

/**
 * Check if the browser is in dark mode
 * @returns {boolean} True if dark mode is enabled
 */
function isDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Add smooth scroll behavior to page links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Adjust for header height
        behavior: 'smooth'
      });
    });
  });
}

/**
 * Initialize page transition effects
 */
function initPageTransitions() {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-loaded');
  });
  
  // Add fade-out effect when navigating away
  document.querySelectorAll('a').forEach(link => {
    // Skip links that open in new tab or are anchors
    if (link.target === '_blank' || link.getAttribute('href')?.startsWith('#')) {
      return;
    }
    
    link.addEventListener('click', (e) => {
      // Skip if modifier keys are pressed
      if (e.ctrlKey || e.metaKey) {
        return;
      }
      
      const currentUrl = window.location.href;
      const newUrl = link.href;
      
      // Skip if it's the same page
      if (currentUrl === newUrl) {
        return;
      }
      
      e.preventDefault();
      
      document.body.classList.add('page-transitioning');
      
      setTimeout(() => {
        window.location.href = newUrl;
      }, 300);
    });
  });
}

// Initialize functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initPageTransitions();
});