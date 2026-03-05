/**
 * LUMINA AROMAS - Interactive Storytelling Script
 * Features: Twinbru Preloader, Magnetic Hero, Scroll Reveal, Form Submission
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Preloader Logic ---
  const preloader = document.getElementById("preloader");
  const progressBar = document.querySelector(".bar-progress");
  let width = 0;

  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add("preloader-hidden");
      }, 500);
    } else {
      width += Math.random() * 15;
      if (width > 100) width = 100; // Bug fix: prevent more than 100%
      progressBar.style.width = `${width}%`;
    }
  }, 150);

  // --- 2. Magnetic Hero Effect (Optimized for performance) ---
  const hero = document.querySelector(".hero");
  const heroContainer = document.querySelector(".hero-container");
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (hero && heroContainer && !isTouchDevice) {
    hero.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (clientX - centerX) / 45; // Softer movement
      const moveY = (clientY - centerY) / 45;

      heroContainer.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  }

  // --- 3. Scroll Reveal Logic ---
  const revealCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.1,
  });

  document
    .querySelectorAll(".reveal")
    .forEach((el) => revealObserver.observe(el));

  // --- 4. Testimonials Slider ---
  let currentSlide = 0;
  const slides = document.querySelectorAll(".slide");

  if (slides.length > 0) {
    setInterval(() => {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }, 4000); // Aumentei um pouco o tempo para leitura confortável
  }

  // --- 5. Form Submission (Real Email Delivery) ---
  const contactForm = document.getElementById("mainContactForm");
  const statusBox = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Impede o reload da página

      // Validação básica interna
      const name = document.getElementById("userName").value;
      const email = document.getElementById("userEmail").value;
      const msg = document.getElementById("userMessage").value;

      if (name.length < 3 || !email.includes("@") || msg.length < 5) {
        handleStatus("error", "Por favor, preencha os dados corretamente.");
        return;
      }

      // Feedback visual de carregamento
      handleStatus("success", "Enviando sua mensagem...");

      // Envio real via AJAX/Fetch
      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          handleStatus("success", "Mensagem enviada com sucesso!");
          contactForm.reset();
        } else {
          const errorData = await response.json();
          handleStatus(
            "error",
            errorData.errors ? errorData.errors[0].message : "Erro ao enviar.",
          );
        }
      } catch (error) {
        handleStatus("error", "Falha na conexão com o servidor.");
      }
    });
  }

  function handleStatus(type, text) {
    if (!statusBox) return;
    statusBox.textContent = text;
    statusBox.className = `status-msg ${type}`;
    statusBox.classList.remove("hidden");

    // Esconde a mensagem após 4 segundos se for sucesso
    if (type === "success") {
      setTimeout(() => {
        statusBox.classList.add("hidden");
      }, 4000);
    }
  }
});
