// ==========================================================================
// scripts/server-api-docs.js — Searchable @minecraft/server Built-in Reference
// ==========================================================================
(function () {
  const SERVER_API_DOCS = [
    { name: "world.sendMessage(message)", cat: "world", desc: "Nagpapadala ng chat message sa lahat ng players na nasa world. Tumatanggap ng string o RawMessage.", snippet: "welcome_spawn" },
    { name: "world.getAllPlayers()", cat: "world", desc: "Nagbabalik ng array ng lahat ng active Player objects sa world (madalas gamitin sa loob ng system.runInterval).", snippet: "tick_loop_hud" },
    { name: "world.getDimension(id)", cat: "world", desc: "Kumukuha ng Dimension object ('overworld', 'nether', o 'the_end') para makapag-spawn ng entities o blocks.", snippet: "item_use_skill" },
    { name: "world.afterEvents.playerSpawn", cat: "world", desc: "Event na nagti-trigger kapag nag-join o nag-respawn ang player. May property na event.player at event.initialSpawn.", snippet: "welcome_spawn" },
    { name: "world.afterEvents.itemUse", cat: "world", desc: "Event kapag nag-right-click o nag-long-tap sa screen ang player habang may hawak na item (event.source at event.itemStack).", snippet: "item_use_skill" },
    { name: "world.afterEvents.entityHitEntity", cat: "world", desc: "Event kapag pinalo ng isang entity ang isa pang entity (event.damagingEntity at event.hitEntity).", snippet: "hit_fire_effect" },
    { name: "world.beforeEvents.playerBreakBlock", cat: "world", desc: "Event BAGO masira ang block. Pwede mong i-cancel gamit ang event.cancel = true. Read-only ang mode, kaya ibalot sa system.run() ang mga write function.", snippet: "before_break_protect" },
    { name: "system.runInterval(callback, tickInterval)", cat: "system", desc: "Paulit-ulit na nagpapatakbo ng function kada X ticks (20 ticks = 1 second). Nagbabalik ng runId.", snippet: "tick_loop_hud" },
    { name: "system.runTimeout(callback, tickDelay)", cat: "system", desc: "Nagpapatakbo ng function nang isang beses pagkatapos ng X ticks na delay (hal. delayed explosion o skill cooldown).", snippet: "item_use_skill" },
    { name: "system.run(callback)", cat: "system", desc: "Nagpapatakbo ng function sa susunod na tick. Ginagamit sa loob ng beforeEvents para makapag-sendMessage, mag-spawn, atbp.", snippet: "before_break_protect" },
    { name: "system.currentTick", cat: "system", desc: "Ang kasalukuyang tick count ng world. Pwedeng gamitin sa cooldown (hal. now + 100 = 5 segundo).", snippet: "item_cooldown" },
    { name: "system.clearRun(runId)", cat: "system", desc: "Pinapatigil ang isang tumatakbong runInterval o runTimeout gamit ang runId nito.", snippet: "tick_loop_hud" },
    { name: "player.sendMessage(text)", cat: "player", desc: "Nagpapadala ng pribadong chat message sa isang partikular na Player lang.", snippet: "welcome_spawn" },
    { name: "player.onScreenDisplay.setActionBar(text)", cat: "player", desc: "Nagpapakita ng HUD text sa ibabaw ng hotbar ng player (pang-mana bar, stamina, o coordinates).", snippet: "tick_loop_hud" },
    { name: "entity.addEffect(effectType, durationTicks, options)", cat: "player", desc: "Nagbibigay ng potion effect sa Player o Mob (hal. 'speed', 'regeneration', 'strength') na may amplifier.", snippet: "item_use_skill" },
    { name: "entity.applyKnockback(horizontalForce, verticalStrength)", cat: "player", desc: "Nagbibigay ng dash o lipad sa player o mob. Sa 2.x, ang horizontalForce ay object na { x, z } (kasama na ang lakas), hal. { x: dir.x * 3, z: dir.z * 3 }.", snippet: "item_use_skill" },
    { name: "entity.setDynamicProperty(key, value)", cat: "player", desc: "Nagsasave ng custom data (string, number, boolean, Vector3) direkta sa player o world na hindi nawawala kahit mag-relog!", snippet: "welcome_spawn" },
    { name: "entity.getComponent(\"minecraft:inventory\")", cat: "player", desc: "Kumukuha ng component ng entity. Gamitin ang buong ID na may minecraft: prefix; .container ang mismong inventory.", snippet: "action_form_shop" },
    { name: "new ItemStack(typeId, amount)", cat: "item", desc: "Gumagawa ng bagong item instance sa script na pwedeng ibigay sa inventory ng player gamit ang container.addItem().", snippet: "action_form_shop" },
    { name: "dimension.spawnEntity(identifier, location)", cat: "item", desc: "Nag-i-spawn ng mob o lightning bolt sa eksaktong {x, y, z} coordinates sa loob ng dimension.", snippet: "hit_fire_effect" }
  ];

  let activeCat = "all";

  function renderTable(cat, query) {
    activeCat = cat;
    document.querySelectorAll(".server-cat-btn").forEach(btn => {
      const isAct = btn.getAttribute("data-server-cat") === cat;
      btn.className = "server-cat-btn px-3 py-1.5 rounded-lg text-xs font-bold transition " +
        (isAct ? "bg-[#04AA6D] text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700");
    });

    const q = (query || "").toLowerCase().trim();
    const rows = SERVER_API_DOCS.filter(item => {
      const mCat = cat === "all" || item.cat === cat;
      const mQ = !q || item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
      return mCat && mQ;
    });

    const tbody = document.getElementById("serverApiTableBody");
    if (!tbody) return;
    tbody.innerHTML = rows.map(item => `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="py-3 px-4 font-mono font-bold text-emerald-300">${item.name}</td>
        <td class="py-3 px-4"><span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">${item.cat}</span></td>
        <td class="py-3 px-4 text-slate-300 leading-relaxed">${item.desc}</td>
        <td class="py-3 px-4 text-right">
          <a href="tryit-practice.html?preset=${item.snippet}" class="px-3 py-1.5 rounded bg-[#04AA6D] hover:bg-[#059862] text-white font-bold text-[11px] whitespace-nowrap inline-block">Try it »</a>
        </td>
      </tr>
    `).join("");
  }

  window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".server-cat-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const input = document.getElementById("serverApiFilterInput");
        renderTable(btn.getAttribute("data-server-cat"), input ? input.value : "");
      });
    });
    const filterInput = document.getElementById("serverApiFilterInput");
    if (filterInput) {
      filterInput.addEventListener("input", (e) => renderTable(activeCat, e.target.value));
    }
    renderTable("all", "");
  });
})();
