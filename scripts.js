// Obtener el elemento del dom para mostrar la pokedex
const pokedex = document.getElementById("pokedex");
pokeCache = {};

// Función para obtener los datos de los Pokémon
const fetchPokemon = async () => {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=150";
  const res = await fetch(url);
  const data = await res.json();
  const pokemons = data.results.map((result, index) => ({
    ...result, // Spread operator para copiar todas las propiedades de result
    id: index + 1,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      index + 1
    }.png`,
  }));
  // Mostrar los datos de los Pokémon en el DOM
  displayPokemon(pokemons);
};

// Función para mostrar los datos de los Pokémon en el DOM
const displayPokemon = (pokemons) => {
  const pokemonHTMLString = pokemons
    .map(
      (pokemon) => `
    <li class="card" onclick="selectPokemon(${pokemon.id})">
    <img class="card-image" src="${pokemon.image}">
    <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
    </li>
  `
    )
    .join("");
  // Insertar los elementos de la pokedex en el DOM
  pokedex.innerHTML = pokemonHTMLString;
};

// Función para seleccionar un Pokémon
const selectPokemon = async (id) => {
  if (!pokeCache[id]) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const pokemon = await res.json();
    pokemon.image = pokemon.sprites["front_default"];
    pokeCache[id] = pokemon;
    displayPopup(pokemon);
  }
  displayPopup(pokeCache[id]);
};

// Función para mostrar un popup con los datos del Pokémon seleccionado
const displayPopup = (pokemon) => {
  // Eliminar cualquier popup existente antes de mostrar uno nuevo
  const existingPopup = document.querySelector(".popup");
  if (existingPopup) {
    existingPopup.remove();
  }
  
  const type = pokemon.types.map((type) => type.type.name).join(", ");
  const htmlString = `
    <div class="popup">
      <button id="closeBtn" onclick="closePopup()">Cerrar</button>
      <div class="card">
        <img class="card-image" src="${pokemon.image}">
        <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
        <p><small>Altura: ${pokemon.height}</small></p>
        <p><small>Peso: ${pokemon.weight}</small></p>
        <p><small>Tipo: ${type}</small></p>
      </div>
    </div>
  `;
  // Insertar el popup en el DOM
  pokedex.innerHTML = htmlString + pokedex.innerHTML;
};

// Función para cerrar el popup
const closePopup = () => {
  const popup = document.querySelector(".popup");
  if (popup) {
    popup.remove();
  }
};

// Llamar a la función fetchPokemon
fetchPokemon();
