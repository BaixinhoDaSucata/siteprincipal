/**
 * Baixinho da Sucata - Servidor Node.js
 * Desenvolvido para Alair Rodrigues de Oliveira
 * DOM AQUINO - MT
 */

// Carregar variáveis de ambiente
require('dotenv').config();

// Dependências
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const bodyParser = require('body-parser');

// Configuração do App
const app = express();
const PORT = process.env.PORT || 5000;

// Configuração do PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(express.static('./'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API para enviar candidatura
app.post('/api/candidatar', async (req, res) => {
  try {
    const { nome, email, telefone, vaga, mensagem } = req.body;
    
    // Validação básica
    if (!nome || !email || !telefone || !vaga) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }
    
    // Inserir na base de dados
    const result = await pool.query(
      'INSERT INTO candidatos (nome, email, telefone, vaga, mensagem) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [nome, email, telefone, vaga, mensagem || '']
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Candidatura recebida com sucesso!',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Erro ao registrar candidatura:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao processar sua candidatura. Por favor, tente novamente mais tarde.' 
    });
  }
});

// API para listar vagas
app.get('/api/vagas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vagas WHERE ativa = TRUE ORDER BY data_criacao DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar vagas:', error);
    res.status(500).json({ error: 'Erro ao buscar vagas' });
  }
});

// Iniciar o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse http://localhost:${PORT}`);
  
  // Verificar conexão com o banco de dados
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
    } else {
      console.log('Conexão com o banco de dados estabelecida com sucesso!');
    }
  });
});