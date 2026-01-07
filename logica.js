AOS.init();
let todosLosPersonajes = [];

//Menu y Dropdown
function toggleMenu() {
  document.getElementById("menu-lista").classList.toggle("activo");
}
function toggleDropdown() {
  document.getElementById("miDropdown").classList.toggle("mostrar");
}

//Cargar paginas
const NUMERO_PAGINAS = 16;

async function cargarPersonajes() {
  const promesas = [];
  for (let i = 1; i <= NUMERO_PAGINAS; i++) {
    const url = `https://rickandmortyapi.com/api/character?page=${i}`;
    promesas.push(fetch(url).then((res) => res.json()));
  }
  try {
    const resultados = await Promise.all(promesas);
    todosLosPersonajes = resultados.flatMap((dato) => dato.results);
    pintarPersonajes(todosLosPersonajes);
  } catch (error) {
    console.log("Error cargando múltiples páginas:", error);
  }
}
//Pintar personajes
function pintarPersonajes(lista) {
  const galeria = document.getElementById("galeria");
  galeria.innerHTML = "";

  lista.forEach((personaje) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";
    tarjeta.setAttribute("data-aos", "fade-up");

    tarjeta.innerHTML = `
            <img src="${personaje.image}" alt="${personaje.name}">
            <h3>${personaje.name}</h3>
        `;

    tarjeta.onclick = () => abrirModal(personaje);
    galeria.appendChild(tarjeta);
  });
}

//filtrado
function filtrar(especie) {
  if (especie === "todos") {
    pintarPersonajes(todosLosPersonajes);
  } else {
    const filtrados = todosLosPersonajes.filter((pj) => pj.species === especie);
    pintarPersonajes(filtrados);
  }

  document.getElementById("miDropdown").classList.remove("mostrar");
  document.getElementById("menu-lista").classList.remove("activo");
}
//Modal
function abrirModal(pj) {
  const modal = document.getElementById("miModal");
  document.getElementById("modal-nombre").innerText = pj.name;
  // vivo o muerto
  let colorEstado =
    pj.status === "Alive" ? "green" : pj.status === "Dead" ? "red" : "gray";

  document.getElementById("modal-info").innerHTML = `
        <img src="${pj.image}" style="width:100px; border-radius:50%; margin-bottom:10px;">
        <p><strong>Especie:</strong> ${pj.species}</p>
        <p><strong>Estado:</strong> <span style="color:${colorEstado}">● ${pj.status}</span></p>
        <p><strong>Origen:</strong> ${pj.origin.name}</p>
        <p><strong>Género:</strong> ${pj.gender}</p>
    `;
  modal.style.display = "flex";
}

function cerrarModal() {
  document.getElementById("miModal").style.display = "none";
}

cargarPersonajes();

//Navegación personajes
function buscar() {
  const texto = document.getElementById("buscador").value.toLowerCase();
  const filtrados = todosLosPersonajes.filter((pj) =>
    pj.name.toLowerCase().includes(texto)
  );
  pintarPersonajes(filtrados);
}
