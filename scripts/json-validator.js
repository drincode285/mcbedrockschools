// ==========================================================================
// scripts/json-validator.js — Live JSON Syntax Checker for Add-On Creators
// ==========================================================================
(function () {
  window.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("validateJsonBtn");
    const input = document.getElementById("jsonValidatorInput");
    const status = document.getElementById("jsonValidatorStatus");
    if (!btn || !input || !status) return;

    btn.addEventListener("click", () => {
      try {
        const parsed = JSON.parse(input.value);
        const keys = (parsed && typeof parsed === "object") ? Object.keys(parsed).join(", ") : String(parsed);
        status.className = "p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 font-medium";
        status.textContent = "✔ Valid JSON Syntax! Top-level keys: [" + keys + "]. Walang missing comma o bracket!";
      } catch (err) {
        status.className = "p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 font-medium";
        status.textContent = "❌ JSON Error: " + err.message + " — I-check kung may sobrang comma sa dulo o kulang na double quote (\").";
      }
    });
  });
})();
