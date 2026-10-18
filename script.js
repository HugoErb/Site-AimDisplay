"use strict";

document.documentElement.classList.add("has-js");

// Navigation mobile.
const menuButton = document.querySelector(".menu-toggle");
const navigationLinks = document.querySelector(".navigation-links");
const mobileViewport = window.matchMedia("(max-width: 800px)");

function setMenu(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  navigationLinks.classList.toggle("is-open", open);
}

menuButton.hidden = false;
menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
navigationLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuButton.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".navigation")) setMenu(false);
});
mobileViewport.addEventListener("change", () => setMenu(false));

// Sans cette API ou avec la réduction des mouvements, tout reste visible.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Ouverture fluide des réponses, avec le comportement natif conservé au clavier.
const faqAnimations = new WeakMap();
document.querySelectorAll(".faq details").forEach((details) => {
  const summary = details.querySelector("summary");
  const answer = details.querySelector(".faq-answer");

  summary.addEventListener("click", (event) => {
    event.preventDefault();
    const currentAnimation = faqAnimations.get(details);
    const opening = !details.classList.contains("is-open");

    if (reducedMotion.matches) {
      currentAnimation?.cancel();
      details.open = opening;
      details.classList.toggle("is-open", opening);
      answer.style.height = "";
      return;
    }

    // La hauteur affichée est lue avant d'interrompre une animation en cours.
    const currentHeight = details.open ? answer.getBoundingClientRect().height : 0;
    const currentOpacity = details.open ? Number.parseFloat(window.getComputedStyle(answer).opacity) : 0;
    currentAnimation?.cancel();

    if (opening) {
      details.open = true;
      details.classList.add("is-open");
      answer.style.height = "auto";
      const targetHeight = answer.scrollHeight;
      const animation = answer.animate([
        { height: `${currentHeight}px`, opacity: currentOpacity, transform: "translateY(-4px)" },
        { height: `${targetHeight}px`, opacity: 1, transform: "translateY(0)" }
      ], { duration: 420, easing: "cubic-bezier(.2,.7,.2,1)" });
      faqAnimations.set(details, animation);
      animation.onfinish = () => {
        if (faqAnimations.get(details) !== animation) return;
        answer.style.height = "auto";
        faqAnimations.delete(details);
      };
      return;
    }

    details.classList.remove("is-open");
    const animation = answer.animate([
      { height: `${currentHeight}px`, opacity: currentOpacity, transform: "translateY(0)" },
      { height: "0px", opacity: 0, transform: "translateY(-4px)" }
    ], { duration: 360, easing: "cubic-bezier(.4,0,.2,1)" });
    faqAnimations.set(details, animation);
    animation.onfinish = () => {
      if (faqAnimations.get(details) !== animation) return;
      details.open = false;
      answer.style.height = "";
      faqAnimations.delete(details);
    };
  });
});

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll("[data-reveal]").forEach((element) => {
    element.classList.add("reveal-ready");
    revealObserver.observe(element);
  });
  reducedMotion.addEventListener("change", (event) => {
    if (!event.matches) return;
    revealObserver.disconnect();
    document.querySelectorAll(".reveal-ready").forEach((element) => element.classList.add("is-visible"));
  });
}

// Vidéo de présentation : lecture muette quand elle est visible, pause hors de l'écran.
const promoVideo = document.querySelector("#promo-video");

if (promoVideo) {
  const videoToggle = document.querySelector(".video-toggle");
  const videoFullscreen = document.querySelector(".video-fullscreen");
  // Part visible à partir de laquelle la vidéo du hero est considérée à l'écran.
  const visibleRatio = 0.25;
  const autoplayAllowed = () => !reducedMotion.matches && !navigator.connection?.saveData;
  // Sans action du visiteur, la vidéo suit les préférences ; ensuite, son choix l'emporte.
  let intent = null;

  promoVideo.controls = false;
  videoToggle.hidden = false;
  videoFullscreen.hidden = !(promoVideo.requestFullscreen || promoVideo.webkitEnterFullscreen);

  function updateToggle() {
    const playing = !promoVideo.paused;
    videoToggle.querySelector("span").textContent = playing ? "Pause" : "Lecture";
    videoToggle.querySelector("use").setAttribute("href", playing ? "#i-pause" : "#i-play");
  }

  function play() {
    promoVideo.play().catch(updateToggle);
  }

  // Mesure faite au moment du clic : l'état de l'observateur peut avoir un temps de retard.
  function isShown() {
    const bounds = promoVideo.getBoundingClientRect();
    return Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0) >= bounds.height * visibleRatio;
  }

  function setIntent(value) {
    intent = value;
    if (value === "pause") promoVideo.pause();
    else if (isShown()) play();
  }

  updateToggle();
  promoVideo.addEventListener("play", updateToggle);
  promoVideo.addEventListener("pause", updateToggle);

  videoToggle.addEventListener("click", () => setIntent(promoVideo.paused ? "play" : "pause"));
  promoVideo.addEventListener("click", () => {
    if (!document.fullscreenElement) setIntent(promoVideo.paused ? "play" : "pause");
  });

  videoFullscreen.addEventListener("click", () => {
    if (promoVideo.requestFullscreen) promoVideo.requestFullscreen().catch(() => {});
    else promoVideo.webkitEnterFullscreen();
  });
  document.addEventListener("fullscreenchange", () => {
    promoVideo.controls = document.fullscreenElement === promoVideo;
  });

  if ("IntersectionObserver" in window) {
    // Le fichier ne se télécharge qu'à l'approche de la vidéo.
    new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) return;
      if (autoplayAllowed()) promoVideo.preload = "auto";
      observer.disconnect();
    }, { rootMargin: "400px 0px" }).observe(promoVideo);

    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) promoVideo.pause();
      else if (intent === "play" || (intent === null && autoplayAllowed())) play();
    }, { threshold: visibleRatio }).observe(promoVideo);
  }

  reducedMotion.addEventListener("change", (event) => {
    if (event.matches && intent !== "play") promoVideo.pause();
  });
}

// Reflet lumineux qui suit le pointeur sur les cartes de fonctionnalités.
const featureGrid = document.querySelector(".feature-grid");

if (featureGrid && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  featureGrid.addEventListener("pointermove", (event) => {
    const card = event.target.closest(".feature-card");
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${Math.round(event.clientX - bounds.left)}px`);
    card.style.setProperty("--spot-y", `${Math.round(event.clientY - bounds.top)}px`);
  });
}

// Version lue depuis la dernière release GitHub ; en cas d'échec, le badge reste masqué et la pastille garde son texte.
const versionBadge = document.querySelector(".version-badge");
const releaseLabel = document.querySelector("[data-release-label]");

if (versionBadge || releaseLabel) {
  fetch("https://api.github.com/repos/HugoErb/AimDisplay/releases/latest")
    .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
    .then((release) => {
      if (!release.tag_name) return;
      const version = release.tag_name.replace(/^v/, "");
      if (versionBadge) {
        versionBadge.textContent = `v${version}`;
        versionBadge.hidden = false;
      }
      if (releaseLabel) releaseLabel.textContent = `Version ${version} disponible`;
    })
    .catch(() => {});
}
