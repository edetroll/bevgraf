/* Külső könyvtár nélküli, offline JavaScript szintaxiskiemelés. */
(function () {
  "use strict";
  const keyword = /^(?:const|let|var|function|return|if|else|for|while|do|break|continue|new|class|this|try|catch|throw|typeof|instanceof|true|false|null|undefined|async|await|switch|case|default)$/;
  const builtin = /^(?:Math|Number|String|Boolean|Object|Array|Date|JSON|console|window|document|canvas|ctx|event)$/;
  const re = /(\/\/[^\r\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b|[+*\/%=<>!?&|^-]+)/g;
  function escape(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function highlight(source) {
    let out = "", previous = 0;
    re.lastIndex = 0;
    for (let m; (m = re.exec(source));) {
      const t = m[0];
      out += escape(source.slice(previous, m.index));
      let type = "";
      if (t.startsWith("//") || t.startsWith("/*")) type = "comment";
      else if (/^["'`]/.test(t)) type = "string";
      else if (/^\d/.test(t)) type = "number";
      else if (keyword.test(t)) type = "keyword";
      else if (builtin.test(t)) type = "builtin";
      else if (/^[+*\/%=<>!?&|^-]/.test(t)) type = "operator";
      else if (/^\s*\(/.test(source.slice(m.index + t.length))) type = "function";
      out += type ? `<span class="token ${type}">${escape(t)}</span>` : escape(t);
      previous = m.index + t.length;
    }
    return out + escape(source.slice(previous)) + "\n";
  }
  window.BevGrafHighlight = { highlight };
  function highlightStatic() {
    document.querySelectorAll(".js-highlight").forEach(el => {
      if (el.dataset.highlighted === "yes") return;
      el.innerHTML = highlight(el.textContent).replace(/\n$/, "");
      el.dataset.highlighted = "yes";
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", highlightStatic);
  else highlightStatic();
})();
