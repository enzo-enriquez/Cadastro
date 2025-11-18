// server.js
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('./db'); // db.js está na mesma pasta (Backend)
require('dotenv').config();
const path = require('path');
const cors = require('cors'); // Adicionei CORS para futuras expansões ou testes, embora para o frontend estático não seja estritamente necessário agora.

const app = express();
const PORT = process.env.PORT || 3000;

// --- Configuração de Middlewares ---

// Habilitar CORS para permitir requisições de outras origens (opcional, mas boa prática)
app.use(cors());

// Middleware para analisar o corpo das requisições como JSON
app.use(express.json());
// Middleware para analisar o corpo das requisições de formulários HTML (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));


// --- CORREÇÃO IMPORTANTE DOS CAMINHOS ---
// `__dirname` neste contexto é a pasta onde `server.js` está (ex: /cadastros/Backend)
// Para acessar a pasta `public`, precisamos subir um nível e depois descer para `public`.
const projectRoot = path.join(__dirname, '..'); // Sobe um nível para a pasta 'cadastros'

// Servir arquivos estáticos (HTML, CSS, JS) da pasta 'public'
// Agora, ele vai procurar em /cadastros/public
app.use(express.static(path.join(projectRoot, 'public')));

// --- Rotas de Autenticação ---

// Rota de Registro
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Verificar se o email já existe
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Inserir novo usuário no banco de dados
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );

        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            user: {
                id: newUser.rows[0].id,
                name: newUser.rows[0].name,
                email: newUser.rows[0].email,
            },
        });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// Rota de Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    try {
        // Buscar usuário pelo email
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Comparar a senha fornecida com a senha hashed no banco de dados
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Login bem-sucedido
        // Em um sistema real, você enviaria um token JWT ou configuraria uma sessão aqui.
        // Por simplicidade, vamos retornar uma mensagem de sucesso com os dados do usuário.
        // O frontend irá armazenar o nome do usuário no localStorage.
        res.status(200).json({
            message: 'Login bem-sucedido!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// Rota para o painel de controle (servir o arquivo HTML do painel)
app.get('/dashboard', (req, res) => {
    // Nota: Em uma aplicação real, esta rota precisaria de um middleware de autenticação
    // para verificar se o usuário realmente está logado (via token ou sessão)
    // antes de servir o dashboard. Aqui, o controle é feito primariamente no frontend via localStorage.
    res.sendFile(path.join(projectRoot, 'public', 'dashboard.html'));
});

// Rota inicial (servir o arquivo HTML da página de boas-vindas)
app.get('/', (req, res) => {
    res.sendFile(path.join(projectRoot, 'public', 'index.html'));
});

// --- Iniciar o Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});