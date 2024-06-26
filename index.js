const pokemonDropDown = document.getElementById('pokemonDropDown');


// Klassdefinition 
class Pokemon {
    constructor(data) {
        this.name = data.name;
        this.image = data.sprites.front_default;
        this.types = data.types.map(typeInfo => typeInfo.type.name);
        this.weight = data.weight;
        this.height = data.height;
        this.stats = {
            hp: data.stats[0].base_stat,
            maxHP: data.stats[0].base_stat,
            attack: data.stats[1].base_stat,
            specialAttack: data.stats[2].base_stat,
            defense: data.stats[3].base_stat,
            specialDefense: data.stats[4].base_stat,
            speed: data.stats[5].base_stat
        };
        //Lägger till denna del inför VG delen där moves behövs 
        this.moves = data.moves.map(moveInfo => moveInfo.move.name); // Hämta alla attacker
        this.primaryAttack = this.moves[0]; // Namnet på den första attacken i listan
    }


    //Attackdmg räknar ihop attack + specialAttack
    getAttack() {
        return this.stats.attack + this.stats.specialAttack;
    }
    //Den hämtar data från stats.defence och lägger till den till värdet från specialDef vilket blir det motstånd som den kommer att kunna ge till den attakerade pokemonen 
    getDefence() {
        return this.stats.defense + this.stats.specialDefense;
    }
    takeDamage(damage) {
        if (damage < 10) {
            damage = 10; // ser till att skadan aldrig är mindre än 10
        }
        this.stats.hp -= damage;  // Minskar pokemonens HP med damage
        if (this.stats.hp < 0) {
            this.stats.hp = 0; // Sätter HP till 0 om det blir minus
        }
    }
    resetHP() {
        this.stats.hp = this.stats.maxHP;
    }
}


// Klassen ska bestämma vem som attackerar och vem som försvarar vid ett givet tillfälle.  i construktorn avgörs vilken av Pokemonsen som ska börja striden baserat på deras stats.speed*/
class FightTurns {
    constructor(combatantOne, combatantTwo) {
        // Om combatantone speed är större eller lika med än comb.tvås speed kommer ettan att börja , annars börjat tvåan 
        if (combatantOne.stats.speed >= combatantTwo.stats.speed) {
            this.attackingPokemon = combatantOne;
            this.defendingPokemon = combatantTwo;
        } else {
            this.attackingPokemon = combatantTwo;
            this.defendingPokemon = combatantOne;
        }

    }
    whoIsAttacking() {
        return this.attackingPokemon;
    }

    whoIsDefending() {
        return this.defendingPokemon;
    }
    //En metod som byter plats på den attackerande och försvarande Pokemon.
    changeTurn() {
        //skapar en ny variabel willBeAttackingPokemon och tilldelas värdet av this.defendingPokemon. Detta betyder att den Pokemon som förut  försvarade sig  kommer att bli den attackerande Pokemon och vise versa för den andra vaiabeln
        let willBeAttackingPokemon = this.defendingPokemon;
        let willBeDefendingPokemon = this.attackingPokemon;

        this.attackingPokemon = willBeAttackingPokemon; //  den tidigare försvarande Pokemon nu är den attackerande Pokemon.
        this.defendingPokemon = willBeDefendingPokemon; //  den tidigare attackerande Pokemon nu är den försvarande Pokemon.
    }
}



class PokemonCreator {
    constructor() {
    }

    async createPokemonList() {
        let pokemonListInstance = new PokemonList();
        const pokemonAPIData = await this.getDataFromApi();

        for (let pokemonData of pokemonAPIData) {
            let response = await fetch(pokemonData.url);
            let data = await response.json();
            let pokemon = new Pokemon(data);
            pokemonListInstance.addPokemonToList(pokemon);
        }

        return pokemonListInstance;
    };

    async getDataFromApi() {
        // La till en try catch block , bör kanske flytta upp det ?
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50');
            if (!response.ok) {
                throw new Error('network response not OK  ');
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching data from API:', error);
            return null; //Om något är fel kommer det att returnera null 
        }
    }
    //Adderar pokemons till drop down listan 
    addPokemonToDropdown(name) {
        const option = document.createElement('option');
        option.text = name;
        pokemonDropDown.add(option);
    }
}

class PokemonList {
    constructor() {
        this.pokemons = [];
    }
    addPokemonToList(pokemon) {
        this.pokemons.push(pokemon);
    }
    //Metod för att att get ett pokemonname från listan 
    getPokemonFromList(pokemonName) {
        return this.pokemons.find(pokemon => pokemon.name === pokemonName);
    }
}

// Funktion för att visa den valda Pokemon
function displaySelectedPokemon(selectedPokemon, selectedPokemonElement) {
    selectedPokemonElement.innerHTML = `
    <h2>${selectedPokemon.name}</h2>
    <img src="${selectedPokemon.image}" alt="${selectedPokemon.name}">
    <p>Types: ${selectedPokemon.types.join(', ')}</p>
    <p>Weight: ${selectedPokemon.weight}</p>
    <p>Height: ${selectedPokemon.height}</p>
    <p>Stats:</p>
    <ul>
    <li>HP: ${selectedPokemon.stats.hp}</li>
    <li>Attack: ${selectedPokemon.stats.attack}</li>
    <li>Special Attack: ${selectedPokemon.stats.specialAttack}</li>
    <li>Defense: ${selectedPokemon.stats.defense}</li>
    <li>Special Defense: ${selectedPokemon.stats.specialDefense}</li>
    <li>Speed: ${selectedPokemon.stats.speed}</li>
    </ul>
    <p>Primary Attack: ${selectedPokemon.primaryAttack}</p>
    `;
}

//Denna funktion kommer att jämföra 2 pokemon mot varandra . Den pokemons vars värde är bättre än den andras kommer att bli grön. Därefter kommer en vinnare att visas.  
function comparePokemon(pokemon1, pokemon2) {

    let comparison = ''; // Sätter till en tom sträng till en början 

    // Sätter dessa till 0 till en böörjan 
    let wins1 = 0;
    let wins2 = 0;

    //Itererar över alla stats 
    for (let stat in pokemon1.stats) {
        comparison += `<p><strong>${stat}:</strong> `; // tstats texten kommer att vara i fet stil 
        // Den kommer att kolla om pokemon1:s stats är större eller mindre. Om pokemon1 är större kommer den att få grön text. wins kommer att öka med 1 
        if (pokemon1.stats[stat] > pokemon2.stats[stat]) {
            comparison += `<br><span style="color:rgb(10, 233, 10)">${pokemon1.name}: ${pokemon1.stats[stat]}</span> vs ${pokemon2.name}: ${pokemon2.stats[stat]}</p>`;
            wins1++; //ökar wins 
            //Om pokemon1 stats är minsre kommer pokemon 2 att få poäng 
        } else if (pokemon1.stats[stat] < pokemon2.stats[stat]) {
            comparison += `<br>${pokemon1.name}: ${pokemon1.stats[stat]} vs <span style="color:rgb(10, 233, 10)">${pokemon2.name}: ${pokemon2.stats[stat]}</span></p>`;
            wins2++;
        } else { // om ingen har högre stats kommer det att visas vit text och ingen får poäng 
            comparison += `${pokemon1.name}: ${pokemon1.stats[stat]} vs ${pokemon2.name}: ${pokemon2.stats[stat]}</p>`;
        }
    }
    comparementstats.innerHTML = comparison;

    //Om qins 1 är större än wins 2 kommer vinnaren att vara pokemon1 , annars tvärt om 
    const winner = wins1 > wins2 ? pokemon1 : pokemon2;
    const comparementContainer = document.getElementById('comparementContainer'); // Jag väljer att lägga vinnaren i min skapade comparecontainer än så länge 
    //Vinnaren kommer att presenteras med bild samt att textstorleken på pokemonnamnet kommer att vara större 
    comparementContainer.innerHTML += `<p>The winner is: <br> <span style="color:white; font-size: 20px;">${winner.name}</span></p><img src="${winner.image}" alt="${winner.name}">`;

}
// logiken för fight
function startFight(pokemon1, pokemon2) {

    let turnController = new FightTurns(pokemon1, pokemon2);

    // Sätter en interval på var 10e sekund
    let fightInterval = setInterval(() => {
        if (pokemon1.stats.hp > 0 && pokemon2.stats.hp > 0) {
            let attackingPokemon = turnController.whoIsAttacking();
            let defendingPokemon = turnController.whoIsDefending();

            let damage = attackingPokemon.getAttack() - defendingPokemon.getDefence() * 0.8;
            if (damage < 10) {
                damage = 10;
            }
            defendingPokemon.takeDamage(damage);

            // Uppdaterar meddelandet om kampen/fighten 
            // updateFightMessage(attackingPokemon, defendingPokemon, damage);
            const paragraph = document.createElement('p');
            const message = `${attackingPokemon.name} used ${attackingPokemon.primaryAttack} and did ${damage} in damage. \n${defendingPokemon.name + "s"} remaining HP is : ${defendingPokemon.stats.hp}.`;

            // Sätter texten i paragraph till message 
            paragraph.textContent = message;

            // Hämtar container för meddelande
            if (defendingPokemon.name == pokemon1.name) {
                const fightMessageRight = document.getElementById('fightMessageRight');
                fightMessageRight.appendChild(paragraph);
            }
            else {
                const fightMessageLeft = document.getElementById('fightMessageLeft');
                fightMessageLeft.appendChild(paragraph);
            }

            if (defendingPokemon.stats.hp === 0) {
                let fightMessageElement = document.getElementById("fightMessageMiddle");
                let paragraph1 = document.createElement('p');
                paragraph1.textContent = `${defendingPokemon.name} is defeated!`;
                fightMessageElement.appendChild(paragraph1);

                let paragraph2 = document.createElement('p');
                paragraph2.innerHTML = `<strong>${attackingPokemon.name} wins!<strong> <br> <img src="${attackingPokemon.image}" alt="${attackingPokemon.name}">`;
                fightMessageElement.appendChild(paragraph2);

                clearInterval(fightInterval); // Stoppar intervallet på 2 sek när striden är över
                return;
            } else {
                turnController.changeTurn();
            }
        }
    }, 2000);
}


new PokemonCreator().createPokemonList().then(pokemonList => {
    //Skapar upp en div container för drop down 1 
    let containerDropDown1 = document.createElement("div");
    //lägger till ett id 
    containerDropDown1.id = "containerDropDown1";

    //Skapar ett select-element för dropdown 1
    let selectList1 = document.createElement("select");
    //lägger till ett id 
    selectList1.id = "pokemon1";

    // Lägger till det första alternativet för drop down 1
    let defaultOption = document.createElement("option");
    defaultOption.textContent = " -- Select a Pokémon -- ";
    defaultOption.value = "";
    defaultOption.selected = true;
    defaultOption.disabled = true;
    selectList1.appendChild(defaultOption);

    // Lägger till drop down 1 i containerDropDown1
    containerDropDown1.appendChild(selectList1);

    // Skapar ett element för att visa den valda Pokemon 1
    let selectedPokemon1 = document.createElement('div');
    selectedPokemon1.id = 'selectedPokemon1';
    containerDropDown1.appendChild(selectedPokemon1);


    //Skapar en compartment för att sedan lägga knappen för att jämföra samt datan för jämförelsen 
    let comparementContainer = document.createElement('div');
    comparementContainer.id = 'comparementContainer';



    let comparementBtn = document.createElement("button");
    comparementBtn.id = "comparementBtn";
    comparementBtn.innerHTML = "Compare your Pokémons";
    comparementContainer.appendChild(comparementBtn)

    //Skapar en fight knapp  som läggs i comparementC.
    let fightBtn = document.createElement('button');
    fightBtn.id = "fightBtn";
    fightBtn.innerHTML = "Fight!";
    comparementContainer.appendChild(fightBtn)


    //Skapade en div dör att hålla stats jämförelsen , Jag vet inte om det är onödigt dock... 
    let comparementstats = document.createElement('div');
    comparementstats.id = 'comparementstats';
    comparementContainer.appendChild(comparementstats);


    // Skapar upp en div container för drop down 2
    let containerDropDown2 = document.createElement("div");
    containerDropDown2.id = "containerDropDown2";

    // Skapar ett select-element för drop down 2
    let selectList2 = document.createElement("select");
    selectList2.id = "pokemon2";

    // Lägger till det första alternativet för drop down 2
    let defaultOption2 = document.createElement("option");
    defaultOption2.textContent = " -- Select a Pokémon -- ";
    defaultOption2.value = "";
    defaultOption2.selected = true;
    defaultOption2.disabled = true;
    selectList2.appendChild(defaultOption2);

    // Lägger till drop down 2 i containerDropDown2
    containerDropDown2.appendChild(selectList2);

    // Skapar ett element för att visa den valda Pokemon 2 för drop down 2
    let selectedPokemon2 = document.createElement('div');
    selectedPokemon2.id = 'selectedPokemon2';
    containerDropDown2.appendChild(selectedPokemon2);

    // Loopar genom pokemons och lägger till dem som alternativ i båda dropdowns
    for (let pokemon of pokemonList.pokemons) {
        let option = document.createElement("option");
        option.value = pokemon.name;
        option.textContent = pokemon.name;
        selectList1.appendChild(option);

        let option2 = document.createElement("option");
        option2.value = pokemon.name;
        option2.textContent = pokemon.name;
        selectList2.appendChild(option2);
    }

    // Hämtar wrapperDiv från DOM
    let containerWrapper = document.getElementById("containerWrapper");

    // Lägger till containerdropdown1 som är barn till wrapperDiv
    containerWrapper.appendChild(containerDropDown1);

    // Lägger till comparementContainer som också är barn till wrapperDiv
    containerWrapper.appendChild(comparementContainer);

    // Lägger till containerdropdown2 som också är barn till wrapperDiv
    containerWrapper.appendChild(containerDropDown2);


    //Här kommer data om hur fighten går . Jag skapade 3 st divar. Resultat för pokemon 1 och två kommer att hamna här. Sedan skapas en div som heter fightmesage där en h1 läggs till samt vinnaren att presenteras 
    let fightWrapper = document.getElementById('fightWrapper');

    let fightMessageLeft = document.createElement('div');
    fightMessageLeft.id = 'fightMessageLeft';
    // fightMessageLeft.innerHTML = 'Left';
    fightWrapper.appendChild(fightMessageLeft);

    let fightMessageMiddle = document.createElement('div');
    fightMessageMiddle.id = 'fightMessageMiddle';
    // fightMessageMiddle.innerHTML = 'middle';
    fightWrapper.appendChild(fightMessageMiddle);

    let fightMessageRight = document.createElement('div');
    fightMessageRight.id = 'fightMessageRight';
    // fightMessageRight.innerHTML = 'right';
    fightWrapper.appendChild(fightMessageRight);

    // Skapar upp selectedPok.1 och 2
    const selectedPokemon1Element = document.getElementById('selectedPokemon1');
    const selectedPokemon2Element = document.getElementById('selectedPokemon2');



    // Deklarerar Events

    // Skapar eventlistnerer  för när användaren gör val i drop down 1, change används då det är en drop down lista/rullgardin
    selectList1.addEventListener('change', () => {
        const selectedPokemonName1 = selectList1.value;
        const selectedPokemon1 = pokemonList.getPokemonFromList(selectedPokemonName1);
        if (selectedPokemon1) {
            displaySelectedPokemon(selectedPokemon1, selectedPokemon1Element);
        }
    });

    // Skapar eventlist.  för när användaren gör val i drop down 2
    selectList2.addEventListener("change", () => {
        const selectedPokemonName2 = selectList2.value;
        const selectedPokemon2 = pokemonList.getPokemonFromList(selectedPokemonName2);
        if (selectedPokemon2) {
            displaySelectedPokemon(selectedPokemon2, selectedPokemon2Element);
        }
    })

    // eventlist. för knappen comparementBtn 
    comparementBtn.addEventListener("click", () => {




        const selectedPokemonName1 = selectList1.value; // selectedPokemonName1 kommer att få värdet av användarens val 
        const selectedPokemonName2 = selectList2.value;

        //Förhindrar att man kan gå  vidare utan att göra ett val 
        if (!selectedPokemonName1 || !selectedPokemonName2) {
            let errorMessage = 'Please select an option from both dropdown lists before you can compare ';
            alert(errorMessage);
            return;
        }

        //Förhindrar att man kan gå  vidare om man väljes samma pokemon name. Medveten att det skulle vara bättre att gå på ID 
        if (selectedPokemonName1 === selectedPokemonName2) {
            let errorMessage = 'Please select two different Pokémon to compare.';
            alert(errorMessage);
            return;
        }

        const selectedPokemon1 = pokemonList.getPokemonFromList(selectedPokemonName1);
        const selectedPokemon2 = pokemonList.getPokemonFromList(selectedPokemonName2);

        //Om två olika Pokemons har valts, hämtas dessa Pokémon från listan  
        if (selectedPokemon1 && selectedPokemon2) {
            comparePokemon(selectedPokemon1, selectedPokemon2);

        }
        // Scrollar  till comparementstats
        document.getElementById('comparementstats').scrollIntoView({ behavior: 'smooth' })

    });


    //Eventlyssnare för fightBtn
    document.getElementById("fightBtn").addEventListener("click", () => {

        const selectedPokemon1Name = document.getElementById("pokemon1").value;
        const selectedPokemon2Name = document.getElementById("pokemon2").value;

        if (!selectedPokemon1Name || !selectedPokemon2Name) {
            alert("Please select both Pokémon before starting the battle.");
            return;
        }

        if (selectedPokemon1Name === selectedPokemon2Name) {
            let errorMessage = 'Please select two different Pokémon to fight.';
            alert(errorMessage);
            return;
        }
        //Raderar all Html 
        document.getElementById('fightMessageLeft').innerHTML = '';
        document.getElementById('fightMessageMiddle').innerHTML = '';
        document.getElementById('fightMessageRight').innerHTML = '';

        const selectedPokemon1 = pokemonList.getPokemonFromList(selectedPokemon1Name);
        const selectedPokemon2 = pokemonList.getPokemonFromList(selectedPokemon2Name);

        //lägger till en h1 i fightmessage 
        const fightH1Middle = document.createElement('h1');
        fightH1Middle.id = "fightH1Middle";
        fightH1Middle.textContent = 'Pokemon Fight!';
        document.getElementById('fightMessageMiddle').appendChild(fightH1Middle);

        const fightH1Left = document.createElement('h1');
        fightH1Left.id = 'fightH1Left';
        fightH1Left.textContent = 'Challenger #1';
        document.getElementById('fightMessageLeft').appendChild(fightH1Left);


        const fightH1Right = document.createElement('h1');
        fightH1Right.id = 'fightH1Right';
        fightH1Right.textContent = 'Challenger #2';
        document.getElementById('fightMessageRight').appendChild(fightH1Right);

        startFight(selectedPokemon1, selectedPokemon2);

        // Resettar HP på Pokemons för att man ska kunna köra fighterna flera gånger  metoden ligger i pokemonklassen  
        selectedPokemon1.resetHP();
        selectedPokemon2.resetHP();

        // Scrollar  till fightWrapper
        document.getElementById('fightWrapper').scrollIntoView({ behavior: 'smooth' })

    });

});