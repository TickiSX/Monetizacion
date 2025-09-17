document.addEventListener("DOMContentLoaded", () => {

  // ======================
  // Carrusel automático
  // ======================
  const carousel = document.querySelector(".carousel");
  if (carousel) {
    const images = carousel.querySelectorAll("img");
    let index = 0;

    // Asegura que solo la primera imagen esté visible
    images.forEach((img, i) => {
      img.style.opacity = i === 0 ? 1 : 0;
      img.style.transition = "opacity 1s ease";
      img.style.position = "absolute";
      img.style.top = 0;
      img.style.left = 0;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
    });

    function showNextImage() {
      const prevIndex = index;
      index = (index + 1) % images.length;
      images[prevIndex].style.opacity = 0;
      images[index].style.opacity = 1;
    }

    setInterval(showNextImage, 4000);
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
    { nombre: "Gatita Gymrat", imagen: "productos/gymrat.jpg", conseguido: true },
    { nombre: "Gatita Gamer/Animación", imagen: "productos/gamer.jpg", conseguido: false },
    { nombre: "Gatita KNY", imagen: "productos/kny.jpg", conseguido: true },
    { nombre: "Gatita Odonto", imagen: "productos/odonto.jpg", conseguido: false },
    { nombre: "Gatita Dormida", imagen: "productos/dormida.jpg", conseguido: true },
    { nombre: "Gatita Hello Kitty", imagen: "productos/hello.jpg", conseguido: false },
    { nombre: "Gatita Cinnamoroll", imagen: "productos/cinnamoroll.jpg", conseguido: true },
    { nombre: "Gatita My Melody", imagen: "productos/my-melody.jpg", conseguido: false },
    { nombre: "Gatita Kuromi", imagen: "productos/kuromi.jpg", conseguido: true },
    { nombre: "Gatita Plátano", imagen: "productos/platano.jpg", conseguido: false }
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

  // Actualiza barra de progreso
  if (progresoBar && progresoTexto) {
    const total = llaveros.length;
    const conseguidos = llaveros.filter(l => l.conseguido).length;
    const porcentaje = Math.round((conseguidos / total) * 100);
    progresoBar.style.width = porcentaje + '%';
    progresoTexto.textContent = `Progreso para recompensa: ${porcentaje}%`;
  }

});
