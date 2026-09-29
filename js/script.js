// Shared navigation, footer date and frontend-only contact form interactions.
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector("[data-nav-toggle]");
  const navigation = document.querySelector("#site-navigation");

  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("is-open");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  document.querySelectorAll("[data-year]").forEach((year) => {
    year.textContent = new Date().getFullYear();
  });

  const contactForm = document.querySelector("[data-contact-form]");
  if (!contactForm) return;

  const status = contactForm.querySelector("[data-form-status]");
  const fields = ["name", "email", "message"];

  const showFieldError = (field, message) => {
    const input = contactForm.elements.namedItem(field);
    const error = contactForm.querySelector(`[data-error-for="${field}"]`);
    input.setAttribute("aria-invalid", message ? "true" : "false");
    error.textContent = message;
  };

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";
    let isValid = true;

    fields.forEach((field) => {
      const input = contactForm.elements.namedItem(field);
      let message = "";

      if (!input.value.trim()) {
        message = "This field is required.";
      } else if (field === "name" && input.value.trim().length < 2) {
        message = "Please enter at least 2 characters.";
      } else if (field === "email" && !input.validity.valid) {
        message = "Please enter a valid email address.";
      } else if (field === "message" && input.value.trim().length < 10) {
        message = "Please enter at least 10 characters.";
      }

      showFieldError(field, message);
      if (message) isValid = false;
    });

    if (!isValid) {
      status.textContent = "Please review the highlighted fields.";
      contactForm.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    status.textContent = "Your details passed the demo checks. Nothing has been sent or stored; please email GREM directly to get in touch.";
  });

  fields.forEach((field) => {
    const input = contactForm.elements.namedItem(field);
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") showFieldError(field, "");
    });
  });
});