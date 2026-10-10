// Published CSV Web URL from Google Sheets
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSXNFYPQwuBcWTbHrNsT1UVufrpIJNxThIRos65BwUBhUGhQdS6brE8uz7PCzNWWzx35i5kD6JvutYw/pub?gid=962318280&single=true&output=csv";

function getSpriteUrl(pokemon) {
    const isShiny = pokemon.Shiny == "Yes";
    const colorFolder = isShiny ? "shiny" : "normal";
    if (pokemon.Species.includes("Mega")) {
        return `https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/${colorFolder}/sceptile-mega.png`;
    }

    const speciesName = pokemon.Species.toLowerCase();
    const game = pokemon.Game || "";
    let folder = "home";
    if (game.includes("Generation 3")) folder = "emerald";
    else if (game.includes("Generation 4")) folder = "diamond-pearl";
    else if (game.includes("Generation 5")) folder = "black-white";
    else if (game.includes("Generation 6")) folder = "x-y";

    return `https://img.pokemondb.net/sprites/${folder}/${colorFolder}/${speciesName}.png`;

}

let allPokemon = [];
let currentIndex = 0;

function loadTreeckoArmy() {
    Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: function (results) {
            allPokemon = results.data.filter(pokemon => pokemon.OT);
            renderCarousel();
            setInterval(() => {
                currentIndex = (currentIndex + 1) % allPokemon.length;
                renderCarousel();
            }, 4000);
        }
    });
}

// A helper to build a single card
function buildCardHTML(pokemon, position) {
    if (!pokemon) return null; // Safety check

    const card = document.createElement("div");
    card.className = "pokemon-card card-transition";

    if (position === "left") {
        card.style.transform = "rotate(-6deg) translateY(30px) scale(0.9)";
        card.style.zIndex = "1";
    } else if (position === "right") {
        card.style.transform = "rotate(6deg) translateY(30px) scale(0.9)";
        card.style.zIndex = "1";
    } else { // center
        card.style.transform = "rotate(0deg) scale(1.05)";
        card.style.zIndex = "2";
    }

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const title = document.createElement("h2");
    title.className = "card-title";
    title.textContent = pokemon.Nickname ? pokemon.Nickname : pokemon.Species;
    inner.appendChild(title);

    if (pokemon.Title) {
        const subtitle = document.createElement("div");
        subtitle.className = "card-subtitle";
        subtitle.textContent = pokemon.Title;
        inner.appendChild(subtitle);
    }

    const spriteBox = document.createElement("div");
    spriteBox.className = "sprite-container";
    const sprite = document.createElement("img");
    sprite.src = getSpriteUrl(pokemon);
    sprite.alt = `${pokemon.Species}`;
    sprite.className = "pokemon-sprite";
    spriteBox.appendChild(sprite);
    inner.appendChild(spriteBox);

    const stats = document.createElement("div");
    stats.className = "card-stats";
    const trainerInfo = document.createElement("p");
    const trainerLabel = document.createElement("strong");
    trainerLabel.textContent = "Original Trainer: ";
    trainerInfo.append(trainerLabel, `${pokemon.OT}`);
    stats.appendChild(trainerInfo);

    const caughtInfo = document.createElement("p");
    const caughtLabel = document.createElement("strong");
    caughtLabel.textContent = "Caught: ";
    caughtInfo.append(caughtLabel, pokemon.Caught);
    stats.appendChild(caughtInfo);
    inner.appendChild(stats);

    const footer = document.createElement("div");
    footer.className = "card-footer";
    if (pokemon.TID) {
        footer.textContent = `${pokemon.TID}`;
    }
    inner.appendChild(footer);

    const foil = document.createElement("div");
    foil.className = "foil";
    inner.appendChild(foil);

    card.appendChild(inner);
    return card;
}

function renderCarousel() {
    const container = document.getElementById("hof-container");
    container.innerHTML = ""; // Clear existing cards

    if (allPokemon.length === 0) return;

    // Figure out the indices for the Left, Center, and Right cards. 
    // The % operator ensures it loops back to the start!
    const leftIndex = (currentIndex - 1 + allPokemon.length) % allPokemon.length;
    const centerIndex = currentIndex;
    const rightIndex = (currentIndex + 1) % allPokemon.length;

    // Only render 3 if we have at least 3 submissions!
    if (allPokemon.length >= 3) {
        container.appendChild(buildCardHTML(allPokemon[leftIndex], "left"));
        container.appendChild(buildCardHTML(allPokemon[centerIndex], "center"));
        container.appendChild(buildCardHTML(allPokemon[rightIndex], "right"));
    } else {
        // Fallback if there are only 1 or 2 entries
        container.appendChild(buildCardHTML(allPokemon[centerIndex], "center"));
    }
}

loadTreeckoArmy();