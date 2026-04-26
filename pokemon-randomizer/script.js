const randomBtn = document.getElementById('randomBtn');
const loadingEl = document.getElementById('loading');
const pokemonImage = document.getElementById('pokemonImage');
const pokemonName = document.getElementById('pokemonName');
const pokemonId = document.getElementById('pokemonId');
const typesContainer = document.getElementById('typesContainer');
const pokemonHeight = document.getElementById('pokemonHeight');
const pokemonWeight = document.getElementById('pokemonWeight');

const POKEMON_COUNT = 1025;

async function fetchRandomPokemon() {
    try {
        randomBtn.disabled = true;
        loadingEl.style.display = 'block';

        const randomId = Math.floor(Math.random() * POKEMON_COUNT) + 1;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);

        if (!response.ok) {
            throw new Error('ポケモン情報の取得に失敗しました');
        }

        const data = await response.json();
        displayPokemon(data);
    } catch (error) {
        console.error('エラー:', error);
        pokemonName.textContent = 'エラーが発生しました';
        pokemonImage.src = '';
    } finally {
        randomBtn.disabled = false;
        loadingEl.style.display = 'none';
    }
}

function displayPokemon(data) {
    pokemonImage.src = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
    pokemonName.textContent = data.name;
    pokemonId.textContent = `ID: #${data.id}`;

    typesContainer.innerHTML = data.types
        .map(t => `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`)
        .join('');

    pokemonHeight.textContent = (data.height / 10).toFixed(1) + ' m';
    pokemonWeight.textContent = (data.weight / 10).toFixed(1) + ' kg';
}

randomBtn.addEventListener('click', fetchRandomPokemon);

// 最初に1つ表示
fetchRandomPokemon();
