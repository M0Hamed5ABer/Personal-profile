// Merged and cleaned script
document.addEventListener("DOMContentLoaded", () => {
  // Helpers
  const qs = (sel) => document.querySelector(sel);
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));

  // Mobile Menu Toggle
  const menuToggle = qs("#menu-toggle");
  const navLinks = qs("#nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      menuToggle.innerHTML = navLinks.classList.contains("active")
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking on a link
    qsa(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // Dark/Light Mode Toggle (persist choice in localStorage)
  const themeToggle = qs("#theme-toggle");
  const themeIcon = themeToggle ? themeToggle.querySelector("i") : null;

  function applySavedTheme() {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") {
        document.body.classList.add("dark-mode");
        if (themeIcon) {
          themeIcon.classList.remove("fa-moon");
          themeIcon.classList.add("fa-sun");
        }
      } else {
        document.body.classList.remove("dark-mode");
        if (themeIcon) {
          themeIcon.classList.remove("fa-sun");
          themeIcon.classList.add("fa-moon");
        }
      }
    } catch (e) {
      // ignore localStorage errors
    }
  }

  if (themeToggle) {
    applySavedTheme();
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      try {
        localStorage.setItem("theme", isDark ? "dark" : "light");
      } catch (e) {}
      if (themeIcon) {
        if (isDark) {
          themeIcon.classList.remove("fa-moon");
          themeIcon.classList.add("fa-sun");
        } else {
          themeIcon.classList.remove("fa-sun");
          themeIcon.classList.add("fa-moon");
        }
      }
    });
  } else {
    applySavedTheme();
  }

  // Header scroll effect
  const header = qs("#header") || qs("#mainNav");
  function updateHeaderScrolled() {
    if (!header) return;
    const scrolledClass = "scrolled";
    const threshold = 50;
    if (window.scrollY > threshold) header.classList.add(scrolledClass);
    else header.classList.remove(scrolledClass);
  }
  updateHeaderScrolled();
  window.addEventListener("scroll", updateHeaderScrolled);

  // Project filtering
  const filterButtons = qsa(".filter-btn");
  const projectCards = qsa(".project-card");
  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        const filterValue = button.getAttribute("data-filter");
        projectCards.forEach((card) => {
          if (
            filterValue === "all" ||
            card.getAttribute("data-category") === filterValue
          ) {
            card.style.display = "block";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 10);
          } else {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            setTimeout(() => {
              card.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }

  // Scroll animations (single IntersectionObserver)
  const fadeElements = qsa(".fade-in");
  if (fadeElements.length) {
    const appearObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    fadeElements.forEach((el) => appearObserver.observe(el));
  }

  // Smooth scrolling for anchor links
  qsa('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerOffset = header ? header.offsetHeight : 0;
      const top =
        target.getBoundingClientRect().top + window.scrollY - headerOffset - 10;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // Contact form submission — open user's email client with prefilled message
  const contactForm = qs("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = (qs("#contact-name")?.value || "").trim();
      const email = (qs("#contact-email")?.value || "").trim();
      const subject = (qs("#contact-subject")?.value || "").trim();
      const message = (qs("#contact-message")?.value || "").trim();
      const to = "mohammedsaber314@gmail.com";
      const subjectLine = subject
        ? `${name} - ${subject}`
        : `Message from ${name}`;
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        "Message:",
        message,
      ].join("\n");
      const mailto = `mailto:${to}?subject=${encodeURIComponent(
        subjectLine
      )}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      contactForm.reset();
    });
  }

  // Initialize visibility states
  const heroContent = qs(".hero-content") || qs(".header-content");
  if (heroContent) heroContent.classList.add("visible");
});
// Create and manage Back to Top button
const backToTopButton = document.createElement("button");
backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
backToTopButton.id = "backToTop";
backToTopButton.title = "Back to top";
document.body.appendChild(backToTopButton);

// Add CSS for the Back to Top button
const style = document.createElement("style");
style.textContent = `
  #backToTop {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background-color: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.3s ease;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  #backToTop:hover {
    background-color: var(--accent-color);
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
  
  #backToTop.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    #backToTop {
      bottom: 20px;
      right: 20px;
      width: 45px;
      height: 45px;
    }
  }
`;
document.head.appendChild(style);

// Show/hide Back to Top button based on scroll position
function toggleBackToTopButton() {
  if (window.scrollY > 500) {
    backToTopButton.classList.add("visible");
  } else {
    backToTopButton.classList.remove("visible");
  }
}

// Scroll to top when button is clicked
backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Initialize scroll listener for Back to Top button
toggleBackToTopButton();
window.addEventListener("scroll", toggleBackToTopButton);
