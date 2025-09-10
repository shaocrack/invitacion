document.addEventListener('DOMContentLoaded', function() {
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
    // Removed happy buttons references
    
    // Only one photo
    const photos = ['entrada.jpg'];
    let currentPhotoIndex = 0;
    
    // Create conditions element
    const conditionsElement = document.createElement('div');
    conditionsElement.id = 'conditions';
    conditionsElement.className = 'hidden';
    conditionsElement.innerHTML = `
        <h3>¡Excelente! Pero antes, hay condiciones para ese día:</h3>
        <ul class="conditions-list">
            <li>1. Lavarse la carita</li>
            <li>2. Ponerse bella</li>
            <li>3. Sonreír</li>
            <li>4. Cantar a todo pulmón las canciones</li>
            <li>5. Verme llorar en una canción :C jeje</li>
            <li>6. Dedicarme una canción de los Kjarkas o William Luna ese día y cantarla conmigo xD</li>
            <li>7. Y por supuesto, pasarla bien</li>
        </ul>
        <p>¿Aceptas estas condiciones?</p>
        <div class="buttons">
            <button id="accept-conditions">¡Sí, acepto!</button>
            <button id="must-accept">¡Tengo que aceptar!</button>
        </div>
    `;
    
    // Create name input element
    const nameInputElement = document.createElement('div');
    nameInputElement.id = 'name-input';
    nameInputElement.className = 'hidden';
    nameInputElement.innerHTML = `
        <h3>¡Perfecto! Un último detalle:</h3>
        <p>Por favor, escribe tu nombre para confirmar:</p>
        <input type="text" id="user-name" placeholder="Tu nombre" required>
        <button id="submit-name">Enviar</button>
    `;
    
    // Create final message element
    const finalMessageElement = document.createElement('div');
    finalMessageElement.id = 'final-message';
    finalMessageElement.className = 'hidden';
    
    // Add elements to the DOM
    document.querySelector('.container').appendChild(conditionsElement);
    document.querySelector('.container').appendChild(nameInputElement);
    document.querySelector('.container').appendChild(finalMessageElement);

    // The phrase to guess (shuffled)
    const phrase = "QUIERES IR AL CONCIERTO CONMIGO?";
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
        // Show first photo and conditions
        if (photos.length > 0) {
            responseImage.src = photos[0];
            responseImage.alt = '¡Vamos al concierto!';
        }
        response.classList.remove('hidden');
        
        // Show conditions after a short delay
        setTimeout(() => {
            response.classList.add('hidden');
            conditionsElement.classList.remove('hidden');
        }, 2000);
    });
    
    // Add event listeners after elements are in the DOM
    setTimeout(() => {
        // Handle accept conditions
        const acceptBtn = document.getElementById('accept-conditions');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', function() {
                conditionsElement.classList.add('hidden');
                
                // Show the photo with final message
                responseText.innerHTML = '¡Perfecto! Aceptaste todas las condiciones. ¡Nos vemos en el concierto! 😊';
                if (photos.length > 0) {
                    responseImage.src = photos[0];
                }
                response.classList.remove('hidden');
                
                // Add signature after a short delay
                setTimeout(() => {
                    const signature = document.createElement('div');
                    signature.className = 'signature';
                    signature.innerHTML = `
                        <p>Con cariño,</p>
                        <p>Shaopro ❤️</p>
                    `;
                    response.appendChild(signature);
                    
                    // Add restart button
                    const restartBtn = document.createElement('button');
                    restartBtn.id = 'restart-btn';
                    restartBtn.textContent = 'Volver al inicio';
                    restartBtn.style.marginTop = '20px';
                    restartBtn.addEventListener('click', () => {
                        location.reload();
                    });
                    response.appendChild(restartBtn);
                }, 1000);
            });

            // Handle must accept button
            const mustAcceptBtn = document.getElementById('must-accept');
            if (mustAcceptBtn) {
                mustAcceptBtn.addEventListener('click', function() {
                    this.textContent = '¡Tengo que aceptar!';
                    this.style.transform = 'scale(1.1)';
                    this.style.background = '#ff6b6b';
                    
                    // Make button move away
                    this.style.position = 'absolute';
                    const moveButton = () => {
                        const x = Math.random() * (window.innerWidth - this.offsetWidth * 2) + this.offsetWidth;
                        const y = Math.random() * (window.innerHeight - this.offsetHeight * 2) + this.offsetHeight;
                        this.style.left = `${x}px`;
                        this.style.top = `${y}px`;
                    };
                    
                    this.addEventListener('mouseover', moveButton);
                    
                    // Force accept after 3 clicks
                    let clickCount = 0;
                    const clickHandler = () => {
                        clickCount++;
                        if (clickCount >= 3) {
                            document.getElementById('accept-conditions').click();
                            this.removeEventListener('click', clickHandler);
                        } else {
                            moveButton();
                            this.textContent = `¡Tienes que aceptar! (${3 - clickCount} intentos restantes)`;
                        }
                    };
                    
                    this.addEventListener('click', clickHandler);
                });
            }
        }
    }, 100);

    // Handle no button click
    noBtn.addEventListener('click', () => {
        question.classList.add('hidden');
        responseText.innerHTML = '¿Estás segura? 😏<br>Pero no me importa que digas que no, igual es un sí.';
        
        // Show first photo
        if (photos.length > 0) {
            responseImage.src = photos[0];
            responseImage.alt = '¡Vamos al concierto!';
        }
        
        response.classList.remove('hidden');
        
        // Show conditions after a short delay
        setTimeout(() => {
            response.classList.add('hidden');
            conditionsElement.classList.remove('hidden');
        }, 2000);
        
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
    
    // Initialize the word bank when the page loads
    setupWordBank();
});
