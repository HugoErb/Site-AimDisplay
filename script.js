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

// Galerie accessible au clavier, sans défilement automatique.
const tabs = [...document.querySelectorAll(".preview-tab")];
const panels = [...document.querySelectorAll(".preview-panel")];
const previewDescription = document.querySelector("#preview-description");
const previewExpand = document.querySelector("#preview-expand");
const previewIndex = document.querySelector(".showcase-index");

function activateTab(tab, focus = false) {
  const activePanel = document.getElementById(tab.getAttribute("aria-controls"));
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  panels.forEach((panel) => { panel.hidden = panel !== activePanel; });
  previewDescription.textContent = activePanel.dataset.caption;
  previewExpand.href = activePanel.dataset.full;
  previewIndex.textContent = `${String(tabs.indexOf(tab) + 1).padStart(2, "0")} — 05`;
  if (focus) tab.focus({ preventScroll: true });

  // Ne déplace que la barre des onglets, sans faire défiler la page.
  const tablist = tab.parentElement;
  if (tab.offsetLeft < tablist.scrollLeft || tab.offsetLeft + tab.offsetWidth > tablist.scrollLeft + tablist.clientWidth) {
    tablist.scrollLeft = tab.offsetLeft - (tablist.clientWidth - tab.offsetWidth) / 2;
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    activateTab(tabs[next], true);
  });
});

document.querySelectorAll("[data-preview]").forEach((link) => {
  link.addEventListener("click", () => {
    const tab = document.getElementById(link.dataset.preview);
    if (tab) activateTab(tab, true);
  });
});

// Sans cette API ou avec la réduction des mouvements, tout reste visible.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
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
