const menuButton = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-nav]");

if (menuButton && navigation) {
  menuButton.closest(".site-header__utility").classList.add("is-enhanced");
  const setMenuState = (isOpen) => {
    menuButton.setAttribute("aria-expanded", String(isOpen));
    navigation.classList.toggle("is-open", isOpen);
    document.documentElement.classList.toggle("is-menu-open", isOpen);
  };

  const closeMenu = () => setMenuState(false);

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuButton.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) {
      closeMenu();
    }
  });

  const desktopMedia = window.matchMedia("(min-width: 781px)");
  const handleBreakpointChange = (event) => {
    if (event.matches) {
      closeMenu();
    }
  };

  if (typeof desktopMedia.addEventListener === "function") {
    desktopMedia.addEventListener("change", handleBreakpointChange);
  } else {
    desktopMedia.addListener(handleBreakpointChange);
  }
}

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const showcase = document.querySelector("[data-showcase]");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

if (showcase) {
  const slides = [...showcase.querySelectorAll("[data-slide]")];
  const selectors = [...showcase.querySelectorAll("[data-slide-select]")];
  const counter = showcase.querySelector("[data-slide-number]");
  const liveRegion = counter.closest("[aria-live]");
  const autoplayButton = showcase.querySelector("[data-autoplay]");
  const backgrounds = [...showcase.querySelectorAll("[data-atmosphere]")];
  const duration = 7500;
  let activeIndex = 0;
  let backgroundIndex = 0;
  let autoplayEnabled = !motionPreference.matches;
  let pointerInside = false;
  let focusInside = false;
  let inView = true;
  let timer;
  let animations = [];
  let transitionId = 0;

  showcase.style.setProperty("--slide-duration", `${duration}ms`);
  showcase.querySelector(".showcase__selectors").hidden = false;
  showcase.querySelector("[data-slide-controls]").hidden = false;
  slides.forEach((slide) => {
    const visual = slide.querySelector(".showcase__visual");
    visual.style.setProperty("--feature-art", `url("${visual.querySelector("img").src}")`);
  });

  const settleSlides = () => {
    transitionId += 1;
    animations.forEach((animation) => animation.cancel());
    animations = [];
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === activeIndex;
      slide.hidden = !active;
      slide.inert = !active;
      slide.setAttribute("aria-hidden", String(!active));
      slide.classList.remove("is-leaving");
      slide.querySelectorAll("a").forEach((link) => {
        link.tabIndex = active ? 0 : -1;
      });
      selectors[slideIndex].setAttribute("aria-pressed", String(active));
    });
  };

  const selectSlide = (index) => {
    if (index === activeIndex) return;
    const previous = slides[activeIndex];
    activeIndex = index;
    settleSlides();
    const current = slides[index];
    const image = slides[index].querySelector("img");
    image.loading = "eager";
    backgroundIndex = (backgroundIndex + 1) % backgrounds.length;
    backgrounds[backgroundIndex].style.backgroundImage = `url("${image.src}")`;
    backgrounds.forEach((layer, layerIndex) => {
      layer.classList.toggle("is-current", layerIndex === backgroundIndex);
    });
    counter.textContent = String(index + 1).padStart(2, "0");

    if (!motionPreference.matches && typeof current.animate === "function") {
      previous.hidden = false;
      previous.classList.add("is-leaving");
      const id = transitionId;
      const leaving = previous.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, easing: "ease-out", fill: "forwards" });
      const entering = current.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 650, easing: "ease-out" });
      animations = [leaving, entering];
      leaving.onfinish = () => {
        if (id !== transitionId) return;
        previous.hidden = true;
        previous.classList.remove("is-leaving");
        leaving.cancel();
      };
    }
  };

  // Pause while a visitor is interacting, or while the feature is out of view.
  const syncPlayback = () => {
    window.clearTimeout(timer);
    const playing = autoplayEnabled && !motionPreference.matches && !pointerInside && !focusInside && !document.hidden && inView;
    showcase.dataset.playing = String(playing);
    autoplayButton.setAttribute("aria-pressed", String(autoplayEnabled));
    autoplayButton.hidden = motionPreference.matches;
    liveRegion.setAttribute("aria-live", playing ? "off" : "polite");
    if (playing) {
      timer = window.setTimeout(() => {
        selectSlide((activeIndex + 1) % slides.length);
        syncPlayback();
      }, duration);
    }
  };

  const chooseSlide = (index) => {
    autoplayEnabled = false;
    syncPlayback();
    selectSlide(index);
  };

  selectors.forEach((button, index) => {
    button.addEventListener("click", () => chooseSlide(index));
    button.addEventListener("keydown", (event) => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % slides.length;
      else if (event.key === "ArrowLeft") next = (index - 1 + slides.length) % slides.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = slides.length - 1;
      else return;
      event.preventDefault();
      chooseSlide(next);
      selectors[next].focus();
    });
  });

  showcase.querySelectorAll("[data-slide-step]").forEach((button) => {
    button.addEventListener("click", () => {
      chooseSlide((activeIndex + Number(button.dataset.slideStep) + slides.length) % slides.length);
    });
  });
  autoplayButton.addEventListener("click", () => {
    autoplayEnabled = !autoplayEnabled;
    syncPlayback();
  });
  showcase.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse") return;
    pointerInside = true;
    syncPlayback();
  });
  showcase.addEventListener("pointerleave", () => {
    pointerInside = false;
    syncPlayback();
  });
  showcase.addEventListener("focusin", () => {
    focusInside = true;
    syncPlayback();
  });
  showcase.addEventListener("focusout", (event) => {
    focusInside = showcase.contains(event.relatedTarget);
    syncPlayback();
  });
  document.addEventListener("visibilitychange", syncPlayback);
  if ("IntersectionObserver" in window) {
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    });
    visibilityObserver.observe(showcase);
  }
  const updateMotion = () => {
    if (motionPreference.matches) autoplayEnabled = false;
    settleSlides();
    syncPlayback();
  };
  motionPreference.addEventListener("change", updateMotion);
  settleSlides();
  syncPlayback();
}

// Only below-the-fold elements are hidden, and only after an observer is ready.
if (!motionPreference.matches) {
  document.documentElement.classList.add("has-motion");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -24px 0px", threshold: 0 });
    document.querySelectorAll(".section__head, .work-card, .about-panel, .link-card, .guideline-card, .recruit-card").forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      revealObserver.observe(element);
      element.classList.add("will-reveal");
    });
    motionPreference.addEventListener("change", (event) => {
      if (!event.matches) return;
      revealObserver.disconnect();
      document.querySelectorAll(".will-reveal").forEach((element) => element.classList.add("is-revealed"));
    });
  }
}
