// ==========================================================================
// scripts/tryit-lab.js — W3Schools Split Editor & Interactive Exercises
// ==========================================================================
(function () {
  const TRY_IT_PRESETS = {
    welcome_spawn: {
      eventLabel: "world.afterEvents.playerSpawn",
      code: `import { world } from "@minecraft/server";

// Magpapadala ng welcome chat kapag nag-spawn ang player
world.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player;
  player.sendMessage("§a[MCBedrockSchools] Maligayang pagdating, " + player.name + "!");
  player.sendMessage("§eTip: Gamitin ang iyong custom sword para mag-dash!");
});`,
      logs: [
        "§7[Script Engine] Subscribed to world.afterEvents.playerSpawn",
        "§a[MCBedrockSchools] Maligayang pagdating, JuanModderPH!",
        "§eTip: Gamitin ang iyong custom sword para mag-dash!"
      ],
      hud: "§aWelcome Event Triggered!",
      hp: "20 / 20"
    },
    item_use_skill: {
      eventLabel: "world.afterEvents.itemUse",
      code: `import { world } from "@minecraft/server";

world.afterEvents.itemUse.subscribe((event) => {
  const player = event.source;
  const item = event.itemStack;

  if (item.typeId === "pinoy:bayanihan_blade") {
    const view = player.getViewDirection();
    player.applyKnockback({ x: view.x * 3.5, z: view.z * 3.5 }, 0.5);
    player.addEffect("regeneration", 100, { amplifier: 1 });
    player.onScreenDisplay.setActionBar("§6⚡ Wind Dash + Regeneration Activated!");
    player.sendMessage("§bGinamit mo ang Wind Dash Skill!");
  }
});`,
      logs: [
        "§7[Event] JuanModderPH used item: pinoy:bayanihan_blade",
        "§bGinamit mo ang Wind Dash Skill!",
        "§d[Effect] Added Regeneration II for 100 ticks (5s)"
      ],
      hud: "§6⚡ Wind Dash + Regeneration Activated!",
      hp: "20 / 20 (+Regen II)"
    },
    hit_fire_effect: {
      eventLabel: "world.afterEvents.entityHitEntity",
      code: `import { world } from "@minecraft/server";

world.afterEvents.entityHitEntity.subscribe((event) => {
  const attacker = event.damagingEntity;
  const target = event.hitEntity;

  target.setOnFire(5, true);
  target.dimension.spawnEntity("minecraft:lightning_bolt", target.location);
  attacker.sendMessage("§c🔥 Tinamaan ng Kidlat at Apoy ang kalaban!");
});`,
      logs: [
        "§7[Combat] JuanModderPH hit Zombie at (124, 65, -30)",
        "§6[World] Spawned minecraft:lightning_bolt at target.location",
        "§c🔥 Tinamaan ng Kidlat at Apoy ang kalaban!"
      ],
      hud: "§c🔥 Critical Lightning Strike!",
      hp: "20 / 20"
    },
    tick_loop_hud: {
      eventLabel: "system.runInterval (20 ticks)",
      code: `import { world, system } from "@minecraft/server";

// Tumatakbo kada 20 ticks (1 second)
system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    const loc = player.location;
    player.onScreenDisplay.setActionBar(
      \`§bXYZ: \${Math.floor(loc.x)}, \${Math.floor(loc.y)}, \${Math.floor(loc.z)} | §aMana: 100/100\`
    );
  }
}, 20);`,
      logs: [
        "§7[System] Registered runInterval #1 (every 20 ticks = 1.0s)",
        "§a[HUD Updated] Showing live coordinates and Mana bar for all players."
      ],
      hud: "§bXYZ: 128, 64, -45 | §aMana: 100/100",
      hp: "20 / 20"
    },
    variables_loops: {
      eventLabel: "variables + for...of loop",
      code: `import { world } from "@minecraft/server";

const weaponName = "Kampilan";
let bonusDmg = 20;
const skills = ["Dash", "Heal", "Fire"];

bonusDmg = bonusDmg + 5;

for (const player of world.getAllPlayers()) {
  if (player.isSneaking) {
    player.sendMessage("§eNakayuko ka!");
  } else {
    player.sendMessage("§aNakatayo ka.");
  }
}

world.sendMessage(\`§6[Skill] §aAng \${weaponName} ay may +\${bonusDmg} Damage at \${skills.length} skills!\`);`,
      logs: [
        "§7[Script Engine] Loaded variables: weaponName, bonusDmg, skills",
        "§aNakatayo ka.",
        "§6[Skill] §aAng Kampilan ay may +25 Damage at 3 skills!"
      ],
      hud: "§aVariables & Loop Executed!",
      hp: "20 / 20"
    },
    before_break_protect: {
      eventLabel: "world.beforeEvents.playerBreakBlock",
      code: `import { world, system } from "@minecraft/server";

world.beforeEvents.playerBreakBlock.subscribe((event) => {
  if (event.block.typeId === "minecraft:diamond_ore") {
    event.cancel = true;
    system.run(() => {
      event.player.sendMessage("§cBawal sirain ang diamond ore dito!");
    });
  }
});`,
      logs: [
        "§7[Event] JuanModderPH tried to break minecraft:diamond_ore",
        "§7[Event] event.cancel = true (block stays in place)",
        "§cBawal sirain ang diamond ore dito!"
      ],
      hud: "§cBlock Protected!",
      hp: "20 / 20"
    },
    item_cooldown: {
      eventLabel: "world.afterEvents.itemUse + cooldown",
      code: `import { world, system } from "@minecraft/server";

const cooldowns = new Map(); // player.id -> tick kung kailan pwede ulit

world.afterEvents.itemUse.subscribe((event) => {
  const player = event.source;
  if (event.itemStack.typeId !== "pinoy:bayanihan_blade") return;

  const now = system.currentTick;
  if (now < (cooldowns.get(player.id) ?? 0)) {
    player.sendMessage("§cNagko-cooldown pa ang skill!");
    return;
  }
  cooldowns.set(player.id, now + 100); // 100 ticks = 5 segundo

  const view = player.getViewDirection();
  player.applyKnockback({ x: view.x * 3, z: view.z * 3 }, 0.5);
  player.onScreenDisplay.setActionBar("§b⚡ Wind Dash!");
});`,
      logs: [
        "§7[Event] JuanModderPH used item: pinoy:bayanihan_blade",
        "§7[Cooldown] Set to 100 ticks (5s) for JuanModderPH",
        "§7[Entity] applyKnockback({ x, z }, 0.5)"
      ],
      hud: "§b⚡ Wind Dash!",
      hp: "20 / 20"
    },
    action_form_shop: {
      eventLabel: "ActionFormData.show(player)",
      code: `import { ItemStack } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

const shop = new ActionFormData()
  .title("§2Sari-Sari Enchant Shop")
  .body("Pumili ng item na bibilhin:")
  .button("🗡️ Kampilan Sword (5 Emeralds)")
  .button("🍎 Golden Apple (2 Emeralds)");

shop.show(player).then((res) => {
  if (!res.canceled && res.selection === 0) {
    player.getComponent("minecraft:inventory").container.addItem(new ItemStack("pinoy:kampilan_sword", 1));
    player.sendMessage("§aNabili mo ang Kampilan Sword!");
  }
});`,
      logs: [
        "§7[UI] Opened ActionFormData 'Sari-Sari Enchant Shop' for JuanModderPH",
        "§7[UI] Player clicked button index 0",
        "§aNabili mo ang Kampilan Sword! (Added to inventory)"
      ],
      hud: "§a+1 Kampilan Sword Added!",
      hp: "20 / 20"
    }
  };

  const EXERCISES = [
    { id: "ex1", title: "Exercise 1: Pag-import ng @minecraft/server", prompt: "Kumpletuhin ang import statement para makuha ang 'world' object mula sa core scripting module:", prefix: 'import { world } from "', suffix: '";', answer: "@minecraft/server", hint: "Nagsisimula sa @minecraft/..." },
    { id: "ex2", title: "Exercise 2: Pagpapadala ng Chat Message sa Player", prompt: "Anong built-in method ng Player class ang ginagamit para magpadala ng chat text?", prefix: "player.", suffix: '("§aHello Bedrock Modder!");', answer: "sendMessage", hint: "send + Message (camelCase)" },
    { id: "ex3", title: "Exercise 3: Pag-subscribe sa itemUse Event", prompt: "Anong method ang tinatawag sa world.afterEvents.itemUse para makinig kapag ginamit ang item?", prefix: "world.afterEvents.itemUse.", suffix: "((event) => { ... });", answer: "subscribe", hint: "Parang sa YouTube channel: .sub______()" },
    { id: "ex4", title: "Exercise 4: Game Tick Loop (1 Segundo)", prompt: "Ilang game ticks ang katumbas ng 1 buong segundo sa system.runInterval?", prefix: "system.runInterval(() => { ... }, ", suffix: ");", answer: "20", hint: "Dalawampung (20) ticks kada segundo!" },
    { id: "ex5", title: "Exercise 5: Gumawa ng Buttons Menu sa @minecraft/server-ui", prompt: "Anong class sa @minecraft/server-ui ang ginagamit para sa menu na puro clickable buttons?", prefix: "const menu = new ", suffix: '().title("My Menu");', answer: "ActionFormData", hint: "Action + Form + Data" },
    { id: "ex6", title: "Exercise 6: Pag-package ng Add-On sa ZArchiver", prompt: "Anong file extension ang ipapalit mo sa .zip kapag pinagsama mo ang BP at RP folders para 1-click import sa Minecraft?", prefix: "MyCustomMod.", suffix: "", answer: "mcaddon", hint: "mc + addon (walang tuldok sa unahan)" }
  ];

  let currentExIdx = 0;

  function loadPreset(key) {
    const p = TRY_IT_PRESETS[key] || TRY_IT_PRESETS.welcome_spawn;
    const sel = document.getElementById("tryItPresetSelect");
    const ed = document.getElementById("tryItCodeEditor");
    if (sel) sel.value = key;
    if (ed) ed.value = p.code;
    runSimulation(key);
  }

  function runSimulation(presetKey) {
    const ed = document.getElementById("tryItCodeEditor");
    if (!ed) return;
    const code = ed.value;
    const key = presetKey || document.getElementById("tryItPresetSelect").value;
    const p = TRY_IT_PRESETS[key] || TRY_IT_PRESETS.welcome_spawn;

    document.getElementById("simEventLabel").textContent = "Active: " + p.eventLabel;
    document.getElementById("simPlayerHp").textContent = p.hp;
    document.getElementById("simActionBarBox").textContent = p.hud;

    const customMsgs = [];
    const regex = /sendMessage\(\s*["'`]([^"'`]+)["'`]\s*\)/g;
    let m;
    while ((m = regex.exec(code)) !== null) {
      customMsgs.push(m[1]);
    }
    const logs = customMsgs.length > 0
      ? ["§7[Script Engine] Executed user code from scripts/main.js", ...customMsgs]
      : p.logs;

    document.getElementById("simChatLog").innerHTML = logs.map(line => {
      const clean = line.replace(/§[0-9a-fk-or]/gi, "");
      const cls = line.includes("§a") ? "text-emerald-400" : (line.includes("§e") || line.includes("§6")) ? "text-amber-300" : line.includes("§c") ? "text-rose-400" : "text-slate-300";
      return `<div class="${cls}">&gt; ${clean}</div>`;
    }).join("");
  }

  function renderExercise(idx) {
    currentExIdx = idx;
    const ex = EXERCISES[idx];
    const doneList = window.MCBE.getCompletedExercises();
    const pills = document.getElementById("exerciseListPills");
    if (!pills) return;

    pills.innerHTML = EXERCISES.map((item, i) => {
      const done = doneList.includes(item.id);
      const active = i === idx;
      return `<button type="button" data-ex-idx="${i}" class="px-3 py-1 rounded-lg text-xs font-bold transition ${
        active ? "bg-[#04AA6D] text-white" : done ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
      }">${done ? "✔ " : ""}Ex ${i + 1}</button>`;
    }).join("");

    pills.querySelectorAll("[data-ex-idx]").forEach(b => {
      b.addEventListener("click", () => renderExercise(parseInt(b.getAttribute("data-ex-idx"), 10)));
    });

    document.getElementById("exerciseQuestionTitle").textContent = ex.title;
    document.getElementById("exerciseQuestionPrompt").textContent = ex.prompt;
    document.getElementById("exerciseCodePrefix").textContent = ex.prefix;
    document.getElementById("exerciseCodeSuffix").textContent = ex.suffix;
    document.getElementById("exerciseAnswerInput").value = doneList.includes(ex.id) ? ex.answer : "";
    document.getElementById("exerciseFeedbackText").textContent = "";
  }

  window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const initialPreset = params.get("preset") || "welcome_spawn";
    loadPreset(initialPreset);

    const sel = document.getElementById("tryItPresetSelect");
    if (sel) sel.addEventListener("change", (e) => loadPreset(e.target.value));

    const runBtn = document.getElementById("runTryItBtn");
    if (runBtn) runBtn.addEventListener("click", () => {
      runSimulation();
      window.MCBE.showToast("Simulated script execution!");
    });

    const copyBtn = document.getElementById("copyTryItBtn");
    if (copyBtn) copyBtn.addEventListener("click", () => {
      window.MCBE.copyText(document.getElementById("tryItCodeEditor").value, "Script copied!");
    });

    document.querySelectorAll(".sim-event-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const trig = btn.getAttribute("data-sim-trigger");
        if (trig === "spawn") loadPreset("welcome_spawn");
        if (trig === "itemUse") loadPreset("item_use_skill");
        if (trig === "hitEntity") loadPreset("hit_fire_effect");
      });
    });

    renderExercise(0);

    const subBtn = document.getElementById("submitExerciseBtn");
    if (subBtn) {
      subBtn.addEventListener("click", () => {
        const ex = EXERCISES[currentExIdx];
        const ans = document.getElementById("exerciseAnswerInput").value.trim();
        const fb = document.getElementById("exerciseFeedbackText");
        if (ans === ex.answer) {
          fb.className = "text-xs font-bold text-emerald-400";
          fb.textContent = "🎉 Tama! +25 XP Earned!";
          const done = window.MCBE.getCompletedExercises();
          if (!done.includes(ex.id)) {
            done.push(ex.id);
            try { localStorage.setItem("mcbe_schools_completed_ex", JSON.stringify(done)); } catch (e) {}
            const xpEl = document.getElementById("xpCounterBadge");
            if (xpEl) xpEl.textContent = (done.length * 25) + " XP";
            renderExercise(currentExIdx);
          }
        } else {
          fb.className = "text-xs font-bold text-rose-400";
          fb.textContent = "❌ Subukan ulit! Hint: " + ex.hint;
        }
      });
    }

    const hintBtn = document.getElementById("showExerciseAnswerBtn");
    if (hintBtn) {
      hintBtn.addEventListener("click", () => {
        const ex = EXERCISES[currentExIdx];
        document.getElementById("exerciseAnswerInput").value = ex.answer;
        const fb = document.getElementById("exerciseFeedbackText");
        fb.className = "text-xs font-semibold text-amber-300";
        fb.textContent = "💡 Sagot: " + ex.answer + " — I-click ang Submit Answer!";
      });
    }
  });
})();
