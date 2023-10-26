const apiUrl = "https://pokeapi.co/api/v2/pokemon/";
const pokemonList = document.getElementById("pokemon-list");
const searchInput = document.getElementById("search-input");

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

async function displayAllPokemon() {
    let nextUrl = apiUrl;

    while (nextUrl) {
        const pokemonData = await fetchPokemonData(nextUrl);

        if (pokemonData && pokemonData.results) {
            updatePokemonCards(pokemonData.results);
            nextUrl = pokemonData.next;
        }
    }
}

function updatePokemonCards(pokemonData) {
    pokemonData.forEach(async pokemon => {
        const card = document.createElement("div");
        card.classList.add("pokemon-card");
        const pokemonDetails = await fetchPokemonData(pokemon.url);

        card.innerHTML = `
        <h2>${pokemonDetails.name}</h2>
            <img src="${pokemonDetails.sprites.front_default}" alt="${pokemonDetails.name}">
            
        `;

        card.addEventListener("click", () => {
            openModal(pokemonDetails);
        });

        pokemonList.appendChild(card);
    });
}

function openModal(pokemon) {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content");

    modalTitle.textContent = pokemon.name;

    // Adicione uma imagem ao modal
    const img = document.createElement("img");
    img.src = pokemon.sprites.front_default;
    img.alt = pokemon.name;

    modalContent.innerHTML = ''; // Limpa o conteúdo anterior
    modalContent.appendChild(img);

    // Adicione outras informações, se necessário
    modalContent.innerHTML += `
        <p>ID: ${pokemon.id}</p>
        <p>Altura: ${pokemon.height} decímetros</p>
        <p>Peso: ${pokemon.weight} hectogramas</p>
    `;

    modal.style.display = "block";
}

function searchPokemon() {
    const searchTerm = searchInput.value.toLowerCase();
    const pokemonCards = document.querySelectorAll(".pokemon-card");

    pokemonCards.forEach(card => {
        const name = card.querySelector("h2").textContent.toLowerCase();
        if (name.includes(searchTerm)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

const closeModalButton = document.getElementById("close-button");
closeModalButton.addEventListener("click", () => {
    closeModal();
});

function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

searchInput.addEventListener("input", searchPokemon);
displayAllPokemon();
