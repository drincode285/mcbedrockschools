// ==========================================================================
// scripts/manifest-builder.js — Live manifest.json Generator with UUID v4
// Versions are taken from the official Script API documentation:
//   @minecraft/server  : 1.26.50 -> 2.10.0 (beta 2.11.0-beta)
//   @minecraft/server-ui: 1.26.50 -> 2.2.0  (beta 2.3.0-beta)
// ==========================================================================
(function () {
  // Minecraft release -> min_engine_version + matching module versions
  const MATRIX = {
    "1.26.50": { engine: [1, 26, 50], server: { stable: "2.10.0", beta: "2.11.0-beta" }, ui: { stable: "2.2.0", beta: "2.3.0-beta" } },
    "1.26.40": { engine: [1, 26, 40], server: { stable: "2.9.0",  beta: "2.10.0-beta" }, ui: { stable: "2.1.0", beta: "2.2.0-beta" } },
    "1.26.30": { engine: [1, 26, 30], server: { stable: "2.8.0",  beta: "2.9.0-beta" },  ui: { stable: "2.1.0", beta: "2.2.0-beta" } },
    "1.21.50": { engine: [1, 21, 50], server: { stable: "1.16.0", beta: null },           ui: { stable: "1.3.0", beta: null } }
  };

  let uuids = [];

  function refreshUuids() {
    // 0: BP header, 1: BP data module, 2: BP script module, 3: RP header, 4: RP resources module
    uuids = [];
    for (let i = 0; i < 5; i++) uuids.push(window.MCBE.generateUuidV4());
  }

  function updateManifest() {
    const nameEl = document.getElementById("mfNameInput");
    if (!nameEl) return;

    const name = nameEl.value.trim() || "Pinoy Legends Add-On";
    const desc = document.getElementById("mfDescInput").value.trim() || "Created with MCBedrockSchools";
    const mcVer = document.getElementById("mfMcVerSelect").value;
    const channelSel = document.getElementById("mfChannelSelect");
    const incUi = document.getElementById("mfUiToggleSelect").value === "yes";
    const incRp = document.getElementById("mfRpToggleSelect").value === "yes";
    const entry = MATRIX[mcVer] || MATRIX["1.26.50"];

    // Beta is only offered for versions that have a documented beta pairing
    const betaOpt = channelSel.querySelector('option[value="beta"]');
    if (betaOpt) betaOpt.disabled = !entry.server.beta;
    if (!entry.server.beta && channelSel.value === "beta") channelSel.value = "stable";
    const channel = channelSel.value === "beta" ? "beta" : "stable";

    const serverVer = entry.server[channel];
    const uiVer = entry.ui[channel];

    const deps = [{ module_name: "@minecraft/server", version: serverVer }];
    if (incUi) deps.push({ module_name: "@minecraft/server-ui", version: uiVer });
    if (incRp) deps.push({ uuid: uuids[3], version: [1, 0, 0] });

    const bp = {
      format_version: 2,
      header: {
        name: name + " BP",
        description: desc,
        uuid: uuids[0],
        version: [1, 0, 0],
        min_engine_version: entry.engine
      },
      modules: [
        { type: "data", uuid: uuids[1], version: [1, 0, 0] },
        { type: "script", language: "javascript", uuid: uuids[2], entry: "scripts/main.js", version: [1, 0, 0] }
      ],
      dependencies: deps
    };
    document.getElementById("generatedManifestCode").textContent = JSON.stringify(bp, null, 2);

    const rpWrap = document.getElementById("rpManifestWrap");
    if (rpWrap) rpWrap.classList.toggle("hidden", !incRp);
    if (incRp) {
      const rp = {
        format_version: 2,
        header: {
          name: name + " RP",
          description: desc,
          uuid: uuids[3],
          version: [1, 0, 0],
          min_engine_version: entry.engine
        },
        modules: [
          { type: "resources", uuid: uuids[4], version: [1, 0, 0] }
        ]
      };
      document.getElementById("generatedRpManifestCode").textContent = JSON.stringify(rp, null, 2);
    }

    // Info box under the form
    const info = document.getElementById("mfInfoBox");
    if (info) {
      const engineTxt = "[" + entry.engine.join(", ") + "]";
      let html = "🎯 <strong>min_engine_version</strong> = <code class='text-amber-300'>" + engineTxt + "</code> · " +
        "<strong>@minecraft/server</strong> = <code class='text-emerald-300'>\"" + serverVer + "\"</code>" +
        (incUi ? " · <strong>@minecraft/server-ui</strong> = <code class='text-emerald-300'>\"" + uiVer + "\"</code>" : "");
      if (channel === "beta") {
        html += "<br/>⚠️ Beta: i-on ang <strong>Beta APIs</strong> sa World → Experiments. Mawawala ang Achievements sa world na iyon.";
      } else {
        html += "<br/>✅ Stable: hindi kailangan ng experimental toggles — achievement-friendly.";
      }
      if (mcVer === "1.26.50") {
        html += "<br/>ℹ️ Gumagana rin ito sa 1.26.52 (hotfix ng 1.26.50).";
      }
      if (!entry.server.beta) {
        html += "<br/>ℹ️ Legacy 1.x: stable lang ang ipinapakita para sa version na ito.";
      }
      info.innerHTML = html;
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    refreshUuids();
    ["mfNameInput", "mfDescInput", "mfMcVerSelect", "mfChannelSelect", "mfUiToggleSelect", "mfRpToggleSelect"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", updateManifest);
        el.addEventListener("change", updateManifest);
      }
    });
    const regenBtn = document.getElementById("regenManifestUuidBtn");
    if (regenBtn) {
      regenBtn.addEventListener("click", () => {
        refreshUuids();
        updateManifest();
        window.MCBE.showToast("Generated fresh UUIDs for manifest.json!");
      });
    }
    const copyBtn = document.getElementById("copyGeneratedManifestBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        window.MCBE.copyText(document.getElementById("generatedManifestCode").textContent, "BP manifest.json copied!");
      });
    }
    const copyRpBtn = document.getElementById("copyGeneratedRpManifestBtn");
    if (copyRpBtn) {
      copyRpBtn.addEventListener("click", () => {
        window.MCBE.copyText(document.getElementById("generatedRpManifestCode").textContent, "RP manifest.json copied!");
      });
    }
    updateManifest();
  });
})();
