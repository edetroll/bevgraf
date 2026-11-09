(function () {
  "use strict";
  const root = document.documentElement;
  const CHAPTERS = [
    { number: "1", href: "index.html#fejezet-01", hu: "Grafikus primitívek", en: "Graphics primitives" }
    // További fejezetek: ide vehetők fel. A bal oldalsáv görgethető.
  ];
  function store(key, value) { try { localStorage.setItem(key, String(value)); } catch (_) {} }
  function load(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch (_) { return fallback; } }
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  let theme = load("bevgraf-theme", "light") === "dark" ? "dark" : "light";
  let contrast = load("bevgraf-contrast", "off") === "on";
  let language = load("bevgraf-language", "hu") === "en" ? "en" : "hu";
  let readerSize = clamp(parseInt(load("bevgraf-reader-font", "17"), 10) || 17, 14, 25);
  let codeSize = clamp(parseInt(load("bevgraf-code-font", "16"), 10) || 16, 12, 32);

  function translateUi() {
    root.dataset.theme = theme;
    root.dataset.contrast = contrast ? "on" : "off";
    root.dataset.language = language;
    root.lang = language;
    root.style.setProperty("--reader-size", readerSize + "px");
    root.style.setProperty("--code-size", codeSize + "px");
    document.querySelectorAll("[data-ui-hu]").forEach(el => {
      el.textContent = el.dataset[language === "hu" ? "uiHu" : "uiEn"];
    });
    const themeBtn = document.getElementById("themeButton");
    const contrastBtn = document.getElementById("contrastButton");
    const languageBtn = document.getElementById("languageButton");
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", language === "hu" ? "Téma váltása (világos/sötét)" : "Toggle theme (light/dark)");
      themeBtn.textContent = theme === "light" ? "☾" : "☀";
      themeBtn.title = theme === "light" ? (language === "hu" ? "Sötét téma" : "Dark theme") : (language === "hu" ? "Világos téma" : "Light theme");
    }
    if (contrastBtn) {
      contrastBtn.setAttribute("aria-pressed", String(contrast));
      contrastBtn.setAttribute("aria-label", language === "hu" ? "Kisegítő nagy kontrasztú mód" : "Accessible high-contrast mode");
      contrastBtn.textContent = language === "hu" ? "Kontraszt" : "Contrast";
    }
    if (languageBtn) {
      languageBtn.textContent = language.toUpperCase();
      languageBtn.setAttribute("aria-label", language === "hu" ? "Switch to English" : "Váltás magyar nyelvre");
    }
    const readerValue = document.querySelectorAll("[data-reader-size]");
    readerValue.forEach(el => { el.textContent = readerSize + " px"; });
    const codeValue = document.querySelectorAll("[data-code-size]");
    codeValue.forEach(el => { el.textContent = codeSize + " px"; });
    document.dispatchEvent(new CustomEvent("bevgraf:settings", { detail: { theme, contrast, language, readerSize, codeSize } }));
  }
  function adjustReader(delta) {
    readerSize = clamp(readerSize + delta, 14, 25);
    store("bevgraf-reader-font", readerSize); translateUi();
  }
  function adjustCode(delta) {
    codeSize = clamp(codeSize + delta, 12, 32);
    store("bevgraf-code-font", codeSize); translateUi();
  }
  function renderChapterNavigation() {
    const nav = document.getElementById("chapterNav");
    if (!nav) return;
    const prefix = document.body.dataset.root || "";
    const isDemo = document.body.dataset.demo;
    CHAPTERS.forEach(ch => {
      const a = document.createElement("a");
      a.href = prefix + ch.href;
      a.className = "side-link" + (ch.number === "1" ? " active" : "");
      a.setAttribute("aria-current", ch.number === "1" && !isDemo ? "page" : "false");
      a.innerHTML = `<strong>${ch.number}.</strong> <span data-lang="hu">${ch.hu}</span><span data-lang="en">${ch.en}</span>`;
      nav.appendChild(a);
    });
  }
  function setupToc() {
    const toc = document.querySelector(".toc");
    if (!toc) return;
    const links = [...toc.querySelectorAll('a[href^="#"]')];
    const targets = links.map(link => ({ link, section: document.getElementById(link.hash.slice(1)) }))
                         .filter(item => item.section);
    if (!targets.length) return;
    // The active subsection is highlighted according to the current reading position.
    function updateActive() {
      const offset = 170;
      let active = targets[0];
      for (const item of targets) {
        if (item.section.getBoundingClientRect().top <= offset) active = item;
        else break;
      }
      for (const item of targets) {
        const selected = item === active;
        item.link.classList.toggle("active", selected);
        if (selected) item.link.setAttribute("aria-current", "location");
        else item.link.removeAttribute("aria-current");
      }
    }
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    window.addEventListener("hashchange", updateActive);
    updateActive();
  }
  function init() {
    renderChapterNavigation(); setupToc();
    const themeButton = document.getElementById("themeButton");
    themeButton?.addEventListener("click", () => { theme = theme === "light" ? "dark" : "light"; store("bevgraf-theme", theme); translateUi(); });
    document.getElementById("contrastButton")?.addEventListener("click", () => { contrast = !contrast; store("bevgraf-contrast", contrast ? "on" : "off"); translateUi(); });
    document.getElementById("languageButton")?.addEventListener("click", () => { language = language === "hu" ? "en" : "hu"; store("bevgraf-language", language); translateUi(); });
    document.getElementById("readerDecrease")?.addEventListener("click", () => adjustReader(-1));
    document.getElementById("readerIncrease")?.addEventListener("click", () => adjustReader(1));
    document.getElementById("codeDecrease")?.addEventListener("click", () => adjustCode(-1));
    document.getElementById("codeIncrease")?.addEventListener("click", () => adjustCode(1));
    const menu = document.getElementById("mobileMenu");
    menu?.addEventListener("click", () => {
      const sidebar = document.getElementById("sidebar");
      const opened = sidebar.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(opened));
    });
    document.querySelector(".sidebar")?.addEventListener("click", (e) => {
      if (e.target.closest("a") && window.innerWidth < 831) {
        document.getElementById("sidebar")?.classList.remove("open");
        menu?.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { document.getElementById("sidebar")?.classList.remove("open"); menu?.setAttribute("aria-expanded", "false"); }
    });
    // A kódszerkesztő saját Ctrl+görgő kezelést kap. Máshol a tananyagszöveg nagyítható.
    document.addEventListener("wheel", e => {
      if (!e.ctrlKey || e.target.closest(".editor-box, .canvas-wrap")) return;
      e.preventDefault();
      adjustReader(e.deltaY < 0 ? 1 : -1);
    }, {passive:false});
    translateUi();
  }
  window.BevGrafSite = {
    get language() { return language; },
    get codeSize() { return codeSize; },
    adjustCode,
    translateUi
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
