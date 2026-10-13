window.va =
  window.va ||
  function () {
    (window.vaq = window.vaq || []).push(arguments);
  };
(function () {
  // 1. FAQ ACCORDION INTERACTIVITY
  const accordionBtns = document.querySelectorAll(".accordion-btn");
  accordionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".accordion-item");
      const content = item.querySelector(".accordion-content");
      const icon = btn.querySelector(".accordion-icon");
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      // Close other items
      accordionBtns.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute("aria-expanded", "false");
          const otherItem = otherBtn.closest(".accordion-item");
          otherItem.querySelector(".accordion-content").style.maxHeight = "0px";
          otherBtn.querySelector(".accordion-icon").style.transform =
            "rotate(0deg)";
        }
      });

      if (isOpen) {
        btn.setAttribute("aria-expanded", "false");
        content.style.maxHeight = "0px";
        icon.style.transform = "rotate(0deg)";
      } else {
        btn.setAttribute("aria-expanded", "true");
        content.style.maxHeight = content.scrollHeight + "px";
        icon.style.transform = "rotate(180deg)";
      }
    });
  });

  // 2. HERO VISUAL BUILDER TOGGLES & REAL-TIME CLI UPDATE
  const toggles = document.querySelectorAll(".flag-toggle");
  const targetInput = document.getElementById("target-ip");
  const targetDisplay = document.getElementById("cli-target-display");

  if (targetInput && targetDisplay) {
    targetInput.addEventListener("input", (e) => {
      targetDisplay.textContent = e.target.value || "192.168.1.1";
    });
  }

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const switchEl = toggle.querySelector(".toggle-switch");
      const knob = toggle.querySelector(".toggle-knob");
      const isActive = switchEl.classList.contains("active");

      if (isActive) {
        switchEl.classList.remove("active", "bg-primary-container/30");
        switchEl.classList.add("bg-surface-bright/50");
        knob.classList.remove("bg-primary", "translate-x-4");
        knob.classList.add("bg-outline", "translate-x-0");
      } else {
        switchEl.classList.add("active", "bg-primary-container/30");
        switchEl.classList.remove("bg-surface-bright/50");
        knob.classList.add("bg-primary", "translate-x-4");
        knob.classList.remove("bg-outline", "translate-x-0");
      }
    });
  });

  // 3. PRESETS SWITCHER MICRO-INTERACTION
  const presetButtons = document.querySelectorAll(".preset-btn");
  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      presetButtons.forEach((b) => {
        b.classList.remove("bg-primary/10", "text-primary");
        b.classList.add("bg-surface-container", "text-on-surface-variant");
      });
      button.classList.add("bg-primary/10", "text-primary");
      button.classList.remove(
        "bg-surface-container",
        "text-on-surface-variant",
      );
    });
  });

  // 4. HERO BETA FORM SUBMISSION & CLICK ANIMATION
  // 4. FORM SUBMISSION LOGIC (HERO & FOOTER FORMS)
  function setupFormHandling(formId, inputId, btnId, btnTextId) {
    const form = document.getElementById(formId);
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    const btnText = document.getElementById(btnTextId);

    if (!form || !btn || !btnText || !input) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (btn.disabled) return;

      // 1. Loading állapot
      btn.disabled = true;
      btn.classList.add("opacity-90", "cursor-wait");
      const originalText = btnText.innerHTML;

      btnText.innerHTML = `
        <svg class="animate-spin -ml-1 mr-1 h-4 w-4 text-on-primary inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Securing Access...</span>
      `;

      // 2. Beküldés a Web3Forms API-ra
      const formData = new FormData(form);

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          // 3. Sikeres küldés vizuális visszajelzése
          btn.classList.remove(
            "bg-primary",
            "hover:bg-primary-container",
            "opacity-90",
            "cursor-wait",
          );
          btn.classList.add(
            "bg-secondary",
            "text-on-secondary",
            "shadow-[0_0_32px_rgba(78,222,163,0.7)]",
          );
          input.classList.add("border-secondary", "bg-secondary/5");

          btnText.innerHTML = `
            <span class="material-symbols-outlined text-[19px] animate-bounce">check_circle</span>
            <span class="font-semibold tracking-wide">Invite Requested!</span>
          `;

          // Reset 3.5 mp után
          setTimeout(() => {
            btn.classList.remove(
              "bg-secondary",
              "text-on-secondary",
              "shadow-[0_0_32px_rgba(78,222,163,0.7)]",
            );
            btn.classList.add("bg-primary", "hover:bg-primary-container");
            input.classList.remove("border-secondary", "bg-secondary/5");
            btnText.innerHTML = originalText;
            btn.disabled = false;
            input.value = "";
          }, 3500);
        } else {
          window.location.href = "hiba.html";
        }
      } catch (error) {
        alert("Hálózati hiba történt a küldés során.");
        btn.disabled = false;
        btnText.innerHTML = originalText;
      }
    });
  }

  // Felső és alsó form aktiválása
  setupFormHandling(
    "hero-beta-form",
    "hero-email-input",
    "hero-submit-btn",
    "hero-btn-text",
  );
  setupFormHandling(
    "footer-beta-form",
    "footer-email-input",
    "footer-submit-btn",
    "footer-btn-text",
  );
})();
