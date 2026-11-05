// ==========================================================================
// scripts/folder-explorer.js — Interactive BP & RP Folder Tree Inspector
// ==========================================================================
(function () {
  const FOLDER_TREES = {
    bp: [
      {
        id: "bp_manifest",
        label: "📄 MyAddon_BP/manifest.json",
        badge: "Required Core File",
        desc: "Ang ID card ng iyong Behavior Pack. Dito nakalagay ang pangalan, UUID v4, min_engine_version, entry point ng scripts/main.js, at dependencies sa @minecraft/server at @minecraft/server-ui.",
        tip: "Huwag na huwag gagamit ng parehong UUID sa header at sa modules! Gamitin ang ating UUID generator sa kaliwa.",
        code: `{
  "format_version": 2,
  "header": {
    "name": "Pinoy Legends BP",
    "description": "Behavior Pack with Script API",
    "uuid": "a1b2c3d4-1111-4222-8333-123456789abc",
    "version": [1, 0, 0],
    "min_engine_version": [1, 26, 50]
  },
  "modules": [
    {
      "type": "data",
      "uuid": "b2c3d4e5-2222-4333-9444-23456789abcd",
      "version": [1, 0, 0]
    },
    {
      "type": "script",
      "language": "javascript",
      "uuid": "c3d4e5f6-3333-4444-a555-3456789abcde",
      "entry": "scripts/main.js",
      "version": [1, 0, 0]
    }
  ],
  "dependencies": [
    { "module_name": "@minecraft/server", "version": "2.10.0" },
    { "module_name": "@minecraft/server-ui", "version": "2.2.0" }
  ]
}`
      },
      {
        id: "bp_scripts",
        label: "📜 MyAddon_BP/scripts/main.js",
        badge: "Script API Entry",
        desc: "Ang main JavaScript file na tinatawag ng manifest.json. Pwede kang mag-import dito ng @minecraft/server at @minecraft/server-ui modules.",
        tip: "Siguraduhing eksaktong 'scripts/main.js' ang path at lowercase lahat para hindi mag-error sa Android at Windows.",
        code: `import { world, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

world.afterEvents.itemUse.subscribe((event) => {
  const { source: player, itemStack } = event;
  if (itemStack.typeId === "pinoy:bayanihan_blade") {
    player.sendMessage("§aGinamit mo ang Bayanihan Blade!");
  }
});`
      },
      {
        id: "bp_items",
        label: "🗡️ MyAddon_BP/items/bayanihan_blade.json",
        badge: "Custom Item Data",
        desc: "Dito dine-define ang stats ng custom item: identifier (namespace:name), max stack size, durability, damage, at kung anong texture icon ang gagamitin.",
        tip: "Huwag gamitin ang 'minecraft:' bilang namespace sa sarili mong item! Gumamit ng sariling prefix tulad ng 'pinoy:bayanihan_blade'.",
        code: `{
  "format_version": "1.21.10",
  "minecraft:item": {
    "description": {
      "identifier": "pinoy:bayanihan_blade",
      "menu_category": { "category": "equipment" }
    },
    "components": {
      "minecraft:max_stack_size": 1,
      "minecraft:damage": 14,
      "minecraft:icon": "bayanihan_blade"
    }
  }
}`
      },
      {
        id: "bp_blocks",
        label: "🧱 MyAddon_BP/blocks/narra_crate.json",
        badge: "Custom Block Data",
        desc: "Naglalaman ng katangian ng custom block tulad ng friction, light emission, destroy time, at geometry.",
        tip: "Kung gusto mong umiilaw ang block sa dilim, idagdag ang 'minecraft:light_emission': 15 sa components.",
        code: `{
  "format_version": "1.21.10",
  "minecraft:block": {
    "description": {
      "identifier": "pinoy:narra_crate"
    },
    "components": {
      "minecraft:destructible_by_mining": { "seconds_to_destroy": 1.5 },
      "minecraft:light_emission": 10
    }
  }
}`
      },
      {
        id: "bp_recipes",
        label: "🛠️ MyAddon_BP/recipes/bayanihan_blade_recipe.json",
        badge: "Crafting Table Recipe",
        desc: "Nagbibigay-daan para ma-craft ng players sa Survival mode ang iyong custom item o block.",
        tip: "Laging isama ang 'unlock' array para lumabas agad sa Recipe Book ng player kapag nakakuha sila ng sangkap.",
        code: `{
  "format_version": "1.20.10",
  "minecraft:recipe_shaped": {
    "description": { "identifier": "pinoy:bayanihan_blade_recipe" },
    "tags": ["crafting_table"],
    "pattern": [" D ", " D ", " S "],
    "key": {
      "D": { "item": "minecraft:emerald" },
      "S": { "item": "minecraft:blaze_rod" }
    },
    "unlock": [{ "item": "minecraft:emerald" }],
    "result": { "item": "pinoy:bayanihan_blade", "count": 1 }
  }
}`
      }
    ],
    rp: [
      {
        id: "rp_manifest",
        label: "📄 MyAddon_RP/manifest.json",
        badge: "Resource Pack Manifest",
        desc: "Manifest para sa Resource Pack. Pansinin na ang module type dito ay 'resources' (hindi 'data' o 'script').",
        tip: "Pwede mong i-link ang RP at BP sa pamamagitan ng paglalagay ng UUID ng RP sa 'dependencies' ng BP manifest.json.",
        code: `{
  "format_version": 2,
  "header": {
    "name": "Pinoy Legends RP",
    "description": "Textures, Models, and Sounds",
    "uuid": "d4e5f6a7-4444-4555-9666-456789abcdef",
    "version": [1, 0, 0],
    "min_engine_version": [1, 26, 50]
  },
  "modules": [
    {
      "type": "resources",
      "uuid": "e5f6a7b8-5555-4666-8777-56789abcdef0",
      "version": [1, 0, 0]
    }
  ]
}`
      },
      {
        id: "rp_item_texture",
        label: "🖼️ MyAddon_RP/textures/item_texture.json",
        badge: "Texture Shortname Mapper",
        desc: "Kinokonekta nito ang shortname (hal. 'bayanihan_blade') na ginamit mo sa BP item JSON papunta sa totoong PNG file path sa loob ng textures/items/.",
        tip: "Huwag ilagay ang '.png' extension sa loob ng textures path ng item_texture.json!",
        code: `{
  "resource_pack_name": "pinoy_legends_rp",
  "texture_name": "atlas.items",
  "texture_data": {
    "bayanihan_blade": {
      "textures": "textures/items/bayanihan_blade"
    }
  }
}`
      },
      {
        id: "rp_png",
        label: "🎨 MyAddon_RP/textures/items/bayanihan_blade.png",
        badge: "16x16 / 32x32 PNG Sprite",
        desc: "Ang aktwal na pixel art PNG image na ginawa mo sa ibisPaint X, Pixly, o Blockbench.",
        tip: "Siguraduhing transparent ang background (Alpha channel) para hindi magkaroon ng puting kahon sa paligid ng espada mo sa laro!",
        code: `// Binary Image File: textures/items/bayanihan_blade.png
// Recommended Canvas Size: 16x16 px or 32x32 px
// Format: 32-bit PNG with Transparency
// Made with: ibisPaint X (Digital Pen) or Pixly / Blockbench`
      },
      {
        id: "rp_models",
        label: "🧊 MyAddon_RP/models/entity/bakunawa.geo.json",
        badge: "Blockbench 3D Model",
        desc: "3D Geometry file na in-export mula sa Blockbench (Bedrock Entity Model format).",
        tip: "Sa Blockbench, piliin ang 'Bedrock Entity' project type para siguradong compatible ang pivot points at bones.",
        code: `{
  "format_version": "1.12.0",
  "minecraft:geometry": [
    {
      "description": {
        "identifier": "geometry.bakunawa",
        "texture_width": 64,
        "texture_height": 64
      },
      "bones": [
        { "name": "root", "pivot": [0, 0, 0] }
      ]
    }
  ]
}`
      },
      {
        id: "rp_lang",
        label: "🌐 MyAddon_RP/texts/en_US.lang",
        badge: "Display Names & Translations",
        desc: "Ginagawang malinis na pangalan ang raw identifier (hal. mula 'item.pinoy:bayanihan_blade.name' papuntang 'Bayanihan Blade').",
        tip: "Walang space sa magkabilang gilid ng '=' sign sa .lang file!",
        code: `item.pinoy:bayanihan_blade=Bayanihan Blade
tile.pinoy:narra_crate.name=Narra Wooden Crate
entity.pinoy:bakunawa.name=Bakunawa Dragon`
      }
    ]
  };

  function renderTree(packType, selectedId) {
    document.querySelectorAll(".pack-tree-switch").forEach(btn => {
      const isAct = btn.getAttribute("data-pack-tree") === packType;
      btn.className = "pack-tree-switch flex-1 py-2 rounded-lg text-xs font-bold transition " +
        (isAct ? "bg-[#04AA6D] text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700");
    });

    const list = FOLDER_TREES[packType] || FOLDER_TREES.bp;
    const activeItem = list.find(x => x.id === selectedId) || list[0];
    const container = document.getElementById("folderTreeContainer");
    if (!container) return;

    container.innerHTML = list.map(item => {
      const active = item.id === activeItem.id;
      return `<button type="button" data-tree-id="${item.id}" class="w-full text-left px-3 py-2.5 rounded-xl border transition flex items-center justify-between ${
        active ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold" : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800"
      }">
        <span class="truncate">${item.label}</span>
        <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Inspect</span>
      </button>`;
    }).join("");

    container.querySelectorAll("[data-tree-id]").forEach(btn => {
      btn.addEventListener("click", () => renderTree(packType, btn.getAttribute("data-tree-id")));
    });

    document.getElementById("inspectorBadge").textContent = activeItem.badge;
    document.getElementById("inspectorPath").textContent = activeItem.label;
    document.getElementById("inspectorDesc").textContent = activeItem.desc;
    document.getElementById("inspectorTip").textContent = activeItem.tip;
    document.getElementById("inspectorCode").textContent = activeItem.code;
  }

  window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".pack-tree-switch").forEach(btn => {
      btn.addEventListener("click", () => renderTree(btn.getAttribute("data-pack-tree")));
    });
    const copyBtn = document.getElementById("copyInspectorCodeBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        window.MCBE.copyText(document.getElementById("inspectorCode").textContent, "Template copied!");
      });
    }
    renderTree("bp");
  });
})();
