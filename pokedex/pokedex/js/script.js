const apiUrl = "https://pokeapi.co/api/v2/pokemon/";
let allPokemonData = [];

async function fetchPokemonData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Não foi possível carregar os dados do Pokémon.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function displayPokemonList() {
    const pokemonList = document.getElementById("pokemon-list");
    const pokemonData = await fetchPokemonData(apiUrl);

    if (pokemonData && pokemonData.results) {
        allPokemonData = await Promise.all(pokemonData.results.map(async (pokemon, index) => {
            const specificUrl = apiUrl + (index + 1) + '/';
            return await fetchPokemonData(specificUrl);
        }));

        updatePokemonCards(allPokemonData);
    }
}

function updatePokemonCards(pokemonData) {
    const pokemonList = document.getElementById("pokemon-list");
    pokemonList.innerHTML = '';

    pokemonData.forEach(pokemonDetails => {
        const card = document.createElement("div");
        card.classList.add("pokemon-card");
        card.innerHTML = `
            <h2>${pokemonDetails.name}</h2>
            <img src="${pokemonDetails.sprites.front_default}" alt="${pokemonDetails.name}">
        `;
        card.addEventListener("click", () => openModal(pokemonDetails));
        pokemonList.appendChild(card);
    });
}

function openModal(pokemonDetails) {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content");
    const closeButton = document.getElementById("close-button");

    modalTitle.textContent = pokemonDetails.name;
    modalContent.innerHTML = `
        <img src="${pokemonDetails.sprites.front_default}" alt="${pokemonDetails.name}">
        <p>Altura: ${pokemonDetails.height} decímetros</p>
        <p>Peso: ${pokemonDetails.weight} hectogramas</p>
    `;

    modal.style.display = "block";

    closeButton.addEventListener("click", () => closeModal());
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

document.getElementById("search-input").addEventListener("input", function() {
    const searchTerm = this.value.toLowerCase();

    if (searchTerm === '') {
        // Se o campo de pesquisa estiver vazio, exiba todos os Pokémon.
        updatePokemonCards(allPokemonData);
    } else {
        // Filtrar Pokémon que correspondam ao termo de pesquisa.
        const filteredPokemon = allPokemonData.filter(pokemon => pokemon.name.includes(searchTerm));
        updatePokemonCards(filteredPokemon);
    }
});

displayPokemonList();
