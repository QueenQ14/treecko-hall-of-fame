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

function loadTreeckoArmy() {
    Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: function (results) {
            console.log("Data successfully loaded!");
            console.log(results.data);
            const container = document.getElementById("hof-container");
            results.data.forEach(function (pokemon) {
                // Skipping if no trainer name
                if (!pokemon.OT) return;

                //creating a new HTML div for current entry
                const card = document.createElement("div");
                card.className = "pokemon-card";

                const sprite = document.createElement("img");
                sprite.src = getSpriteUrl(pokemon);
                sprite.alt = `${pokemon.Species}`;
                sprite.className = "pokemon-sprite";
                card.appendChild(sprite);

                const title = document.createElement("h2");
                // Using species as default if no nickname was given
                const displayName = pokemon.Nickname ? pokemon.Nickname : pokemon.Species;
                const displayTitle = pokemon.Title ? " " + pokemon.Title : "";
                title.textContent = `${displayName}${displayTitle}`;
                card.appendChild(title);

                const trainerInfo = document.createElement("p");
                const trainerLabel = document.createElement("strong");
                trainerLabel.textContent = "Original Trainer: ";
                trainerInfo.append(trainerLabel, `${pokemon.OT}`);
                card.appendChild(trainerInfo);

                const caughtInfo = document.createElement("p");
                const caughtLabel = document.createElement("strong");
                caughtLabel.textContent = "Caught: ";
                caughtInfo.append(caughtLabel, pokemon.Caught);
                card.appendChild(caughtInfo);

                container.appendChild(card);
            })
        },
        error: function (error) {
            console.error("Error fetching the CSV:", error);
        }
    });
}

loadTreeckoArmy()