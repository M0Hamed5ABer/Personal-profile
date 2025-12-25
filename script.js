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

  // Lightbox functionality
  const lightbox = qs("#lightbox");
  if (lightbox) {
    const lightboxImage = qs("#lightboxImage");
    const lightboxTitle = qs("#lightboxTitle");
    const lightboxDescription = qs("#lightboxDescription");
    const lightboxClose = qs("#lightboxClose");
    const lightboxPrev = qs("#lightboxPrev");
    const lightboxNext = qs("#lightboxNext");

    const visualItems = qsa(".visual-item");
    let currentIndex = 0;

    if (
      visualItems.length &&
      lightboxImage &&
      lightboxTitle &&
      lightboxDescription
    ) {
      // Image data for the lightbox
      const lightboxImages = visualItems.map((item) => ({
        src: item.querySelector("img")?.src || "",
        title: item.querySelector("h4")?.textContent || "",
        description: item.querySelector("p")?.textContent || "",
      }));

      // Open lightbox when clicking on an image
      visualItems.forEach((item, index) => {
        item.addEventListener("click", () => {
          currentIndex = index;
          updateLightbox();
          lightbox.classList.add("active");
          document.body.style.overflow = "hidden"; // Prevent scrolling
        });

        // Also allow Enter key to open lightbox
        item.setAttribute("tabindex", "0");
        item.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            currentIndex = index;
            updateLightbox();
            lightbox.classList.add("active");
            document.body.style.overflow = "hidden";
          }
        });
      });

      // Update lightbox content
      function updateLightbox() {
        const currentImage = lightboxImages[currentIndex];
        if (lightboxImage) lightboxImage.src = currentImage.src;
        if (lightboxImage) lightboxImage.alt = currentImage.title;
        if (lightboxTitle) lightboxTitle.textContent = currentImage.title;
        if (lightboxDescription)
          lightboxDescription.textContent = currentImage.description;

        // Add loading animation
        if (lightboxImage) {
          lightboxImage.style.opacity = "0";
          setTimeout(() => {
            lightboxImage.style.transition = "opacity 0.3s ease";
            lightboxImage.style.opacity = "1";
          }, 10);
        }
      }

      // Close lightbox
      if (lightboxClose) {
        lightboxClose.addEventListener("click", () => {
          lightbox.classList.remove("active");
          document.body.style.overflow = "auto"; // Restore scrolling
        });
      }

      // Close lightbox when clicking on the background
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
          lightbox.classList.remove("active");
          document.body.style.overflow = "auto";
        }
      });

      // Navigate to previous image
      if (lightboxPrev) {
        lightboxPrev.addEventListener("click", (e) => {
          e.stopPropagation();
          currentIndex =
            (currentIndex - 1 + lightboxImages.length) % lightboxImages.length;
          updateLightbox();
        });
      }

      // Navigate to next image
      if (lightboxNext) {
        lightboxNext.addEventListener("click", (e) => {
          e.stopPropagation();
          currentIndex = (currentIndex + 1) % lightboxImages.length;
          updateLightbox();
        });
      }

      // Keyboard navigation
      document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;

        switch (e.key) {
          case "Escape":
            lightbox.classList.remove("active");
            document.body.style.overflow = "auto";
            break;
          case "ArrowLeft":
            currentIndex =
              (currentIndex - 1 + lightboxImages.length) %
              lightboxImages.length;
            updateLightbox();
            break;
          case "ArrowRight":
            currentIndex = (currentIndex + 1) % lightboxImages.length;
            updateLightbox();
            break;
        }
      });
    }
  }

  // Create and manage Back to Top button
  const backToTopButton = document.createElement("button");
  backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
  backToTopButton.id = "backToTop";
  backToTopButton.title = "Back to top";
  document.body.appendChild(backToTopButton);

  // Add CSS for the Back to Top button and Lightbox
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
    
    /* Lightbox Styles */
    .lightbox {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.95);
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .lightbox.active {
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 1;
    }
    
    .lightbox-content {
      position: relative;
      max-width: 90%;
      max-height: 90%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .lightbox-img {
      max-width: 100%;
      max-height: 85vh;
      object-fit: contain;
      border-radius: 4px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }
    
    .lightbox-caption {
      position: absolute;
      bottom: -60px;
      left: 0;
      width: 100%;
      text-align: center;
      color: white;
      padding: 15px;
    }
    
    .lightbox-caption h4 {
      color: white;
      font-size: 1.5rem;
      margin-bottom: 5px;
    }
    
    .lightbox-caption p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 1rem;
      margin-bottom: 0;
    }
    
    /* Lightbox Navigation Buttons */
    .lightbox-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(139, 115, 85, 0.8);
      color: white;
      border: none;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 1001;
    }
    
    .lightbox-btn:hover {
      background: var(--accent-color);
      transform: translateY(-50%) scale(1.1);
    }
    
    .lightbox-prev {
      left: 30px;
    }
    
    .lightbox-next {
      right: 30px;
    }
    
    .lightbox-close {
      position: absolute;
      top: 30px;
      right: 30px;
      background: rgba(139, 115, 85, 0.8);
      color: white;
      border: none;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 1001;
    }
    
    .lightbox-close:hover {
      background: #e74c3c;
      transform: scale(1.1);
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      #backToTop {
        bottom: 20px;
        right: 20px;
        width: 45px;
        height: 45px;
      }
      
      .lightbox-btn {
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
      }
      
      .lightbox-prev {
        left: 15px;
      }
      
      .lightbox-next {
        right: 15px;
      }
      
      .lightbox-close {
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
      }
      
      .lightbox-caption {
        bottom: -50px;
      }
      
      .lightbox-caption h4 {
        font-size: 1.2rem;
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
});
