/**
 * Baixinho da Sucata - Chatbot Inteligente
 * Desenvolvido para Alair Rodrigues de Oliveira
 * DOM AQUINO - MT
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Verifica se o chatbot já foi inicializado
    if (window.chatbotInitialized) return;
    window.chatbotInitialized = true;
    
    // Elementos do chatbot
    let chatbotButton, closeButton, chatWindow, messagesContainer, inputField, sendButton, typingIndicator;
    
    // Base de conhecimento do chatbot
    const knowledgeBase = {
        'ola': 'Olá! Bem-vindo ao Baixinho da Sucata. Como posso ajudá-lo hoje?',
        'oi': 'Olá! Bem-vindo ao Baixinho da Sucata. Como posso ajudá-lo hoje?',
        'bom dia': 'Bom dia! Como posso ajudá-lo hoje?',
        'boa tarde': 'Boa tarde! Como posso ajudá-lo hoje?',
        'boa noite': 'Boa noite! Como posso ajudá-lo hoje?',
        'quem é você': 'Sou o assistente virtual do Baixinho da Sucata, estou aqui para responder suas dúvidas sobre materiais recicláveis, serviços, preços e outras informações.',
        'como funciona': 'O Baixinho da Sucata compra diversos tipos de materiais recicláveis. Você pode trazer seu material até nosso endereço ou solicitar uma coleta em domicílio. Pagamos à vista pelos materiais.',
        'materiais': 'Compramos diversos materiais como ferro, alumínio, cobre, bronze, inox, baterias, papel, papelão, plástico e outros materiais recicláveis. Consulte nossa página de materiais para ver a lista completa e preços.',
        'preços': 'Os preços variam de acordo com o tipo e qualidade do material. Você pode consultar valores aproximados em nossa calculadora de preços ou entrar em contato diretamente conosco.',
        'coleta': 'Sim, oferecemos serviço de coleta em domicílio para quantidades significativas de material. Entre em contato pelo WhatsApp (66) 99928-1855 para agendar.',
        'endereço': 'Estamos localizados na Rua Agenor de Campos, 10, Loteamento Agua Azul, Dom Aquino, Mato Grosso. Você pode nos encontrar facilmente no mapa disponível em nosso site.',
        'horário': 'Nosso horário de funcionamento é de Segunda a Sábado, das 7h às 18h.',
        'pagamento': 'Realizamos o pagamento à vista pelos materiais entregues, após a pesagem em nossa balança certificada.',
        'como vender': 'Para vender seus materiais recicláveis, basta trazê-los até nossa unidade ou solicitar uma coleta (para grandes volumes). Faremos a pesagem e o pagamento será realizado imediatamente.',
        'empresa': 'O Baixinho da Sucata é uma empresa familiar especializada na compra de materiais recicláveis em Dom Aquino e região desde 2015. Nosso objetivo é oferecer o melhor preço pelo seu material e contribuir com o meio ambiente.',
        'contato': 'Você pode entrar em contato conosco pelo telefone/WhatsApp (66) 99928-1855 ou pelo e-mail alairrodrigues93@gmail.com.',
        'cnpj': 'Nosso CNPJ é 53.794.497/0001-23. Somos uma empresa devidamente registrada e regularizada.',
        'região': 'Atendemos Dom Aquino, Jaciara, Juscimeira, São Pedro Da Cipa, Campo Verde e outras cidades próximas no Mato Grosso.',
        'calculadora': 'Temos uma calculadora de preços em nosso site. Você pode acessá-la no menu "Calculadora" e obter uma estimativa do valor de seus materiais.',
        'menor quantidade': 'Não há quantidade mínima para venda, aceitamos desde pequenas quantidades até grandes volumes.',
        'obrigado': 'Disponha! Estou sempre aqui para ajudar. Há mais alguma coisa que você gostaria de saber?',
        'emprego': 'Estamos sempre abertos a novos talentos. Você pode conferir nossas vagas disponíveis na seção "Trabalhe Conosco" e enviar seu currículo através do formulário disponível.',
        'vaga': 'Para conhecer nossas vagas disponíveis, acesse a seção "Trabalhe Conosco" em nosso site. Lá você encontrará informações sobre oportunidades e poderá enviar seu currículo.',
        'serviços': 'Oferecemos serviços de compra de materiais recicláveis, coleta em domicílio, limpeza de terrenos e retirada de materiais. Para mais informações, visite nossa página de Serviços.'
    };
    
    // Mensagens padrão
    const defaultResponse = "Desculpe, não consegui entender sua pergunta. Pode reformular ou perguntar sobre materiais, preços, coleta, horários de funcionamento ou nossos serviços.";
    const greetingMessage = "Olá! Sou o assistente virtual do Baixinho da Sucata. Como posso ajudá-lo hoje?";
    
    /**
     * Inicializa o chatbot
     */
    function initChatbot() {
        createChatbotElements();
        setupEventListeners();
    }
    
    /**
     * Cria os elementos do chatbot na página
     */
    function createChatbotElements() {
        // Verifica se o chatbot já existe na página
        if (document.querySelector('.chatbot-container')) return;
        
        // Cria o container principal
        const chatbotContainer = document.createElement('div');
        chatbotContainer.className = 'chatbot-container';
        
        // HTML interno do chatbot
        chatbotContainer.innerHTML = `
            <div class="chatbot-button" id="open-chatbot">
                <i class="fas fa-robot"></i>
            </div>
            <div class="chatbot-window" id="chatbot-window">
                <div class="chatbot-header">
                    <div class="chatbot-title">
                        <div class="chatbot-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <span>Atendente Virtual</span>
                    </div>
                    <div class="chatbot-close" id="close-chatbot">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
                <div class="chatbot-messages" id="chatbot-messages">
                    <!-- Mensagens serão adicionadas via JavaScript -->
                </div>
                <div class="chatbot-typing" id="chatbot-typing">
                    Digitando...
                </div>
                <div class="chatbot-input">
                    <input type="text" id="chatbot-input-field" placeholder="Digite sua mensagem...">
                    <button id="send-message">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Adiciona estilos CSS
        const style = document.createElement('style');
        style.textContent = `
            /* Estilos para o chatbot */
            .chatbot-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
            }
            
            .chatbot-button {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: var(--primary, #2E7D32);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
            }
            
            .chatbot-button:hover {
                transform: scale(1.05);
                background-color: var(--dark, #1B5E20);
            }
            
            .chatbot-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 350px;
                height: 450px;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }
            
            .chatbot-header {
                background-color: var(--primary, #2E7D32);
                color: white;
                padding: 15px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .chatbot-title {
                display: flex;
                align-items: center;
            }
            
            .chatbot-avatar {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: white;
                margin-right: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--primary, #2E7D32);
                font-size: 16px;
            }
            
            .chatbot-close {
                cursor: pointer;
                font-size: 18px;
            }
            
            .chatbot-messages {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
            }
            
            .message {
                margin-bottom: 15px;
                max-width: 80%;
                word-wrap: break-word;
            }
            
            .message::after {
                content: "";
                display: table;
                clear: both;
            }
            
            .bot-message {
                background-color: #f1f1f1;
                padding: 10px;
                border-radius: 10px;
                border-top-left-radius: 0;
                float: left;
                clear: both;
            }
            
            .user-message {
                background-color: var(--primary, #2E7D32);
                color: white;
                padding: 10px;
                border-radius: 10px;
                border-top-right-radius: 0;
                float: right;
                clear: both;
            }
            
            .chatbot-input {
                padding: 10px;
                background-color: #f9f9f9;
                border-top: 1px solid #eee;
                display: flex;
            }
            
            .chatbot-input input {
                flex: 1;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 20px;
                outline: none;
            }
            
            .chatbot-input button {
                background-color: var(--primary, #2E7D32);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-left: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .chatbot-input button:hover {
                background-color: var(--dark, #1B5E20);
            }
            
            .chatbot-typing {
                display: none;
                margin-bottom: 15px;
                font-style: italic;
                color: #6c757d;
                font-size: 0.9rem;
                padding-left: 15px;
            }
            
            @media (max-width: 576px) {
                .chatbot-window {
                    width: 300px;
                    height: 400px;
                    right: 0;
                }
            }
        `;
        
        // Adiciona elementos ao DOM
        document.head.appendChild(style);
        document.body.appendChild(chatbotContainer);
        
        // Armazena referências aos elementos
        chatbotButton = document.getElementById('open-chatbot');
        closeButton = document.getElementById('close-chatbot');
        chatWindow = document.getElementById('chatbot-window');
        messagesContainer = document.getElementById('chatbot-messages');
        inputField = document.getElementById('chatbot-input-field');
        sendButton = document.getElementById('send-message');
        typingIndicator = document.getElementById('chatbot-typing');
    }
    
    /**
     * Configura os event listeners
     */
    function setupEventListeners() {
        // Abre o chatbot
        chatbotButton.addEventListener('click', function() {
            chatWindow.style.display = 'flex';
            
            // Adiciona mensagem de boas-vindas se for a primeira abertura
            if (messagesContainer.childElementCount === 0) {
                simulateTyping(() => {
                    addMessage(greetingMessage, 'bot');
                }, 500);
            }
        });
        
        // Fecha o chatbot
        closeButton.addEventListener('click', function() {
            chatWindow.style.display = 'none';
        });
        
        // Envio de mensagem (botão)
        sendButton.addEventListener('click', function() {
            sendMessage();
        });
        
        // Envio de mensagem (tecla Enter)
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    /**
     * Adiciona uma mensagem ao chat
     * @param {string} text - O texto da mensagem
     * @param {string} sender - 'bot' ou 'user'
     */
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');
        messageElement.textContent = text;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    /**
     * Simula a digitação do bot
     * @param {Function} callback - Função a ser executada após simulação
     * @param {number} duration - Duração da simulação em ms
     */
    function simulateTyping(callback, duration = 1000) {
        typingIndicator.style.display = 'block';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            callback();
        }, duration);
    }
    
    /**
     * Envia uma mensagem do usuário e processa a resposta
     */
    function sendMessage() {
        const message = inputField.value.trim();
        
        if (message === '') return;
        
        // Adiciona mensagem do usuário
        addMessage(message, 'user');
        inputField.value = '';
        
        // Processa a resposta
        const response = processQuestion(message);
        
        // Simula digitação e adiciona resposta do bot
        simulateTyping(() => {
            addMessage(response, 'bot');
        }, Math.min(1000, response.length * 20));
    }
    
    /**
     * Processa a pergunta e retorna a resposta apropriada
     * @param {string} question - A pergunta do usuário
     * @return {string} - A resposta do chatbot
     */
    function processQuestion(question) {
        // Normaliza a pergunta (remove acentos, converte para minúsculas, etc)
        const normalizedQuestion = question.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s]/gi, '');
        
        // Verifica se há correspondência exata
        for (const [key, value] of Object.entries(knowledgeBase)) {
            if (normalizedQuestion.includes(key)) {
                return value;
            }
        }
        
        // Se não houver correspondência exata, verifica palavras-chave
        const keywords = [
            { terms: ['material', 'recicla', 'compra', 'tipo'], response: 'Compramos diversos materiais como ferro, alumínio, cobre, bronze, inox, baterias, papel, papelão, plástico e outros materiais recicláveis. Consulte nossa página de materiais para ver a lista completa e preços.' },
            { terms: ['preco', 'valor', 'quanto', 'paga'], response: 'Os preços variam de acordo com o tipo e qualidade do material. Você pode consultar valores aproximados em nossa calculadora de preços ou entrar em contato diretamente conosco.' },
            { terms: ['coleta', 'buscar', 'retirar', 'domicilio'], response: 'Sim, oferecemos serviço de coleta em domicílio para quantidades significativas de material. Entre em contato pelo WhatsApp (66) 99928-1855 para agendar.' },
            { terms: ['endereco', 'localizacao', 'onde', 'chegar'], response: 'Estamos localizados na Rua Agenor de Campos, 10, Loteamento Agua Azul, Dom Aquino, Mato Grosso. Você pode nos encontrar facilmente no mapa disponível em nosso site.' },
            { terms: ['horario', 'funcionamento', 'aberto', 'atendimento'], response: 'Nosso horário de funcionamento é de Segunda a Sábado, das 7h às 18h.' },
            { terms: ['pagar', 'pagamento', 'dinheiro', 'vista'], response: 'Realizamos o pagamento à vista pelos materiais entregues, após a pesagem em nossa balança certificada.' },
            { terms: ['vender', 'entregar', 'levar', 'trazer'], response: 'Para vender seus materiais recicláveis, basta trazê-los até nossa unidade ou solicitar uma coleta (para grandes volumes). Faremos a pesagem e o pagamento será realizado imediatamente.' },
            { terms: ['contato', 'telefone', 'whatsapp', 'email'], response: 'Você pode entrar em contato conosco pelo telefone/WhatsApp (66) 99928-1855 ou pelo e-mail alairrodrigues93@gmail.com.' },
            { terms: ['regiao', 'cidade', 'atende', 'jaciara', 'juscimeira'], response: 'Atendemos Dom Aquino, Jaciara, Juscimeira, São Pedro Da Cipa, Campo Verde e outras cidades próximas no Mato Grosso.' },
            { terms: ['empresa', 'sobre', 'historia', 'baixinho'], response: 'O Baixinho da Sucata é uma empresa familiar especializada na compra de materiais recicláveis em Dom Aquino e região desde 2015. Nosso objetivo é oferecer o melhor preço pelo seu material e contribuir com o meio ambiente.' },
            { terms: ['emprego', 'vaga', 'trabalhar', 'curriculo'], response: 'Estamos sempre abertos a novos talentos. Você pode conferir nossas vagas disponíveis na seção "Trabalhe Conosco" e enviar seu currículo através do formulário disponível.' }
        ];
        
        for (const keyword of keywords) {
            if (keyword.terms.some(term => normalizedQuestion.includes(term))) {
                return keyword.response;
            }
        }
        
        // Se não encontrar correspondência, retorna resposta padrão
        return defaultResponse;
    }
    
    // Inicializa o chatbot
    initChatbot();
});