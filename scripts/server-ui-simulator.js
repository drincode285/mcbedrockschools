// ==========================================================================
// scripts/server-ui-simulator.js — Interactive @minecraft/server-ui Simulator
// ==========================================================================
(function () {
  function initUiSimulators() {
    // 1. ActionFormData Simulator
    const actionCanvas = document.getElementById("simActionFormCanvas");
    const actionRes = document.getElementById("simActionFormResponse");
    if (actionCanvas && actionRes) {
      actionCanvas.querySelectorAll("[data-sim-btn]").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = btn.getAttribute("data-sim-btn");
          const lbl = btn.getAttribute("data-sim-label");
          actionRes.innerHTML = `response.canceled = <strong>false</strong> | response.selection = <strong>${idx}</strong><br/><span class="text-amber-300">Chat Output: "Pinili mo ang ${lbl}!"</span>`;
        });
      });
    }

    // 2. ModalFormData Simulator
    const slider = document.getElementById("simModalSlider");
    const sliderVal = document.getElementById("simModalSliderVal");
    const modalSubmit = document.getElementById("simModalSubmitBtn");
    const modalRes = document.getElementById("simModalFormResponse");
    if (slider && sliderVal) {
      slider.addEventListener("input", () => { sliderVal.textContent = slider.value; });
    }
    if (modalSubmit && modalRes) {
      modalSubmit.addEventListener("click", () => {
        const t = document.getElementById("simModalText").value;
        const s = slider ? slider.value : 5;
        const d = document.getElementById("simModalDropdown").value;
        const tg = document.getElementById("simModalToggle").checked;
        modalRes.innerHTML = `response.canceled = <strong>false</strong><br/>response.formValues = <strong>[${JSON.stringify(t)}, ${s}, ${d}, ${tg}]</strong>`;
      });
    }

    // 3. MessageFormData Simulator
    const msgCanvas = document.getElementById("simMessageFormCanvas");
    const msgRes = document.getElementById("simMessageFormResponse");
    if (msgCanvas && msgRes) {
      msgCanvas.querySelectorAll("[data-msg-btn]").forEach(btn => {
        btn.addEventListener("click", () => {
          const sel = btn.getAttribute("data-msg-btn");
          msgRes.innerHTML = sel === "0"
            ? `response.selection = <strong>0 (button1)</strong> — <span class="text-emerald-400">Na-teleport ka sa Boss Arena (500, 80, 500)!</span>`
            : `response.selection = <strong>1 (button2)</strong> — <span class="text-slate-400">Nag-stay ka sa safe zone.</span>`;
        });
      });
    }
  }

  window.addEventListener("DOMContentLoaded", initUiSimulators);
})();
