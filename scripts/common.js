// ==========================================================================
// scripts/common.js — Shared Navigation, Lesson Pagination, UUID & XP State
// ==========================================================================
(function () {
  const PAGES = [
    { id: "home", href: "index.html", icon: "🏠", label: "Home & Courses" },
    { id: "beginner", href: "beginner-guide.html", icon: "📱", label: "Beginner Guide (Mobile & PC)" },
    { id: "folders", href: "folder-structures.html", icon: "📁", label: "Folder Structures" },
    { id: "json", href: "json-tutorial.html", icon: "📄", label: "JSON Tutorial" },
    { id: "javascript", href: "javascript-course.html", icon: "🟨", label: "JavaScript Course" },
    { id: "server", href: "server-api.html", icon: "⚙️", label: "/server API" },
    { id: "server-ui", href: "server-ui-api.html", icon: "🖥️", label: "/server-ui & Simulator" },
    { id: "versions", href: "versions.html", icon: "🔢", label: "Versions & Manifest" },
    { id: "practice", href: "tryit-practice.html", icon: "🧪", label: "Try It & Practice" }
  ];

  const SEARCH_ITEMS = [
    { title: "Low-End Phone Trio: ZArchiver, Code Studio, ibisPaint X", href: "beginner-guide.html#step-2" },
    { title: "High-End Phone Upgrades: bridge. v2, Blockbench, Acode, Pixly", href: "beginner-guide.html#step-3" },
    { title: "Paano Mag-package ng .mcaddon at .mcpack sa Mobile", href: "beginner-guide.html#step-4" },
    { title: "Windows PC Setup at com.mojang Directory", href: "beginner-guide.html#step-5" },
    { title: "Behavior Pack (BP) at Resource Pack (RP) Folder Explorer", href: "folder-structures.html" },
    { title: "Custom Sword / Weapon JSON (minecraft:item)", href: "json-tutorial.html#step-2" },
    { title: "Custom Block JSON (minecraft:block)", href: "json-tutorial.html#step-3" },
    { title: "Live JSON Syntax Validator", href: "json-tutorial.html#step-5" },
    { title: "Ano ang JavaScript? (Simpleng Paliwanag at Minecraft Script)", href: "javascript-course.html#step-1" },
    { title: "JavaScript ES6 Imports & Event .subscribe()", href: "javascript-course.html#step-3" },
    { title: "Variables, Functions, if/else at for...of Loops", href: "javascript-course.html#step-4" },
    { title: "Mini Project: Custom Item Skill na may Cooldown", href: "javascript-course.html#step-9" },
    { title: "Mga Karaniwang Script Error at Debugging", href: "javascript-course.html#step-10" },
    { title: "system.runInterval() Game Tick Loop (20 Ticks = 1s)", href: "javascript-course.html#step-8" },
    { title: "@minecraft/server Built-in Functions & Classes Reference", href: "server-api.html" },
    { title: "@minecraft/server-ui ActionFormData, ModalFormData & Simulator", href: "server-ui-api.html" },
    { title: "Minecraft 1.26.50 Version Matrix (@minecraft/server 2.10.0)", href: "versions.html#step-2" },
    { title: "Anatomy ng manifest.json at min_engine_version", href: "versions.html#step-3" },
    { title: "Stable vs Beta APIs at mga Pagbabago sa 2.x", href: "versions.html#step-4" },
    { title: "Live manifest.json Generator (BP at RP)", href: "versions.html#step-6" },
    { title: "Mga Add-On ni Teru Yagami sa CurseForge", href: "index.html#step-3" },
    { title: "Try It Yourself Code Simulator & W3Schools Exercises", href: "tryit-practice.html" }
  ];

  window.MCBE = {
    generateUuidV4: function () {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },

    showToast: function (msg) {
      let toast = document.getElementById("mcbeGlobalToast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "mcbeGlobalToast";
        toast.className = "fixed bottom-5 right-5 z-50 hidden bg-slate-900 border border-emerald-500 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2";
        toast.innerHTML = '<span class="text-emerald-400">✔</span><span id="mcbeGlobalToastMsg"></span>';
        document.body.appendChild(toast);
      }
      document.getElementById("mcbeGlobalToastMsg").textContent = msg;
      toast.classList.remove("hidden");
      clearTimeout(window._mcbeToastTimer);
      window._mcbeToastTimer = setTimeout(() => toast.classList.add("hidden"), 2400);
    },

    copyText: function (text, label) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          window.MCBE.showToast(label || "Na-copy na sa clipboard!");
        }).catch(() => window.MCBE.fallbackCopy(text, label));
      } else {
        window.MCBE.fallbackCopy(text, label);
      }
    },

    fallbackCopy: function (text, label) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      window.MCBE.showToast(label || "Na-copy na sa clipboard!");
    },

    getCompletedExercises: function () {
      try {
        const raw = localStorage.getItem("mcbe_schools_completed_ex");
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }
  };

  // Initialize shared header, top tabs, step-by-step pagination, and sidebar
  function initSharedLayout() {
    const activePage = document.body.getAttribute("data-page") || "home";

    // Render Top Nav Tabs
    const navBar = document.getElementById("topNavTabs");
    if (navBar) {
      navBar.innerHTML = PAGES.map(p => {
        const isCurrent = p.id === activePage;
        return `<a href="${p.href}" class="px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
          isCurrent ? "bg-[#04AA6D] text-white shadow" : "text-slate-300 hover:bg-slate-800"
        }"><span>${p.icon}</span><span>${p.label}</span></a>`;
      }).join("");
    }

    // Update XP Badge
    const done = window.MCBE.getCompletedExercises();
    const xpEl = document.getElementById("xpCounterBadge");
    if (xpEl) xpEl.textContent = (done.length * 25) + " XP";
    const progText = document.getElementById("sidebarCompletedText");
    if (progText) progText.textContent = done.length + " / 6";
    const progBar = document.getElementById("sidebarProgressBar");
    if (progBar) progBar.style.width = Math.round((done.length / 6) * 100) + "%";

    // Setup Step-by-Step Sub-Chapter Pagination (W3Schools style: 1 topic at a time!)
    const steps = Array.from(document.querySelectorAll(".lesson-step"));
    const sidebarList = document.getElementById("sidebarLessonList");
    const mobileList = document.getElementById("mobileSidebarLessonList");
    let currentStepIdx = 0;

    function showStep(idx) {
      if (steps.length === 0) return;
      if (idx < 0) idx = 0;
      if (idx >= steps.length) idx = steps.length - 1;
      currentStepIdx = idx;

      steps.forEach((el, i) => {
        el.classList.toggle("active", i === idx);
      });

      const updateLinks = (container) => {
        if (!container) return;
        container.querySelectorAll("[data-step-target]").forEach(btn => {
          const bIdx = parseInt(btn.getAttribute("data-step-target"), 10);
          btn.className = "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between " +
            (bIdx === idx
              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold"
              : "text-slate-300 hover:bg-slate-800");
        });
      };
      updateLinks(sidebarList);
      updateLinks(mobileList);

      // Update Prev / Next Chapter buttons inside the page
      const prevBtns = document.querySelectorAll(".step-prev-btn");
      const nextBtns = document.querySelectorAll(".step-next-btn");
      const stepIndicator = document.getElementById("stepPageIndicator");

      if (stepIndicator) {
        stepIndicator.textContent = `Lesson ${idx + 1} of ${steps.length}`;
      }
      prevBtns.forEach(b => {
        b.disabled = idx === 0;
        b.classList.toggle("opacity-40", idx === 0);
      });
      nextBtns.forEach(b => {
        const isLast = idx === steps.length - 1;
        const nextHref = document.body.getAttribute("data-next-page");
        if (isLast && nextHref) {
          b.textContent = "Next Module ❯";
        } else {
          b.textContent = "Next Lesson ❯";
        }
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (steps.length > 0 && sidebarList) {
      const itemsHtml = steps.map((stepEl, i) => {
        const title = stepEl.getAttribute("data-step-title") || `Lesson ${i + 1}`;
        return `<button type="button" data-step-target="${i}" class="w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between">
          <span class="truncate">${title}</span>
          <span class="text-[10px] text-slate-500">❯</span>
        </button>`;
      }).join("");

      sidebarList.innerHTML = itemsHtml;
      if (mobileList) mobileList.innerHTML = itemsHtml;

      const countEl = document.getElementById("sidebarLessonCount");
      if (countEl) countEl.textContent = steps.length + " Lessons";

      [sidebarList, mobileList].forEach(container => {
        if (!container) return;
        container.querySelectorAll("[data-step-target]").forEach(btn => {
          btn.addEventListener("click", () => {
            showStep(parseInt(btn.getAttribute("data-step-target"), 10));
            const md = document.getElementById("mobileDrawer");
            const mb = document.getElementById("mobileDrawerBackdrop");
            if (md) md.classList.add("hidden");
            if (mb) mb.classList.add("hidden");
          });
        });
      });

      document.querySelectorAll(".step-prev-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          if (currentStepIdx > 0) showStep(currentStepIdx - 1);
        });
      });

      document.querySelectorAll(".step-next-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          if (currentStepIdx < steps.length - 1) {
            showStep(currentStepIdx + 1);
          } else {
            const nextHref = document.body.getAttribute("data-next-page");
            if (nextHref) window.location.href = nextHref;
          }
        });
      });

      // Check hash #step-N
      const hashMatch = window.location.hash.match(/#step-(\d+)/);
      if (hashMatch) {
        const targetIdx = Math.max(0, parseInt(hashMatch[1], 10) - 1);
        showStep(targetIdx);
      } else {
        showStep(0);
      }
    }

    // Sidebar UUID v4 Generator
    const genBtn = document.getElementById("sidebarGenUuidBtn");
    const uuidOut = document.getElementById("sidebarUuidOutput");
    const copyUuidBtn = document.getElementById("sidebarCopyUuidBtn");
    if (genBtn && uuidOut) {
      genBtn.addEventListener("click", () => {
        uuidOut.value = window.MCBE.generateUuidV4();
        window.MCBE.showToast("Generated fresh UUID v4!");
      });
    }
    if (copyUuidBtn && uuidOut) {
      copyUuidBtn.addEventListener("click", () => {
        window.MCBE.copyText(uuidOut.value, "UUID v4 copied!");
      });
    }

    // Mobile drawer controls
    const mobBtn = document.getElementById("mobileSidebarBtn");
    const closeMobBtn = document.getElementById("closeMobileDrawerBtn");
    const mobBackdrop = document.getElementById("mobileDrawerBackdrop");
    const mobDrawer = document.getElementById("mobileDrawer");
    if (mobBtn && mobDrawer && mobBackdrop) {
      mobBtn.addEventListener("click", () => {
        mobDrawer.classList.remove("hidden");
        mobBackdrop.classList.remove("hidden");
      });
      const closeFn = () => {
        mobDrawer.classList.add("hidden");
        mobBackdrop.classList.add("hidden");
      };
      if (closeMobBtn) closeMobBtn.addEventListener("click", closeFn);
      mobBackdrop.addEventListener("click", closeFn);
    }

    // Theme contrast button
    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        window.MCBE.showToast("Toggled theme mode!");
      });
    }

    // Global Search Input
    const sInput = document.getElementById("globalSearchInput");
    const sRes = document.getElementById("globalSearchResults");
    if (sInput && sRes) {
      sInput.addEventListener("input", () => {
        const q = sInput.value.toLowerCase().trim();
        if (!q) {
          sRes.classList.add("hidden");
          return;
        }
        const matches = SEARCH_ITEMS.filter(x => x.title.toLowerCase().includes(q));
        if (matches.length === 0) {
          sRes.innerHTML = `<div class="p-3 text-xs text-slate-400">Walang nahanap para sa "${q}".</div>`;
        } else {
          sRes.innerHTML = matches.map(m => `
            <a href="${m.href}" class="block px-3.5 py-2.5 text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between">
              <span>${m.title}</span>
              <span class="text-emerald-400 font-mono text-[10px]">Buksan ❯</span>
            </a>
          `).join("");
        }
        sRes.classList.remove("hidden");
      });
    }

    // Copy buttons for static code blocks
    document.querySelectorAll("[data-copy-target]").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-copy-target");
        const el = document.getElementById(targetId);
        if (el) window.MCBE.copyText(el.textContent, "Code copied to clipboard!");
      });
    });
  }

  window.addEventListener("DOMContentLoaded", initSharedLayout);
})();
