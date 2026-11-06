(() => {
  "use strict";
  // FONDO ANIMADO DE ESTRELLAS
  const canvas = document.getElementById("fondo-universo");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      let width = 0;
      let height = 0;
      let dpr = 1;
      let stars = [];
      const pointer = {
        x: -1000,
        y: -1000,
        active: false
      };
      const reducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.max(
          70,
          Math.min(220, Math.floor(width * height / 5200))
        );
        stars = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.45 + 0.25,
          speed: Math.random() * 0.22 + 0.035,
          alpha: Math.random() * 0.55 + 0.25,
          phase: Math.random() * Math.PI * 2,
          vx: 0,
          vy: 0
        }));
      }
      function draw(time) {
        ctx.clearRect(0, 0, width, height);
        // Dibujar estrellas
        for (const s of stars) {
          if (!reducedMotion) {
            s.y -= s.speed * 0.22;
            if (s.y < -3) {
              s.y = height + 3;
              s.x = Math.random() * width;
            }
            // Movimiento al acercar el cursor
            if (pointer.active) {
              const dx = s.x - pointer.x;
              const dy = s.y - pointer.y;
              const dist = Math.hypot(dx, dy);
              if (dist < 115 && dist > 1) {
                const force = ((115 - dist) / 115) * 0.12;
                s.vx += (dx / dist) * force;
                s.vy += (dy / dist) * force;
              }
            }
            s.x += s.vx;
            s.y += s.vy;
            s.vx *= 0.94;
            s.vy *= 0.94;
          }
          const twinkle = reducedMotion
            ? 0.7
            : 0.45 +
              (Math.sin(time * 0.0015 + s.phase) + 1) * 0.275;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle =
            `rgba(190,225,255,${s.alpha * twinkle})`;
          ctx.shadowBlur = 7;
          ctx.shadowColor = "#62baff";
          ctx.fill();
        }
        ctx.shadowBlur = 0;
        // ESTRELLA CENTRAL LUMINOSA
        const cx = width * 0.5;
        const cy = height * 0.48;
        const pulse = reducedMotion
          ? 1
          : 1 + Math.sin(time * 0.002) * 0.1;
        const halo = ctx.createRadialGradient(
          cx, cy, 1,
          cx, cy, 95 * pulse
        );
        halo.addColorStop(0, "rgba(130,205,255,.32)");
        halo.addColorStop(0.35, "rgba(50,130,255,.12)");
        halo.addColorStop(1, "rgba(20,80,255,0)");
        ctx.beginPath();
        ctx.arc(cx, cy, 95 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();
        const core = ctx.createRadialGradient(
          cx - 3, cy - 3, 1,
          cx, cy, 19 * pulse
        );
        core.addColorStop(0, "#ffffff");
        core.addColorStop(0.3, "#bceaff");
        core.addColorStop(0.7, "rgba(85,170,255,.65)");
        core.addColorStop(1, "rgba(50,120,255,0)");
        ctx.beginPath();
        ctx.arc(cx, cy, 19 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = core;
        ctx.fill();
        if (!reducedMotion) {
          requestAnimationFrame(draw);
        }
      }
      window.addEventListener("resize", resize, {
        passive: true
      });
      window.addEventListener("pointermove", e => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.active = true;
      }, {
        passive: true
      });
      window.addEventListener("pointerleave", () => {
        pointer.active = false;
      });
      resize();
      requestAnimationFrame(draw);
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".nav-menu");
    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        const open = menu.classList.toggle("active");
        toggle.classList.toggle("active", open);
        toggle.setAttribute(
          "aria-expanded",
          String(open)
        );
      });
      document.querySelectorAll(".nav-item").forEach(item => {
        const link = item.querySelector(":scope > a");
        const submenu = item.querySelector(":scope > .submenu");
        if (link && submenu) {
          link.addEventListener("click", e => {
            if (window.innerWidth <= 768) {
              e.preventDefault();
              item.classList.toggle("submenu-open");
            }
          });
        }
      });
      document.addEventListener("click", e => {
        if (
          !menu.contains(e.target) &&
          !toggle.contains(e.target)
        ) {
          menu.classList.remove("active");
          toggle.classList.remove("active");

          toggle.setAttribute("aria-expanded", "false");
        }
      });
      window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
          menu.classList.remove("active");
          toggle.classList.remove("active");
          toggle.setAttribute("aria-expanded", "false");
          document.querySelectorAll(".nav-item").forEach(i => {
            i.classList.remove("submenu-open");
          });
        }
      });
    }
    // EFECTO 3D DE LAS TARJETAS
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (
      !reduce &&
      window.matchMedia("(pointer:fine)").matches
    ) {
      document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("pointermove", e => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.style.setProperty("--rx", `${-y * 7}deg`);
          card.style.setProperty("--ry", `${x * 7}deg`);
        });
        card.addEventListener("pointerleave", () => {
          card.style.setProperty("--rx", "0deg");
          card.style.setProperty("--ry", "0deg");
        });
      });
    }
    // FORMULARIO DE INSCRIPCIÓN
    const form = document.getElementById("miFormulario");
    if (form) {
      form.addEventListener("submit", e => {
        e.preventDefault();
        alert("¡Datos enviados correctamente! ✨");
        form.reset();
      });
    }
  });
})();