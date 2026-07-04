document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("mainNav");
  const backToTop = document.getElementById("backToTop");
  const currentYear = document.getElementById("currentYear");
  const typingText = document.getElementById("typingText");
  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");
  const certificateModal = document.getElementById("certificateModal");

  const typingPhrases = [
    "Tajweed Correction",
    "Hifz & Revision Plans",
    "Tarjuma-tul-Quran",
    "Surah Kahf Translation",
    "Noorani Qaida Lessons",
    "Kids and Adults Classes"
  ];

  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  const handleScrollState = () => {
    const isScrolled = window.scrollY > 24;
    navbar?.classList.toggle("scrolled", isScrolled);
    backToTop?.classList.toggle("visible", window.scrollY > 420);
  };

  handleScrollState();
  window.addEventListener("scroll", handleScrollState, { passive: true });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const runTypingEffect = () => {
    if (!typingText) {
      return;
    }

    const currentPhrase = typingPhrases[phraseIndex];
    typingText.textContent = currentPhrase.slice(0, charIndex);

    if (!deleting && charIndex < currentPhrase.length) {
      charIndex += 1;
      setTimeout(runTypingEffect, 90);
      return;
    }

    if (!deleting && charIndex === currentPhrase.length) {
      deleting = true;
      setTimeout(runTypingEffect, 1400);
      return;
    }

    if (deleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(runTypingEffect, 45);
      return;
    }

    deleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    setTimeout(runTypingEffect, 240);
  };

  runTypingEffect();

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll(".reveal-up").forEach((element) => {
    revealObserver.observe(element);
  });

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const counter = entry.target;
      const targetValue = Number(counter.getAttribute("data-target") || "0");
      let currentValue = 0;
      const increment = Math.max(1, Math.ceil(targetValue / 70));

      const tick = () => {
        currentValue += increment;
        if (currentValue >= targetValue) {
          counter.textContent = String(targetValue);
          return;
        }

        counter.textContent = String(currentValue);
        requestAnimationFrame(tick);
      };

      tick();
      observer.unobserve(counter);
    });
  }, { threshold: 0.35 });

  document.querySelectorAll(".counter").forEach((counter) => {
    counterObserver.observe(counter);
  });

  const progressObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.getAttribute("data-width") || "0";
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".progress-fill").forEach((fill) => {
    progressObserver.observe(fill);
  });

  if (certificateModal) {
    certificateModal.addEventListener("show.bs.modal", (event) => {
      const trigger = event.relatedTarget;
      if (!(trigger instanceof HTMLElement)) {
        return;
      }

      const modalTitle = certificateModal.querySelector(".modal-title");
      const modalImage = document.getElementById("certificatePreview");
      const image = trigger.getAttribute("data-image");
      const title = trigger.getAttribute("data-title");

      if (modalTitle) {
        modalTitle.textContent = title || "Certificate Preview";
      }

      if (modalImage instanceof HTMLImageElement && image) {
        modalImage.src = image;
        modalImage.alt = `${title || "Certificate"} preview`;
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        event.stopPropagation();
        contactForm.classList.add("was-validated");
        formFeedback.textContent = "Please complete the required fields before submitting your inquiry.";
        return;
      }

      contactForm.classList.add("was-validated");
      const formData = new FormData(contactForm);
      const name = formData.get("name");
      const course = formData.get("course");

      formFeedback.textContent = `JazakAllah khair, ${name}. Your inquiry for ${course} has been captured. Please continue on WhatsApp for the fastest response.`;
      contactForm.reset();
      contactForm.classList.remove("was-validated");
    });
  }
});
