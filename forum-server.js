/**
 * Baixinho da Sucata - Fórum Comunitário
 * Servidor Node.js com Socket.io para comunicação em tempo real
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

// Configuração do servidor
const app = express();
const server = http.createServer(app);

// Habilitando CORS para todas as origens
app.use(cors());

// Configuração do Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Permite todas as origens em desenvolvimento
    methods: ['GET', 'POST']
  }
});

// Armazenamento em memória para mensagens e usuários
const forumTopics = [
  {
    id: 1,
    title: 'Dicas de Reciclagem',
    description: 'Compartilhe suas melhores dicas para reciclar em casa',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    posts: [
      {
        id: 1,
        topicId: 1,
        user: 'Admin',
        message: 'Bem-vindos ao nosso fórum de reciclagem! Compartilhem suas dicas!',
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 2,
    title: 'Materiais Difíceis de Reciclar',
    description: 'Discussão sobre como lidar com materiais que são difíceis de reciclar',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    posts: [
      {
        id: 1,
        topicId: 2,
        user: 'Admin',
        message: 'Quais materiais vocês têm dificuldade de reciclar? Vamos discutir soluções!',
        createdAt: new Date().toISOString()
      }
    ]
  }
];

// Lista de usuários conectados
const connectedUsers = new Map();

// Contador para IDs
let nextTopicId = 3;
let nextPostId = 2;

// Rota para servir a página inicial do fórum
app.use(express.static('forum'));

// Middleware para processar requisições JSON
app.use(express.json());

// Endpoints da API REST
app.get('/api/topics', (req, res) => {
  // Retorna apenas os dados básicos dos tópicos, sem os posts
  const topicsWithoutPosts = forumTopics.map(topic => ({
    id: topic.id,
    title: topic.title,
    description: topic.description,
    createdBy: topic.createdBy,
    createdAt: topic.createdAt,
    postCount: topic.posts.length
  }));
  res.json(topicsWithoutPosts);
});

app.get('/api/topics/:id', (req, res) => {
  const topicId = parseInt(req.params.id);
  const topic = forumTopics.find(t => t.id === topicId);
  
  if (!topic) {
    return res.status(404).json({ error: 'Tópico não encontrado' });
  }
  
  res.json(topic);
});

app.post('/api/topics', (req, res) => {
  const { title, description, user } = req.body;
  
  if (!title || !description || !user) {
    return res.status(400).json({ error: 'Título, descrição e usuário são obrigatórios' });
  }
  
  const newTopic = {
    id: nextTopicId++,
    title,
    description,
    createdBy: user,
    createdAt: new Date().toISOString(),
    posts: []
  };
  
  forumTopics.push(newTopic);
  
  // Notifica todos os clientes sobre o novo tópico
  io.emit('new-topic', {
    id: newTopic.id,
    title: newTopic.title,
    description: newTopic.description,
    createdBy: newTopic.createdBy,
    createdAt: newTopic.createdAt,
    postCount: 0
  });
  
  res.status(201).json(newTopic);
});

app.post('/api/topics/:id/posts', (req, res) => {
  const topicId = parseInt(req.params.id);
  const { user, message } = req.body;
  
  if (!user || !message) {
    return res.status(400).json({ error: 'Usuário e mensagem são obrigatórios' });
  }
  
  const topic = forumTopics.find(t => t.id === topicId);
  
  if (!topic) {
    return res.status(404).json({ error: 'Tópico não encontrado' });
  }
  
  const newPost = {
    id: nextPostId++,
    topicId,
    user,
    message,
    createdAt: new Date().toISOString()
  };
  
  topic.posts.push(newPost);
  
  // Notifica todos os clientes sobre o novo post
  io.emit('new-post', newPost);
  
  res.status(201).json(newPost);
});

// Conexão de Socket.io
io.on('connection', (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);
  
  // Registra um novo usuário
  socket.on('register-user', (username) => {
    connectedUsers.set(socket.id, username);
    
    // Informa a todos sobre o novo usuário
    io.emit('user-list', Array.from(connectedUsers.values()));
    console.log(`Usuário registrado: ${username}`);
  });
  
  // Quando um usuário entra em um tópico
  socket.on('join-topic', (topicId) => {
    socket.join(`topic-${topicId}`);
    const username = connectedUsers.get(socket.id);
    console.log(`${username} entrou no tópico ${topicId}`);
    
    // Envia uma mensagem apenas para os usuários neste tópico
    socket.to(`topic-${topicId}`).emit('user-joined', {
      topic: topicId,
      user: username
    });
  });
  
  // Quando um usuário envia uma mensagem em um tópico
  socket.on('send-message', (data) => {
    const { topicId, message } = data;
    const username = connectedUsers.get(socket.id);
    
    if (!username) {
      return;
    }
    
    const topic = forumTopics.find(t => t.id === topicId);
    
    if (!topic) {
      return;
    }
    
    const newPost = {
      id: nextPostId++,
      topicId,
      user: username,
      message,
      createdAt: new Date().toISOString()
    };
    
    topic.posts.push(newPost);
    
    // Envia a mensagem para todos os usuários no tópico
    io.to(`topic-${topicId}`).emit('new-message', newPost);
    
    console.log(`Nova mensagem de ${username} no tópico ${topicId}: ${message}`);
  });
  
  // Quando um usuário está digitando
  socket.on('typing', (topicId) => {
    const username = connectedUsers.get(socket.id);
    
    if (!username) {
      return;
    }
    
    // Informa aos outros usuários que alguém está digitando
    socket.to(`topic-${topicId}`).emit('user-typing', {
      topic: topicId,
      user: username
    });
  });
  
  // Quando um usuário se desconecta
  socket.on('disconnect', () => {
    const username = connectedUsers.get(socket.id);
    connectedUsers.delete(socket.id);
    
    if (username) {
      // Informa aos outros usuários que alguém saiu
      io.emit('user-list', Array.from(connectedUsers.values()));
      console.log(`Usuário desconectado: ${username}`);
    }
  });
});

// Inicia o servidor na porta 5001
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Servidor do fórum rodando na porta ${PORT}`);
  console.log(`Acesse http://localhost:${PORT} para visualizar o fórum`);
});