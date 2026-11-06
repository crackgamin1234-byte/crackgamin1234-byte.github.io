document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("hamburguesa");
  const menu = document.getElementById("menuHolografico");
  if (!boton || !menu) return;
  const botones = menu.querySelectorAll(
    ".menu-opciones button[data-clase]"
  );
  const paginas = document.querySelectorAll(
    ".contenido-principal > .pagina"
  );
  // CERRAR BARRA LATERAL
  function cerrarMenu() {
    menu.classList.remove("abierto");
    boton.classList.remove("abierto");
    boton.setAttribute("aria-expanded", "false");
  }
  // ABRIR Y CERRAR CON TRES BARRAS
  boton.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    boton.classList.toggle("abierto", abierto);
    boton.setAttribute(
      "aria-expanded",
      String(abierto)
    );
  });
  // CAMBIAR ENTRE LAS CLASES
  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const destino = document.getElementById(
        btn.dataset.clase
      );
      if (!destino) return;
      // Ocultar todas las páginas
      paginas.forEach(p => {
        p.classList.remove("activa");
      });
      // Mostrar la página seleccionada
      destino.classList.add("activa");
      // Marcar botón seleccionado
      botones.forEach(b => {
        b.classList.toggle("activo", b === btn);
      });
      cerrarMenu();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  });
  // CERRAR AL HACER CLIC FUERA
  document.addEventListener("click", e => {
    if (
      !menu.contains(e.target) &&
      !boton.contains(e.target)
    ) {
      cerrarMenu();
    }
  });
  // CERRAR CON LA TECLA ESCAPE
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      cerrarMenu();
    }
  });
});