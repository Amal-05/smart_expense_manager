document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  
  // Might be multiple collapsible buttons if we add more
  const collapsibleBtns = document.querySelectorAll('.collapsible-btn');

  if (hamburger && sidebar && overlay) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  collapsibleBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      const parent = btn.closest('.collapsible-parent');
      if (parent) {
        parent.classList.toggle('active');
        // Close other collapsibles if we want an accordion effect
      }
    });
  });
});
