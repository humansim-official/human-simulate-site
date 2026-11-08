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

if (showcase) {
  const slides = [...showcase.querySelectorAll("[data-slide]")];
  const selectors = [...showcase.querySelectorAll("[data-slide-select]")];
  const counter = showcase.querySelector("[data-slide-number]");
  showcase.querySelector(".showcase__selectors").hidden = false;

  const selectSlide = (index) => {
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === index;
      slide.hidden = !active;
      slide.querySelectorAll("a").forEach((link) => {
        link.tabIndex = active ? 0 : -1;
      });
      selectors[slideIndex].setAttribute("aria-pressed", String(active));
    });
    const image = slides[index].querySelector("img");
    showcase.style.setProperty("--showcase-art", `url("${image.src}")`);
    counter.textContent = String(index + 1).padStart(2, "0");
  };

  selectors.forEach((button, index) => {
    button.addEventListener("click", () => selectSlide(index));
    button.addEventListener("keydown", (event) => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % slides.length;
      else if (event.key === "ArrowLeft") next = (index - 1 + slides.length) % slides.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = slides.length - 1;
      else return;
      event.preventDefault();
      selectSlide(next);
      selectors[next].focus();
    });
  });
}
