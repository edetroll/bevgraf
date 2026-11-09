(function () {
  "use strict";
  let cleanup = null;
  function get(id) { return document.getElementById(id); }
  function status(message, error = false) {
    const el = get("runnerStatus");
    if (!el) return;
    el.textContent = message;
    el.classList.toggle("error", error);
    el.setAttribute("role", error ? "alert" : "status");
  }
  function init() {
    const id = document.body.dataset.demo;
    if (!id) return;
    const demo = window.BevGrafExamples?.[id];
    if (!demo) { status("Nem található a demó / Demo not found", true); return; }
    const canvas = get("demoCanvas"), ctx = canvas.getContext("2d");
    const editor = get("codeEditor"), layer = get("highlightedCode");
    const editorBox = get("editorBox"), workspace = get("demoWorkspace");
    let original = demo.source;
    let highlighted = false;
    editor.value = original;
    editor.spellcheck = false;
    editor.setAttribute("aria-label", "Szerkeszthető JavaScript kód / Editable JavaScript code");

    function updateHighlight() {
      layer.innerHTML = window.BevGrafHighlight.highlight(editor.value);
      layer.parentElement.scrollTop = editor.scrollTop;
      layer.parentElement.scrollLeft = editor.scrollLeft;
      highlighted = true;
    }
    function scrollSync() {
      const pre = layer.parentElement;
      pre.scrollTop = editor.scrollTop;
      pre.scrollLeft = editor.scrollLeft;
    }
    editor.addEventListener("input", updateHighlight);
    editor.addEventListener("scroll", scrollSync);
    editor.addEventListener("keydown", e => {
      if (e.key === "Tab") {
        e.preventDefault();
        const a = editor.selectionStart, b = editor.selectionEnd;
        editor.setRangeText("  ", a, b, "end"); updateHighlight();
      }
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); }
    });
    editor.addEventListener("wheel", e => {
      if (!(e.ctrlKey || e.altKey)) return;
      e.preventDefault(); e.stopPropagation();
      window.BevGrafSite.adjustCode(e.deltaY < 0 ? 1 : -1);
    }, {passive:false});
    editorBox.addEventListener("wheel", e => {
      if (!(e.ctrlKey || e.altKey) || e.target === editor) return;
      e.preventDefault(); e.stopPropagation();
      window.BevGrafSite.adjustCode(e.deltaY < 0 ? 1 : -1);
    }, {passive:false});

    function run() {
      if (typeof cleanup === "function") {
        try { cleanup(); } catch (e) { console.warn("Cleanup:", e); }
        cleanup = null;
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      try {
        const program = new Function("canvas", "ctx", "drawLine", "putPixel", "drawCircle", '"use strict";\n' + editor.value);
        const result = program(canvas, ctx, window.BevGraf.drawLine, window.BevGraf.putPixel, window.BevGraf.drawCircle);
        if (typeof result === "function") cleanup = result;
        status(window.BevGrafSite.language === "hu" ? "A program lefutott." : "Program executed.");
      } catch (error) {
        status((window.BevGrafSite.language === "hu" ? "Hiba: " : "Error: ") + (error.message || String(error)), true);
      }
    }
    get("runCode").addEventListener("click", run);
    get("resetCode").addEventListener("click", () => { editor.value = original; editor.scrollTop = 0; editor.scrollLeft = 0; updateHighlight(); run(); });
    get("copyCode").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(editor.value);
        status(window.BevGrafSite.language === "hu" ? "A forráskód a vágólapra került." : "Source code copied to clipboard.");
      } catch (_) {
        editor.focus(); editor.select();
        status(window.BevGrafSite.language === "hu" ? "Jelöld ki, majd másold a kódot (Ctrl+C)!" : "Select and copy the code (Ctrl+C).");
      }
    });
    document.addEventListener("bevgraf:settings", () => {
      const l = window.BevGrafSite.language;
      get("demoHeading").textContent = demo[l].title;
      get("demoLead").textContent = demo[l].lead;
      get("demoTipText").textContent = demo[l].hint;
      document.title = demo[l].title + " – Bevezetés a számítógépi grafikába";
    });
    // A korábban betöltött nyelvi beállításokat akkor is alkalmazzuk, ha az esemény már lefutott.
    const l = window.BevGrafSite.language;
    get("demoHeading").textContent = demo[l].title;
    get("demoLead").textContent = demo[l].lead;
    get("demoTipText").textContent = demo[l].hint;
    document.title = demo[l].title + " – Bevezetés a számítógépi grafikába";
    updateHighlight(); run();
    // Az oszlopok szélessége asztali nézetben egérrel módosítható.
    const splitter = get("workspaceSplitter");
    if (splitter) {
      let active = false;
      splitter.addEventListener("pointerdown", e => {
        if (window.innerWidth <= 1120) return;
        active = true;
        splitter.setPointerCapture(e.pointerId);
      });
      splitter.addEventListener("pointermove", e => {
        if (!active) return;
        const bounds = workspace.getBoundingClientRect();
        const available = bounds.width - 10;
        const size = Math.min(available - 310, Math.max(360, e.clientX - bounds.left));
        workspace.style.gridTemplateColumns = `${size}px 10px minmax(310px, 1fr)`;
      });
      splitter.addEventListener("pointerup", () => { active = false; });
      splitter.addEventListener("pointercancel", () => { active = false; });
      splitter.addEventListener("keydown", e => {
        if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
        e.preventDefault();
        const bounds = workspace.getBoundingClientRect();
        const first = workspace.querySelector(".demo-pane").getBoundingClientRect().width;
        const size = Math.min(bounds.width - 320, Math.max(360, first + (e.key === "ArrowRight" ? 24 : -24)));
        workspace.style.gridTemplateColumns = `${size}px 10px minmax(310px, 1fr)`;
      });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
