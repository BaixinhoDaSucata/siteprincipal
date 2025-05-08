/**
 * Baixinho da Sucata - Jogos Educativos sobre Sustentabilidade
 * Desenvolvido para Alair Rodrigues de Oliveira
 * DOM AQUINO - MT
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Inicializa todos os jogos
    initQuizGame();
    initDragDropGame();
    initMemoryGame();
});

/**
 * Inicializa o jogo de Quiz
 */
function initQuizGame() {
    // Elementos do DOM
    const questionElement = document.getElementById('quiz-question');
    const optionsElement = document.getElementById('quiz-options');
    const feedbackElement = document.getElementById('quiz-feedback');
    const resultElement = document.getElementById('quiz-result');
    const restartButton = document.getElementById('quiz-restart');
    
    // Perguntas do quiz
    const questions = [
        {
            question: "Qual cor de lixeira é usada para descarte de papel?",
            options: ["Vermelha", "Azul", "Verde", "Amarela"],
            answer: 1, // Índice da resposta correta (Azul)
            feedback: "Correto! A lixeira azul é destinada ao descarte de papéis e papelão."
        },
        {
            question: "Qual destes materiais NÃO é reciclável?",
            options: ["Garrafa PET", "Papel alumínio sujo de comida", "Lata de refrigerante", "Caixa de papelão"],
            answer: 1, // Papel alumínio sujo
            feedback: "Correto! Materiais contaminados com restos de comida normalmente não são recicláveis."
        },
        {
            question: "Quanto tempo aproximadamente leva para uma garrafa plástica se decompor na natureza?",
            options: ["10 anos", "50 anos", "100 anos", "Mais de 400 anos"],
            answer: 3, // Mais de 400 anos
            feedback: "Correto! Uma garrafa plástica pode levar mais de 400 anos para se decompor completamente na natureza."
        },
        {
            question: "Qual a importância da coleta seletiva?",
            options: [
                "Diminui a quantidade de lixo nos aterros sanitários", 
                "Gera emprego e renda para catadores", 
                "Diminui a extração de matéria-prima da natureza", 
                "Todas as alternativas anteriores"
            ],
            answer: 3, // Todas as alternativas
            feedback: "Correto! A coleta seletiva traz todos esses benefícios: diminui o lixo em aterros, gera renda e reduz a extração de recursos naturais."
        },
        {
            question: "Qual é a forma correta de descartar pilhas e baterias?",
            options: [
                "No lixo comum", 
                "Em pontos de coleta específicos", 
                "Enterrando no solo", 
                "Queimando"
            ],
            answer: 1, // Pontos de coleta específicos
            feedback: "Correto! Pilhas e baterias contêm metais pesados e devem ser descartadas em pontos de coleta específicos."
        }
    ];
    
    let currentQuestion = 0;
    let score = 0;
    let answered = false;
    
    // Mostra a pergunta atual
    function showQuestion() {
        if (currentQuestion < questions.length) {
            const question = questions[currentQuestion];
            questionElement.textContent = question.question;
            
            // Limpa as opções anteriores
            optionsElement.innerHTML = '';
            feedbackElement.style.display = 'none';
            
            // Cria as opções de resposta
            question.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'quiz-option';
                optionDiv.textContent = option;
                optionDiv.addEventListener('click', () => {
                    if (!answered) {
                        answered = true;
                        checkAnswer(index);
                    }
                });
                optionsElement.appendChild(optionDiv);
            });
        } else {
            // Quiz terminado, mostra o resultado
            showResult();
        }
    }
    
    // Verifica se a resposta está correta
    function checkAnswer(selectedIndex) {
        const correctIndex = questions[currentQuestion].answer;
        const options = document.querySelectorAll('.quiz-option');
        
        // Marca a opção correta e incorreta
        options.forEach((option, index) => {
            if (index === correctIndex) {
                option.classList.add('correct');
            } else if (index === selectedIndex && selectedIndex !== correctIndex) {
                option.classList.add('incorrect');
            }
        });
        
        // Atualiza pontuação e mostra feedback
        if (selectedIndex === correctIndex) {
            score++;
            feedbackElement.textContent = questions[currentQuestion].feedback;
            feedbackElement.style.backgroundColor = 'rgba(46, 125, 50, 0.1)';
        } else {
            feedbackElement.textContent = `Incorreto. A resposta correta é: ${questions[currentQuestion].options[correctIndex]}`;
            feedbackElement.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        }
        
        feedbackElement.style.display = 'block';
        
        // Aguarda 2 segundos e passa para a próxima pergunta
        setTimeout(() => {
            currentQuestion++;
            answered = false;
            showQuestion();
        }, 2000);
    }
    
    // Mostra o resultado final
    function showResult() {
        questionElement.style.display = 'none';
        optionsElement.style.display = 'none';
        feedbackElement.style.display = 'none';
        
        resultElement.style.display = 'block';
        resultElement.innerHTML = `
            <h3>Resultado</h3>
            <p>Você acertou ${score} de ${questions.length} perguntas!</p>
            <p>${getResultMessage(score, questions.length)}</p>
        `;
        
        restartButton.style.display = 'block';
    }
    
    // Retorna uma mensagem personalizada com base na pontuação
    function getResultMessage(score, total) {
        const percentage = (score / total) * 100;
        
        if (percentage >= 80) {
            return "Parabéns! Você é um expert em reciclagem!";
        } else if (percentage >= 60) {
            return "Bom trabalho! Você sabe bastante sobre reciclagem.";
        } else if (percentage >= 40) {
            return "Não foi mal, mas você pode aprender mais sobre reciclagem!";
        } else {
            return "Continue aprendendo sobre reciclagem. É importante para o planeta!";
        }
    }
    
    // Reinicia o jogo
    function restartQuiz() {
        currentQuestion = 0;
        score = 0;
        answered = false;
        
        questionElement.style.display = 'block';
        optionsElement.style.display = 'flex';
        resultElement.style.display = 'none';
        restartButton.style.display = 'none';
        
        showQuestion();
    }
    
    // Event listener para o botão de reiniciar
    restartButton.addEventListener('click', restartQuiz);
    
    // Inicia o jogo
    showQuestion();
}

/**
 * Inicializa o jogo de Arrastar e Soltar (Coleta Seletiva)
 */
function initDragDropGame() {
    // Elementos do DOM
    const dragItemsContainer = document.getElementById('drag-items');
    const dropContainersDiv = document.getElementById('drop-containers');
    const restartButton = document.getElementById('drag-drop-restart');
    
    // Categorias das lixeiras
    const bins = [
        {
            name: "Papel",
            color: "#0000FF", // Azul
            icon: "fas fa-newspaper"
        },
        {
            name: "Plástico",
            color: "#FF0000", // Vermelho
            icon: "fas fa-wine-bottle"
        },
        {
            name: "Vidro",
            color: "#008000", // Verde
            icon: "fas fa-wine-glass-alt"
        },
        {
            name: "Metal",
            color: "#FFFF00", // Amarelo
            icon: "fas fa-utensils"
        }
    ];
    
    // Itens para separar
    const items = [
        { name: "Jornal", type: 0, icon: "fas fa-newspaper" },
        { name: "Caderno", type: 0, icon: "fas fa-book" },
        { name: "Caixa de Papelão", type: 0, icon: "fas fa-box" },
        { name: "Garrafa PET", type: 1, icon: "fas fa-wine-bottle" },
        { name: "Sacola Plástica", type: 1, icon: "fas fa-shopping-bag" },
        { name: "Pote de Margarina", type: 1, icon: "fas fa-box" },
        { name: "Garrafa de Vidro", type: 2, icon: "fas fa-wine-bottle" },
        { name: "Pote de Conserva", type: 2, icon: "fas fa-jar" },
        { name: "Copo de Vidro", type: 2, icon: "fas fa-wine-glass-alt" },
        { name: "Lata de Refrigerante", type: 3, icon: "fas fa-beer" },
        { name: "Lata de Conserva", type: 3, icon: "fas fa-box" },
        { name: "Papel Alumínio", type: 3, icon: "fas fa-square" }
    ];
    
    let draggedItem = null;
    let correctPlacements = 0;
    const totalItems = items.length;
    let shuffledItems = [];
    
    // Função para embaralhar os itens
    function shuffleItems() {
        shuffledItems = [...items].sort(() => Math.random() - 0.5);
    }
    
    // Cria as lixeiras (drop containers)
    function createDropContainers() {
        dropContainersDiv.innerHTML = '';
        
        bins.forEach((bin, index) => {
            const container = document.createElement('div');
            container.className = 'drop-container';
            container.dataset.binType = index;
            
            const heading = document.createElement('h5');
            heading.textContent = bin.name;
            
            const icon = document.createElement('i');
            icon.className = bin.icon;
            icon.style.color = bin.color;
            icon.style.fontSize = '1.5rem';
            icon.style.marginBottom = '10px';
            
            const dropItems = document.createElement('div');
            dropItems.className = 'drop-items';
            
            container.appendChild(heading);
            container.appendChild(icon);
            container.appendChild(dropItems);
            
            // Event listeners para drag and drop
            container.addEventListener('dragover', dragOver);
            container.addEventListener('dragenter', dragEnter);
            container.addEventListener('dragleave', dragLeave);
            container.addEventListener('drop', dragDrop);
            
            dropContainersDiv.appendChild(container);
        });
    }
    
    // Cria os itens para arrastar
    function createDragItems() {
        dragItemsContainer.innerHTML = '';
        
        shuffledItems.forEach((item, index) => {
            const dragItem = document.createElement('div');
            dragItem.className = 'drag-item';
            dragItem.draggable = true;
            dragItem.dataset.itemType = item.type;
            dragItem.dataset.itemId = index;
            
            const icon = document.createElement('i');
            icon.className = item.icon;
            icon.style.marginRight = '8px';
            
            dragItem.appendChild(icon);
            dragItem.appendChild(document.createTextNode(item.name));
            
            // Event listeners para drag and drop
            dragItem.addEventListener('dragstart', dragStart);
            dragItem.addEventListener('dragend', dragEnd);
            
            dragItemsContainer.appendChild(dragItem);
        });
    }
    
    // Funções para gerenciar o drag and drop
    function dragStart() {
        draggedItem = this;
        setTimeout(() => this.style.display = 'none', 0);
    }
    
    function dragEnd() {
        setTimeout(() => {
            this.style.display = 'block';
            draggedItem = null;
        }, 0);
    }
    
    function dragOver(e) {
        e.preventDefault();
    }
    
    function dragEnter(e) {
        e.preventDefault();
        this.classList.add('over');
    }
    
    function dragLeave() {
        this.classList.remove('over');
    }
    
    function dragDrop() {
        this.classList.remove('over');
        const binType = parseInt(this.dataset.binType);
        const itemType = parseInt(draggedItem.dataset.itemType);
        const dropItems = this.querySelector('.drop-items');
        
        // Verifica se o item foi colocado na lixeira correta
        if (binType === itemType) {
            // Cria uma cópia do item no destino
            const itemCopy = draggedItem.cloneNode(true);
            itemCopy.classList.add('success');
            itemCopy.style.backgroundColor = 'rgba(46, 125, 50, 0.1)';
            itemCopy.style.borderColor = '#2e7d32';
            itemCopy.style.cursor = 'default';
            itemCopy.draggable = false;
            
            dropItems.appendChild(itemCopy);
            
            // Remove o item original
            draggedItem.remove();
            
            // Incrementa a contagem de acertos
            correctPlacements++;
            
            // Verifica se o jogo terminou
            checkGameCompletion();
        } else {
            // Feedback visual de erro
            draggedItem.classList.add('incorrect');
            setTimeout(() => {
                draggedItem.classList.remove('incorrect');
            }, 1000);
        }
    }
    
    // Verifica se todos os itens foram colocados corretamente
    function checkGameCompletion() {
        if (correctPlacements === totalItems) {
            alert('Parabéns! Você classificou corretamente todos os materiais recicláveis!');
        } else if (document.querySelectorAll('.drag-item').length === 0) {
            // Todos os itens foram colocados, mas nem todos corretamente
            if (correctPlacements < totalItems) {
                alert(`Jogo finalizado! Você acertou ${correctPlacements} de ${totalItems} itens. Tente novamente!`);
            }
        }
    }
    
    // Reinicia o jogo
    function restartGame() {
        correctPlacements = 0;
        shuffleItems();
        createDropContainers();
        createDragItems();
    }
    
    // Event listener para o botão de reiniciar
    restartButton.addEventListener('click', restartGame);
    
    // Inicializa o jogo
    shuffleItems();
    createDropContainers();
    createDragItems();
}

/**
 * Inicializa o jogo da memória
 */
function initMemoryGame() {
    // Elementos do DOM
    const gameContainer = document.getElementById('memory-game');
    const resultElement = document.getElementById('memory-result');
    const restartButton = document.getElementById('memory-restart');
    
    // Símbolos para o jogo da memória (ícones relacionados a reciclagem)
    const symbols = [
        { icon: "♻️", name: "Símbolo da Reciclagem" },
        { icon: "🌱", name: "Sustentabilidade" },
        { icon: "🌍", name: "Planeta Terra" },
        { icon: "🌊", name: "Água Limpa" },
        { icon: "🌳", name: "Árvore" },
        { icon: "💧", name: "Gota d'água" }
    ];
    
    // Variáveis do jogo
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let matchedPairs = 0;
    let gameStartTime;
    
    // Cria as cartas para o jogo
    function createCards() {
        gameContainer.innerHTML = '';
        resultElement.style.display = 'none';
        
        // Cria um array com pares de símbolos
        const cardPairs = [...symbols, ...symbols];
        // Embaralha as cartas
        cards = cardPairs.sort(() => Math.random() - 0.5);
        
        // Cria os elementos no DOM
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            cardElement.dataset.card = card.name;
            cardElement.dataset.index = index;
            
            const front = document.createElement('div');
            front.className = 'front';
            front.textContent = card.icon;
            
            const back = document.createElement('div');
            back.className = 'back';
            
            cardElement.appendChild(front);
            cardElement.appendChild(back);
            
            // Adiciona o event listener
            cardElement.addEventListener('click', flipCard);
            
            gameContainer.appendChild(cardElement);
        });
        
        // Reinicia variáveis do jogo
        moves = 0;
        matchedPairs = 0;
        gameStartTime = null;
    }
    
    // Função para virar a carta
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        
        // Registra o tempo de início do jogo
        if (!gameStartTime && moves === 0) {
            gameStartTime = new Date();
        }
        
        this.classList.add('flipped');
        
        if (!hasFlippedCard) {
            // Primeira carta virada
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Segunda carta virada
        secondCard = this;
        moves++;
        
        checkForMatch();
    }
    
    // Verifica se as cartas viradas são iguais
    function checkForMatch() {
        const isMatch = firstCard.dataset.card === secondCard.dataset.card;
        
        if (isMatch) {
            disableCards();
            matchedPairs++;
            
            // Verifica se o jogo terminou
            if (matchedPairs === symbols.length) {
                endGame();
            }
        } else {
            unflipCards();
        }
    }
    
    // Desabilita as cartas que já foram combinadas
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        resetBoard();
    }
    
    // Desvira as cartas que não combinam
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            
            resetBoard();
        }, 1500);
    }
    
    // Reinicia as variáveis do jogo
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    // Finaliza o jogo e mostra o resultado
    function endGame() {
        const gameEndTime = new Date();
        const gameTimeInSeconds = Math.floor((gameEndTime - gameStartTime) / 1000);
        const minutes = Math.floor(gameTimeInSeconds / 60);
        const seconds = gameTimeInSeconds % 60;
        
        setTimeout(() => {
            resultElement.style.display = 'block';
            resultElement.innerHTML = `
                <h3>Parabéns!</h3>
                <p>Você completou o jogo em ${moves} movimentos.</p>
                <p>Tempo: ${minutes}min ${seconds}s</p>
                <p>${getRatingMessage(moves, symbols.length)}</p>
            `;
        }, 1000);
    }
    
    // Retorna uma mensagem baseada no desempenho
    function getRatingMessage(moves, pairs) {
        // Ideal: 2 movimentos por par (movimentos perfeitos)
        const perfectMoves = pairs * 2;
        const ratio = moves / perfectMoves;
        
        if (ratio <= 1.3) {
            return "Memória excelente! Você é um mestre da reciclagem!";
        } else if (ratio <= 1.6) {
            return "Ótimo desempenho! Você sabe muito sobre reciclagem!";
        } else if (ratio <= 2) {
            return "Bom trabalho! Continue aprendendo sobre reciclagem!";
        } else {
            return "Continue praticando! A reciclagem é importante para o planeta!";
        }
    }
    
    // Event listener para o botão de reiniciar
    restartButton.addEventListener('click', createCards);
    
    // Inicia o jogo
    createCards();
}