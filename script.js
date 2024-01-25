//DOM Elements
const resultEle = document.getElementById('result');
const pokemonImageElement = document.getElementById('pokemonImage');
const optionsContainer = document.getElementById('options');
const pointsEle = document.getElementById('pointsValue');
const totalCount = document.getElementById('totalCount');
const mContainer = document.getElementsByClassName('container');
const loadingContainer = document.getElementById('loadingContainer');

//fetch a pokemon

async function fetchPokemonById(id) {
    showLoading = true;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();
    // console.log(data);
    return data;
}

//initialize var
let prePokeIds = [];
let count = 0;
let points = 0;
showLoading = false;

async function loadQuestionAndAnswer() {
    if (showLoading) {
        showLoadingWindow();
        hidePuzzlewindow();
    }

    let pokeID = getRandomId();
    //if pokeid already exists
    while (prePokeIds.includes(pokeID)) {
        pokeID = getRandomId();
    }
    prePokeIds.push(pokeID);

    const pokemon = await fetchPokemonById(pokeID);
    //set your poke value
    const options = [pokemon.name];
    const optionsIds = [pokeID];

    //fetch other pokemon option
    while (options.length < 4) {
        let randomID = getRandomId();
        while (optionsIds.includes(randomID)) {
            randomID = getRandomId();
        }
        optionsIds.push(randomID);

        const randomPokemon = await fetchPokemonById(randomID);
        const randomOption = randomPokemon.name;
        options.push(randomOption);

        //all the options are fetch
        if (options.length === 4) {
            showLoading = false;
        }
    }

    shuffle(options);
    resultEle.textContent = "Who's that Pokemon?";
    pokemonImageElement.src = pokemon.sprites.other.dream_world.front_default;

    optionsContainer.innerHTML = "";
    options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = (event) => checkAnswer(option === pokemon.name, event);
        optionsContainer.appendChild(button);
    });

    if (!showLoading) {
        hideLoadingWindow();
        showPuzzleWindow();
    }
}

function checkAnswer(isCorrect, event) {
    const selectedButton = document.querySelector(".selected");
    if (selectedButton) {
        return;
    }
    event.target.classList.add("selected");
    count++;
    totalCount.textContent = count;

    if (isCorrect) {
        displayResult("Right Answer");
        points++;
        pointsEle.textContent = points;
        event.target.classList.add("correct");
    }
    else {
        displayResult("Wrong Answer")
        pointsEle.textContent = points;
        event.target.classList.add("wrong");
    }

    setTimeout(() => {
        showLoading = true;
        loadQuestionAndAnswer();
    }, 1000);
}

loadQuestionAndAnswer();

//utility function
//randomize poke id
function getRandomId(id = 151) {
    return Math.floor(Math.random() * id) + 1;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
    return arr;
}

function displayResult(result) {
    resultEle.textContent = result;
}

function hidePuzzlewindow() {
    mContainer.classList.add("hide");
}

function showPuzzleWindow() {
    loadingContainer.classList.remove("show");
    mContainer.classList.remove("hide");
    mContainer.classList.add("show");
}

function showLoadingWindow() {
    console.log(first)
    mContainer.classList.remove("show");
    loadingContainer.classList.remove("hide");
    loadingContainer.classList.add("show");
}

function hideLoadingWindow() {
    loadingContainer.classList.add("hide");
}
