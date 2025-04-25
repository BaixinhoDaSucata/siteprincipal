/**
 * Baixinho da Sucata - Chatbot Inteligente
 * Desenvolvido para Alair Rodrigues de Oliveira
 * DOM AQUINO - MT
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Inicializa o chatbot
    initChatbot();
    
    /**
     * Inicializa o chatbot
     */
    function initChatbot() {
        // Cria os elementos HTML do chatbot se não existirem
        createChatbotElements();
        
        // Configura os event listeners
        setupEventListeners();
    }
    
    /**
     * Cria os elementos do chatbot na página
     */
    function createChatbotElements() {
        // Verifica se os elementos já existem
        if (document.getElementById('chatbot-container')) return;
        
        // Cria o container principal
        const chatbotContainer = document.createElement('div');
        chatbotContainer.id = 'chatbot-container';
        
        // Botão para abrir o chatbot
        const openButton = document.createElement('button');
        openButton.id = 'open-chatbot';
        openButton.className = 'chatbot-toggle';
        openButton.innerHTML = '<i class="fas fa-comments"></i>';
        
        // Janela do chatbot
        const chatWindow = document.createElement('div');
        chatWindow.id = 'chatbot-window';
        chatWindow.style.display = 'none';
        
        // Cabeçalho do chatbot
        const chatHeader = document.createElement('div');
        chatHeader.className = 'chatbot-header';
        chatHeader.innerHTML = `
            <div class="chatbot-title">
                <i class="fas fa-robot me-2"></i>
                Assistente Virtual - Baixinho da Sucata
            </div>
            <button id="close-chatbot" class="chatbot-close-btn">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Corpo da mensagem
        const chatBody = document.createElement('div');
        chatBody.className = 'chatbot-body';
        
        // Container de mensagens
        const messagesContainer = document.createElement('div');
        messagesContainer.id = 'chatbot-messages';
        messagesContainer.className = 'chatbot-messages';
        
        // Indicador de digitação
        const typingIndicator = document.createElement('div');
        typingIndicator.id = 'chatbot-typing';
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        typingIndicator.style.display = 'none';
        
        // Área de input
        const inputArea = document.createElement('div');
        inputArea.className = 'chatbot-input-area';
        inputArea.innerHTML = `
            <input type="text" id="chatbot-input-field" placeholder="Digite sua pergunta...">
            <button id="send-message">
                <i class="fas fa-paper-plane"></i>
            </button>
        `;
        
        // Monta a estrutura
        chatBody.appendChild(messagesContainer);
        chatBody.appendChild(typingIndicator);
        
        chatWindow.appendChild(chatHeader);
        chatWindow.appendChild(chatBody);
        chatWindow.appendChild(inputArea);
        
        chatbotContainer.appendChild(openButton);
        chatbotContainer.appendChild(chatWindow);
        
        // Adiciona ao corpo do documento
        document.body.appendChild(chatbotContainer);
    }
    
    /**
     * Configura os event listeners
     */
    function setupEventListeners() {
        const chatbotButton = document.getElementById('open-chatbot');
        const closeButton = document.getElementById('close-chatbot');
        const chatWindow = document.getElementById('chatbot-window');
        const messagesContainer = document.getElementById('chatbot-messages');
        const inputField = document.getElementById('chatbot-input-field');
        const sendButton = document.getElementById('send-message');
        
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
        const messagesContainer = document.getElementById('chatbot-messages');
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
        const typingIndicator = document.getElementById('chatbot-typing');
        typingIndicator.style.display = 'block';
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            callback();
        }, duration);
    }
    
    /**
     * Envia uma mensagem do usuário e processa a resposta
     */
    function sendMessage() {
        const inputField = document.getElementById('chatbot-input-field');
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
            { terms: ['vaga', 'oportunidade', 'emprego', 'trabalho'], response: 'Temos diversas vagas disponíveis. Você pode conferir todas as oportunidades nesta página e se candidatar através do formulário abaixo.' },
            { terms: ['salario', 'ganhar', 'paga', 'remuneracao'], response: 'Os salários variam de acordo com o cargo e a experiência. Você pode verificar a faixa salarial na descrição de cada vaga.' },
            { terms: ['entrevista', 'selecao', 'processo'], response: 'Nosso processo seletivo consiste em análise curricular, entrevista com RH, entrevista técnica/prática (quando aplicável), entrevista com gestor, exames admissionais e contratação.' },
            { terms: ['requisito', 'precisa', 'necessario'], response: 'Os requisitos variam de acordo com cada vaga. Você pode verificar os requisitos específicos na descrição de cada posição.' },
            { terms: ['beneficio', 'vantagem', 'oferecem'], response: 'Oferecemos diversos benefícios como vale-transporte, vale-alimentação, plano de saúde após o período de experiência, seguro de vida e oportunidades de crescimento interno.' },
            { terms: ['contato', 'telefone', 'email', 'falar'], response: 'Você pode entrar em contato conosco pelo telefone (66) 99928-1855 ou pelo e-mail alairrodrigues93@gmail.com.' },
            { terms: ['horario', 'jornada', 'turno', 'trabalha'], response: 'Os horários variam conforme a função, geralmente entre 7h e 18h, de segunda a sexta ou de segunda a sábado, com escalas específicas para algumas funções.' },
            { terms: ['experiencia', 'conhecimento', 'saber'], response: 'Algumas vagas exigem experiência prévia, outras são adequadas para iniciantes. Verifique os requisitos específicos de cada vaga.' },
            { terms: ['enviar', 'curriculo', 'candidatar', 'aplicar'], response: 'Para se candidatar, role a página até o formulário de candidatura, preencha seus dados e anexe seu currículo em formato PDF ou DOC.' }
        ];
        
        for (const keyword of keywords) {
            if (keyword.terms.some(term => normalizedQuestion.includes(term))) {
                return keyword.response;
            }
        }
        
        // Se não encontrar correspondência, retorna resposta padrão
        return defaultResponse;
    }
    
    // Base de conhecimento do chatbot
    const knowledgeBase = {
        'ola': 'Olá! Bem-vindo ao Baixinho da Sucata. Como posso ajudá-lo hoje?',
        'oi': 'Olá! Bem-vindo ao Baixinho da Sucata. Como posso ajudá-lo hoje?',
        'bom dia': 'Bom dia! Como posso ajudá-lo hoje?',
        'boa tarde': 'Boa tarde! Como posso ajudá-lo hoje?',
        'boa noite': 'Boa noite! Como posso ajudá-lo hoje?',
        'quem é você': 'Sou o assistente virtual do Baixinho da Sucata, estou aqui para responder suas dúvidas sobre vagas, processo seletivo e nossa empresa.',
        'como funciona': 'Para se candidatar a uma vaga, basta preencher o formulário e anexar seu currículo. Nossa equipe irá analisar e entrar em contato caso seu perfil se encaixe nas vagas disponíveis.',
        'beneficios': 'Oferecemos diversos benefícios como vale-transporte, vale-alimentação, plano de saúde após o período de experiência, seguro de vida e oportunidades de crescimento interno.',
        'salario': 'Os salários variam de acordo com o cargo e a experiência. Você pode verificar a faixa salarial na descrição de cada vaga.',
        'processo seletivo': 'Nosso processo seletivo consiste em análise curricular, entrevista com RH, entrevista técnica/prática (quando aplicável), entrevista com gestor, exames admissionais e contratação.',
        'documentos': 'Para a contratação, serão necessários documentos como RG, CPF, CTPS, comprovante de residência, certificado de escolaridade e outros que serão informados caso você seja aprovado no processo seletivo.',
        'entrevista': 'As entrevistas podem ser presenciais ou online, dependendo da etapa do processo e da vaga. Recomendamos que se prepare conhecendo nossa empresa e o setor de reciclagem.',
        'horario de trabalho': 'Os horários variam conforme a função, geralmente entre 7h e 18h, de segunda a sexta ou de segunda a sábado, com escalas específicas para algumas funções.',
        'experiencia': 'Algumas vagas exigem experiência prévia, outras são adequadas para iniciantes. Verifique os requisitos específicos de cada vaga.',
        'candidatar': 'Para se candidatar, role a página até o formulário de candidatura, preencha seus dados e anexe seu currículo em formato PDF ou DOC.',
        'prazo': 'Geralmente entramos em contato com os candidatos selecionados em até 10 dias úteis após o recebimento do currículo.',
        'obrigado': 'Disponha! Estou sempre aqui para ajudar. Há mais alguma coisa que você gostaria de saber?',
        'contato': 'Você pode entrar em contato conosco pelo telefone (66) 99928-1855 ou pelo e-mail alairrodrigues93@gmail.com.',
        'endereco': 'Estamos localizados na Rua Agenor de Campos (Antiga Perimetral), nº 10, Loteamento Agua Azul, Dom Aquino - MT.',
        'mais vagas': 'Periodicamente abrimos novas vagas. Caso não encontre uma vaga que se adeque ao seu perfil, recomendamos enviar seu currículo para nosso banco de talentos.',
        'requisitos': 'Os requisitos variam de acordo com cada vaga. Você pode verificar os requisitos específicos na descrição de cada posição.',
        'cursos': 'Valorizamos candidatos que buscam aprimoramento profissional. Dependendo da vaga, cursos específicos podem ser diferenciais importantes.',
        'feedback': 'Procuramos dar feedback a todos os candidatos que passam pelo processo seletivo completo. Para quem está na fase de triagem curricular, nem sempre é possível retornar individualmente devido ao volume de candidaturas.',
        'deficiencia': 'Sim, valorizamos a diversidade e inclusão. Temos vagas para pessoas com deficiência e adaptamos nosso ambiente de trabalho para acomodar diferentes necessidades.'
    };
    
    // Mensagens padrão
    const defaultResponse = "Desculpe, não consegui entender sua pergunta. Pode reformular ou perguntar sobre vagas, processo seletivo, benefícios, horários de trabalho ou contato.";
    const greetingMessage = "Olá! Sou o assistente virtual do Baixinho da Sucata. Como posso ajudá-lo com informações sobre nossas vagas?";
});