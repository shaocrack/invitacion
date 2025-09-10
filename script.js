document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const gameScreen = document.getElementById('game-screen');
    const startBtn = document.getElementById('start-btn');
    const wordBank = document.getElementById('word-bank');
    const sentenceContainer = document.getElementById('sentence-container');
    const result = document.getElementById('result');
    const resultText = document.getElementById('result-text');
    const question = document.getElementById('question');
    const response = document.getElementById('response');
    const responseText = document.getElementById('response-text');
    const responseImage = document.getElementById('response-image');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');

    // The phrase to guess (shuffled)
    const phrase = "QUIERES IR AL CONCIERTO CONMIGO";
    let words = phrase.split(' ');
    let selectedWords = [];
    let shuffledWords = [...words].sort(() => Math.random() - 0.5);

    // Start the game
    startBtn.addEventListener('click', () => {
        welcomeScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        setupWordBank();
    });

    // Set up the word bank with clickable words
    function setupWordBank() {
        wordBank.innerHTML = '';
        shuffledWords.forEach((word, index) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word';
            wordElement.textContent = word;
            wordElement.dataset.index = index;
            wordElement.addEventListener('click', () => selectWord(wordElement));
            wordBank.appendChild(wordElement);
        });
    }

    // Handle word selection
    function selectWord(wordElement) {
        const index = wordElement.dataset.index;
        if (wordElement.classList.contains('selected')) {
            // Remove from sentence
            wordElement.classList.remove('selected');
            const word = wordElement.textContent;
            selectedWords = selectedWords.filter(w => w !== word);
            updateSentence();
        } else {
            // Add to sentence
            wordElement.classList.add('selected');
            selectedWords.push(wordElement.textContent);
            updateSentence();
        }
    }

    // Update the sentence being built
    function updateSentence() {
        sentenceContainer.innerHTML = '';
        selectedWords.forEach(word => {
            const wordElement = document.createElement('span');
            wordElement.className = 'word';
            wordElement.textContent = word;
            wordElement.addEventListener('click', () => {
                // Remove from selected words
                selectedWords = selectedWords.filter(w => w !== word);
                updateSentence();
                // Update word bank
                document.querySelectorAll('.word').forEach(el => {
                    if (el.textContent === word && el.classList.contains('selected')) {
                        el.classList.remove('selected');
                    }
                });
            });
            sentenceContainer.appendChild(wordElement);
        });

        // Check if the sentence is complete and correct
        if (selectedWords.length === words.length) {
            const userPhrase = selectedWords.join(' ');
            if (userPhrase === phrase) {
                showQuestion();
            } else {
                // Shake animation for wrong answer
                sentenceContainer.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    sentenceContainer.style.animation = '';
                }, 500);
            }
        }
    }

    // Show the question after completing the phrase
    function showQuestion() {
        result.classList.remove('hidden');
        resultText.textContent = '¡Felicidades! Has completado la frase correctamente.';
        question.classList.remove('hidden');
    }

    // Handle yes button click
    yesBtn.addEventListener('click', () => {
        question.classList.add('hidden');
        responseText.textContent = '¡Sabía que dirías que sí! ¡Soy tu mejor elección! 😊';
        responseImage.src = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjVtYnNnZ2x1b3Rmd2h1bWJtY3J3Z2Q4aGZ3dW5rY2Z5dW1yMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKsQfIgdXh3xEC4/giphy.gif';
        response.classList.remove('hidden');
    });

    // Handle no button click
    noBtn.addEventListener('click', () => {
        question.classList.add('hidden');
        responseText.innerHTML = '¿Estás segura? 😏<br>Pero no me importa que digas que no, igual es un sí.';
        responseImage.src = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjVtYnNnZ2x1b3Rmd2h1bWJtY3J3Z2Q4aGZ3dW5rY2Z5dW1yMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKsQfIgdXh3xEC4/giphy.gif';
        response.classList.remove('hidden');
        
        // Make the no button move away when hovered
        noBtn.style.position = 'absolute';
        noBtn.style.transition = 'all 0.3s ease';
        
        noBtn.addEventListener('mouseover', () => {
            const x = Math.random() * (window.innerWidth - noBtn.offsetWidth * 2) + noBtn.offsetWidth;
            const y = Math.random() * (window.innerHeight - noBtn.offsetHeight * 2) + noBtn.offsetHeight;
            noBtn.style.left = `${x}px`;
            noBtn.style.top = `${y}px`;
        });
    });
});
