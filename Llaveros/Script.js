document.addEventListener("DOMContentLoaded", () => {
  // ======================
  // Carrusel automático (si existe)
  // ======================
  const images = document.querySelectorAll(".carousel img");
  if (images.length > 0) {
    let index = 0;
    function showNextImage() {
      images[index].classList.remove("active");
      index = (index + 1) % images.length;
      images[index].classList.add("active");
    }
    setInterval(showNextImage, 4000); // cambia cada 4s
  }

  // ======================
  // Lógica del carrito
  // ======================
  const botonesAgregar = document.querySelectorAll(".agregar-carrito");
  botonesAgregar.forEach(boton => {
    boton.addEventListener("click", () => {
      const producto = {
        nombre: boton.dataset.nombre,
        precio: parseFloat(boton.dataset.precio)
      };
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      carrito.push(producto);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      alert(`${producto.nombre} agregado al carrito 🛍️`);
    });
  });

  const listaCarrito = document.getElementById("carrito-lista");
  const totalElemento = document.getElementById("carrito-total");
  if (listaCarrito && totalElemento) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let total = 0;
    listaCarrito.innerHTML = "";
    carrito.forEach((producto, index) => {
      const li = document.createElement("li");
      li.textContent = `${producto.nombre} - $${producto.precio.toFixed(2)}`;
      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "❌";
      btnEliminar.style.marginLeft = "10px";
      btnEliminar.addEventListener("click", () => {
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        location.reload();
      });
      li.appendChild(btnEliminar);
      listaCarrito.appendChild(li);
      total += producto.precio;
    });
    totalElemento.textContent = `$${total.toFixed(2)}`;
  }

  // ======================
  // Generación de llaveros y progreso
  // ======================
  const llaveros = [
    { nombre: "Gatita Gymrat", imagen: "img/gymrat.jpg", conseguido: true },
    { nombre: "Gatita Gamer/Animación", imagen: "img/gamer.jpg", conseguido: false },
    { nombre: "Gatita KNY", imagen: "img/kny.jpg", conseguido: true },
    { nombre: "Gatita Odonto", imagen: "img/odonto.jpg", conseguido: false },
    { nombre: "Gatita Dormida", imagen: "img/dormida.jpg", conseguido: true },
    { nombre: "Gatita Hello Kitty", imagen: "img/hello.jpg", conseguido: false },
    { nombre: "Gatita Cinnamoroll", imagen: "img/cinnamoroll.jpg", conseguido: true },
    { nombre: "Gatita My Melody", imagen: "img/my-melody.jpg", conseguido: false },
    { nombre: "Gatita Kuromi", imagen: "img/kuromi.jpg", conseguido: true },
    { nombre: "Gatita Plátano", imagen: "img/platano.jpg", conseguido: false }
  ];

  const container = document.getElementById('llaverosContainer');
  const progresoBar = document.getElementById('progresoBar');
  const progresoTexto = document.getElementById('progresoTexto');

  if (container) {
    llaveros.forEach(llavero => {
      const tarjeta = document.createElement('div');
      tarjeta.className = 'tarjeta-llavero ' + (llavero.conseguido ? 'conseguido' : 'faltante');
      tarjeta.innerHTML = `
        <img src="${llavero.imagen}" alt="${llavero.nombre}">
        <div class="nombre">${llavero.nombre}</div>
        <div class="estado">${llavero.conseguido ? 'Conseguido' : 'Faltante'}</div>
      `;
      container.appendChild(tarjeta);
    });
  }

  // Solo actualiza la barra de progreso si existe
  if (progresoBar && progresoTexto) {
    const total = llaveros.length;
    const conseguidos = llaveros.filter(l => l.conseguido).length;
    const porcentaje = Math.round((conseguidos / total) * 100);

    progresoBar.style.width = porcentaje + '%';
    progresoTexto.textContent = `Progreso para recompensa: ${porcentaje}%`;
  }
});

