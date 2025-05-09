/**
 * Baixinho da Sucata - Fórum Comunitário
 * JavaScript client-side para interação com o servidor Socket.io
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Conecta ao servidor Socket.io
    const socket = io();

    // Referências aos elementos DOM
    const loginForm = document.getElementById('login-form');
    const loggedUserContainer = document.getElementById('logged-user');
    const userNameSpan = document.getElementById('user-name');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const usersOnlineList = document.getElementById('users-online');
    const topicsContainer = document.getElementById('topics-container');
    const postsContainer = document.getElementById('posts-container');
    const topicForm = document.getElementById('topic-form');
    const replyForm = document.getElementById('reply-form');
    const navTopics = document.getElementById('nav-topics');
    const navNewTopic = document.getElementById('nav-new-topic');
    const createTopicBtn = document.getElementById('create-topic-btn');
    const cancelTopicBtn = document.getElementById('cancel-topic-btn');
    const backToTopicsBtn = document.getElementById('back-to-topics-btn');
    const typingIndicator = document.getElementById('typing-indicator');
    const typingText = document.getElementById('typing-text');
    const pageTitle = document.getElementById('page-title');
    const topicViewTitle = document.getElementById('topic-view-title');
    const topicViewMeta = document.getElementById('topic-view-meta');
    const topicViewDescription = document.getElementById('topic-view-description');
    const refreshBtn = document.getElementById('refresh-btn');
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    const replyMessage = document.getElementById('reply-message');
    
    // Seções de conteúdo
    const topicsList = document.getElementById('topics-list');
    const newTopicForm = document.getElementById('new-topic-form');
    const topicView = document.getElementById('topic-view');
    const topicActions = document.getElementById('topic-actions');
    
    // Toasts
    const loginToast = document.getElementById('login-toast');
    const loginToastInstance = new bootstrap.Toast(loginToast);
    const notificationToast = document.getElementById('notification-toast');
    const notificationToastInstance = new bootstrap.Toast(notificationToast);
    const notificationMessage = document.getElementById('notification-message');
    
    // Estado da aplicação
    let currentUser = null;
    let currentTopic = null;
    let typingTimeout;
    
    // === Funções de UI ===
    
    // Mostra a lista de tópicos
    function showTopicsList() {
        topicsList.classList.remove('d-none');
        newTopicForm.classList.add('d-none');
        topicView.classList.add('d-none');
        topicActions.classList.add('d-none');
        pageTitle.textContent = 'Fórum Comunitário';
        
        // Atualiza os tópicos
        fetchTopics();
        
        // Atualiza a navegação
        setActiveNav(navTopics);
    }
    
    // Mostra o formulário de novo tópico
    function showNewTopicForm() {
        if (!currentUser) {
            showLoginRequired();
            return;
        }
        
        topicsList.classList.add('d-none');
        newTopicForm.classList.remove('d-none');
        topicView.classList.add('d-none');
        topicActions.classList.add('d-none');
        pageTitle.textContent = 'Criar Novo Tópico';
        
        // Atualiza a navegação
        setActiveNav(navNewTopic);
        
        // Limpa o formulário
        document.getElementById('topic-form').reset();
    }
    
    // Mostra a visualização de um tópico
    function showTopicView(topicId) {
        topicsList.classList.add('d-none');
        newTopicForm.classList.add('d-none');
        topicView.classList.remove('d-none');
        topicActions.classList.remove('d-none');
        
        // Carrega o tópico
        fetchTopic(topicId);
        
        // Atualiza a navegação
        setActiveNav(navTopics);
        
        // Se estiver logado, entra no canal do tópico
        if (currentUser) {
            socket.emit('join-topic', topicId);
        }
    }
    
    // Define a navegação ativa
    function setActiveNav(activeNav) {
        // Remove a classe ativa de todos os itens de navegação
        document.querySelectorAll('.nav-link').forEach(item => {
            item.classList.remove('active');
        });
        
        // Adiciona a classe ativa ao item selecionado
        activeNav.classList.add('active');
    }
    
    // Mostra notificação de login necessário
    function showLoginRequired() {
        loginToastInstance.show();
    }
    
    // Mostra uma notificação
    function showNotification(message) {
        notificationMessage.textContent = message;
        notificationToastInstance.show();
    }
    
    // === Funções de API ===
    
    // Busca a lista de tópicos
    function fetchTopics() {
        topicsContainer.innerHTML = `
            <div class="text-center p-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                <p class="mt-2">Carregando tópicos...</p>
            </div>
        `;
        
        fetch('/api/topics')
            .then(response => response.json())
            .then(topics => {
                renderTopics(topics);
            })
            .catch(error => {
                console.error('Erro ao carregar tópicos:', error);
                topicsContainer.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        Erro ao carregar tópicos. Por favor, tente novamente.
                    </div>
                `;
            });
    }
    
    // Busca um tópico específico
    function fetchTopic(topicId) {
        postsContainer.innerHTML = `
            <div class="text-center p-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                <p class="mt-2">Carregando mensagens...</p>
            </div>
        `;
        
        fetch(`/api/topics/${topicId}`)
            .then(response => response.json())
            .then(topic => {
                // Guarda o tópico atual
                currentTopic = topic;
                
                // Atualiza o título da página
                pageTitle.textContent = topic.title;
                
                // Atualiza os detalhes do tópico
                topicViewTitle.textContent = topic.title;
                topicViewDescription.textContent = topic.description;
                topicViewMeta.textContent = `Criado por ${topic.createdBy} em ${formatDate(topic.createdAt)}`;
                
                // Renderiza os posts
                renderPosts(topic.posts);
                
                // Limpa o formulário de resposta
                replyForm.reset();
            })
            .catch(error => {
                console.error('Erro ao carregar tópico:', error);
                postsContainer.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        Erro ao carregar tópico. Por favor, tente novamente.
                    </div>
                `;
            });
    }
    
    // Cria um novo tópico
    function createTopic(title, description, initialPost) {
        if (!currentUser) {
            showLoginRequired();
            return;
        }
        
        const topicData = {
            title,
            description,
            user: currentUser
        };
        
        fetch('/api/topics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(topicData)
        })
            .then(response => response.json())
            .then(newTopic => {
                // Adiciona o post inicial ao novo tópico
                createPost(newTopic.id, initialPost);
                
                // Volta para a lista de tópicos
                showTopicsList();
                
                // Mostra notificação
                showNotification('Tópico criado com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao criar tópico:', error);
                alert('Erro ao criar tópico. Por favor, tente novamente.');
            });
    }
    
    // Cria um novo post em um tópico
    function createPost(topicId, message) {
        if (!currentUser) {
            showLoginRequired();
            return;
        }
        
        const postData = {
            user: currentUser,
            message
        };
        
        fetch(`/api/topics/${topicId}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
            .then(response => response.json())
            .then(newPost => {
                // Se estiver visualizando o tópico, adiciona o post
                if (currentTopic && currentTopic.id === topicId) {
                    const postElement = createPostElement(newPost);
                    postsContainer.appendChild(postElement);
                    
                    // Limpa o formulário de resposta
                    replyForm.reset();
                    
                    // Rola para o final da página
                    window.scrollTo(0, document.body.scrollHeight);
                }
            })
            .catch(error => {
                console.error('Erro ao criar post:', error);
                alert('Erro ao enviar mensagem. Por favor, tente novamente.');
            });
    }
    
    // === Funções de Renderização ===
    
    // Renderiza a lista de tópicos
    function renderTopics(topics) {
        if (topics.length === 0) {
            topicsContainer.innerHTML = `
                <div class="alert alert-info" role="alert">
                    <i class="fas fa-info-circle me-2"></i>
                    Não há tópicos para exibir. Seja o primeiro a criar um tópico!
                </div>
            `;
            return;
        }
        
        topicsContainer.innerHTML = '';
        
        topics.forEach(topic => {
            const topicElement = document.createElement('a');
            topicElement.href = '#';
            topicElement.className = 'list-group-item list-group-item-action topic-card';
            topicElement.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${topic.title}</h5>
                    <small>${formatDate(topic.createdAt)}</small>
                </div>
                <p class="mb-1">${topic.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">Criado por ${topic.createdBy}</small>
                    <span class="badge bg-primary rounded-pill">${topic.postCount} mensagens</span>
                </div>
            `;
            
            topicElement.addEventListener('click', (e) => {
                e.preventDefault();
                showTopicView(topic.id);
            });
            
            topicsContainer.appendChild(topicElement);
        });
    }
    
    // Renderiza os posts de um tópico
    function renderPosts(posts) {
        if (posts.length === 0) {
            postsContainer.innerHTML = `
                <div class="alert alert-info" role="alert">
                    <i class="fas fa-info-circle me-2"></i>
                    Não há mensagens neste tópico. Seja o primeiro a responder!
                </div>
            `;
            return;
        }
        
        postsContainer.innerHTML = '';
        
        posts.forEach(post => {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
        });
    }
    
    // Cria um elemento de post
    function createPostElement(post) {
        const postElement = document.createElement('div');
        postElement.className = 'card post-card';
        postElement.dataset.postId = post.id;
        
        postElement.innerHTML = `
            <div class="post-header">
                <div class="d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">${post.user}</h6>
                    <small>${formatDate(post.createdAt)}</small>
                </div>
            </div>
            <div class="post-content">
                <p class="mb-0">${formatMessage(post.message)}</p>
            </div>
            <div class="post-footer text-end">
                <small class="text-muted">Post #${post.id}</small>
            </div>
        `;
        
        return postElement;
    }
    
    // Renderiza a lista de usuários online
    function renderUsersOnline(users) {
        if (users.length === 0) {
            usersOnlineList.innerHTML = '<li class="online-user">Nenhum usuário online</li>';
            return;
        }
        
        usersOnlineList.innerHTML = '';
        
        users.forEach(user => {
            const userElement = document.createElement('li');
            userElement.className = 'online-user';
            userElement.textContent = user;
            usersOnlineList.appendChild(userElement);
        });
    }
    
    // === Funções Utilitárias ===
    
    // Formata a data
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Formata a mensagem (converte quebras de linha em <br>)
    function formatMessage(message) {
        return message.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
    }
    
    // === Event Listeners ===
    
    // Login
    loginBtn.addEventListener('click', function() {
        const username = document.getElementById('username').value.trim();
        
        if (!username) {
            alert('Por favor, digite seu nome.');
            return;
        }
        
        // Armazena o usuário atual
        currentUser = username;
        
        // Atualiza a UI
        userNameSpan.textContent = currentUser;
        loginForm.classList.add('d-none');
        loggedUserContainer.classList.remove('d-none');
        
        // Emite o evento de registro
        socket.emit('register-user', currentUser);
        
        // Se estiver em um tópico, entra no canal
        if (currentTopic) {
            socket.emit('join-topic', currentTopic.id);
        }
    });
    
    // Logout
    logoutBtn.addEventListener('click', function() {
        // Limpa o usuário atual
        currentUser = null;
        
        // Atualiza a UI
        loginForm.classList.remove('d-none');
        loggedUserContainer.classList.add('d-none');
        document.getElementById('username').value = '';
        
        // Volta para a lista de tópicos
        showTopicsList();
    });
    
    // Navegação para tópicos
    navTopics.addEventListener('click', function(e) {
        e.preventDefault();
        showTopicsList();
    });
    
    // Navegação para novo tópico
    navNewTopic.addEventListener('click', function(e) {
        e.preventDefault();
        showNewTopicForm();
    });
    
    // Botão de criar tópico
    createTopicBtn.addEventListener('click', function() {
        if (!currentUser) {
            showLoginRequired();
            return;
        }
        
        showNewTopicForm();
    });
    
    // Cancelar criação de tópico
    cancelTopicBtn.addEventListener('click', function() {
        showTopicsList();
    });
    
    // Voltar para a lista de tópicos
    backToTopicsBtn.addEventListener('click', function() {
        showTopicsList();
    });
    
    // Submissão do formulário de tópico
    topicForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!currentUser) {
            showLoginRequired();
            return;
        }
        
        const title = document.getElementById('topic-title').value.trim();
        const description = document.getElementById('topic-description').value.trim();
        const initialPost = document.getElementById('topic-initial-post').value.trim();
        
        if (!title || !description || !initialPost) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        createTopic(title, description, initialPost);
    });
    
    // Submissão do formulário de resposta
    replyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!currentUser) {
            showLoginRequired();
            return;
        }
        
        if (!currentTopic) {
            return;
        }
        
        const message = document.getElementById('reply-message').value.trim();
        
        if (!message) {
            alert('Por favor, digite uma mensagem.');
            return;
        }
        
        createPost(currentTopic.id, message);
    });
    
    // Evento de digitação
    replyMessage.addEventListener('input', function() {
        if (!currentUser || !currentTopic) {
            return;
        }
        
        // Limpa o timeout anterior
        clearTimeout(typingTimeout);
        
        // Emite o evento de digitação
        socket.emit('typing', currentTopic.id);
        
        // Define o timeout para parar de emitir o evento
        typingTimeout = setTimeout(() => {
            // O usuário parou de digitar
        }, 2000);
    });
    
    // Botão de atualizar
    refreshBtn.addEventListener('click', function() {
        if (currentTopic) {
            fetchTopic(currentTopic.id);
        } else {
            fetchTopics();
        }
    });
    
    // Toggle do sidebar (mobile)
    toggleSidebarBtn.addEventListener('click', function() {
        sidebar.classList.toggle('show');
    });
    
    // === Socket.io Event Handlers ===
    
    // Quando receber a lista de usuários
    socket.on('user-list', function(users) {
        renderUsersOnline(users);
    });
    
    // Quando um usuário entrar em um tópico
    socket.on('user-joined', function(data) {
        if (currentTopic && currentTopic.id === data.topic) {
            showNotification(`${data.user} entrou no tópico`);
        }
    });
    
    // Quando um usuário estiver digitando
    socket.on('user-typing', function(data) {
        if (currentTopic && currentTopic.id === data.topic) {
            typingText.textContent = `${data.user} está digitando...`;
            typingIndicator.classList.remove('d-none');
            
            // Esconde o indicador após 2 segundos
            setTimeout(() => {
                typingIndicator.classList.add('d-none');
            }, 2000);
        }
    });
    
    // Quando receber uma nova mensagem
    socket.on('new-message', function(post) {
        if (currentTopic && currentTopic.id === post.topicId) {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
            
            // Rola para o final da página
            window.scrollTo(0, document.body.scrollHeight);
        }
    });
    
    // Quando um novo tópico for criado
    socket.on('new-topic', function(topic) {
        // Atualiza a lista de tópicos se estiver visualizando-a
        if (!currentTopic && !newTopicForm.classList.contains('d-none')) {
            fetchTopics();
        }
    });
    
    // === Inicialização ===
    
    // Mostra a lista de tópicos inicialmente
    showTopicsList();
});