const express = require('express');
const mysql = require('mysql2/promise'); // Usando mysql2 com suporte a Promises
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["https://tcc-umber.vercel.app/"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(helmet());


let db;

async function connectToDatabase() {
    try {
        // Verifica se a conexão já existe e se não está fechada
        if (!db || db.connection._closing) {
            db = await mysql.createConnection({
                host: process.env.DB_HOST || "localhost",  // Usar variáveis de ambiente, se disponíveis
                user: process.env.DB_USER || "root",
                password: process.env.DB_PASSWORD || "",
                database: process.env.DB_NAME || "biblioteca"
            });
            console.log('Conectado com o BD');
        }
        return db; // Retorna a conexão
    } catch (err) {
        console.error('Erro ao conectar com o banco de dados:', err.message);
        throw new Error('Erro ao conectar com o banco de dados');
    }
}


// Middleware para verificar usuário autenticado
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Message: "We need token please provide it." });
    } else {
        jwt.verify(token, "our-jsonwebtoken-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Message: "Authentication Error." });
            } else {
                req.name = decoded.name;
                next();
            }
        });
    }
};

// Rota principal (com usuário verificado)
app.get('/', verifyUser, (req, res) => {
    return res.json({ Message: "Success", name: req.name });
});

// Rota para buscar dados do usuário
app.get('/User', verifyUser, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [data] = await db.execute('SELECT * FROM usuario WHERE Nome = ?', [req.name]);
        if (data.length > 0) {
            return res.json({ Status: "Success", user: data[0] });
        } else {
            return res.json({ Message: "Usuário não encontrado" });
        }
    } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err.message);
        res.status(500).json({ Message: "Erro no servidor" });
    }
});

// Rota para login
app.post("/Login", [
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const db = await connectToDatabase();
        const [data] = await db.execute('SELECT * FROM usuario WHERE Email = ? AND Senha = ?', [req.body.email, req.body.password]);
        if (data.length > 0) {
            const name = data[0].Nome;
            const token = jwt.sign({ name }, 'our-jsonwebtoken-secret-key', { expiresIn: "1d" });
            res.cookie('token', token, { httpOnly: true });
            return res.json({ Status: "Success", name });
        } else {
            return res.json({ Message: "Usuário não encontrado" });
        }
    } catch (err) {
        console.error('Erro no login:', err.message);
        res.status(500).json({ Message: "Erro no servidor" });
    }
});

// Rota para logout
app.get('/Logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success" });
});

// Verificação de disponibilidade do livro
app.get('/livros/:id/disponibilidade', async (req, res) => {
    const livroId = req.params.id;
    try {
        const db = await connectToDatabase();
        const [data] = await db.execute('SELECT qtd FROM livros WHERE id = ?', [livroId]);
        if (data.length > 0 && data[0].qtd > 0) {
            return res.json({ disponivel: true });
        } else {
            return res.json({ disponivel: false });
        }
    } catch (err) {
        console.error('Erro ao buscar disponibilidade do livro:', err.message);
        res.status(500).json({ Message: "Erro no servidor" });
    }
});

// Rota para buscar todos os livros
app.get('/Livros', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [data] = await db.execute("SELECT * FROM livro;");
        return res.json(data);
    } catch (err) {
        console.error('Erro ao buscar livros:', err.message);
        res.status(500).json({ Message: "Erro no servidor" });
    }
});

// Rota para buscar livros de História
app.get('/Historia', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [data] = await db.execute("SELECT * FROM livro WHERE categoria LIKE '%Historia%';");
        return res.json(data);
    } catch (err) {
        console.error('Erro ao buscar livros de História:', err.message);
        res.status(500).json({ Message: "Erro no servidor" });
    }
});

// Rota para buscar Biografias
app.get('/Biografias', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [data] = await db.execute("SELECT * FROM livro WHERE categoria LIKE '%Biografias%';");
        return res.json(data);
    } catch (err) {
        console.error('Erro ao buscar biografias:', err.message);
        res.status(500).json({ Message: "Erro no servidor" });
    }
});

// Rota para buscar eventos
app.get('/Eventos', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [data] = await db.execute("SELECT * FROM evento;");
        return res.json(data);
    } catch (err) {
        console.error('Erro ao buscar eventos:', err.message);
        res.status(500).json({ Message: "Erro no servidor" });
    }
});

// Rota para criar aluguel
app.post("/aluguel", [
    body('usuario_id').isInt().withMessage('O ID do usuário deve ser um número inteiro.'),
    body('livro_id').isInt().withMessage('O ID do livro deve ser um número inteiro.'),
    body('data_inicio').isISO8601().withMessage('A data de início deve ser uma data válida.'),
    body('data_devolucao').isISO8601().withMessage('A data de devolução deve ser uma data válida.'),
    body('status').isIn(['ativo', 'inativo', 'cancelado']).withMessage('O status deve ser "ativo", "inativo" ou "cancelado".'),
    body('observacoes').optional().isString().withMessage('Observações devem ser uma string.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { usuario_id, livro_id, data_inicio, data_devolucao, status, observacoes } = req.body;

    try {
        const db = await connectToDatabase();

        // Verifica se o usuário já possui um aluguel ativo
        const [userResults] = await db.execute('SELECT * FROM aluguel WHERE usuario_id = ? AND status = "ativo"', [usuario_id]);
        if (userResults.length > 0) {
            return res.status(400).json({ message: "O usuário já possui um livro alugado e ativo." });
        }

        // Contar total de livros disponíveis
        const [livroResults] = await db.execute('SELECT qtd FROM livro WHERE ID = ?', [livro_id]);
        if (livroResults.length === 0) {
            return res.status(404).json({ message: "Livro não encontrado." });
        }

        const totalLivros = livroResults[0].qtd;

        // Contar quantos livros estão alugados (status "ativo")
        const [alugadosResults] = await db.execute('SELECT COUNT(*) AS totalAlugados FROM aluguel WHERE livro_id = ? AND status = "ativo"', [livro_id]);
        const totalAlugados = alugadosResults[0].totalAlugados;

        // Calcular a disponibilidade
        const disponibilidade = totalLivros - totalAlugados;

        if (disponibilidade <= 0) {
            return res.status(400).json({ message: "Livro não está disponível para aluguel." });
        }

        // Inserção do novo aluguel
        const [results] = await db.execute(
            'INSERT INTO aluguel (usuario_id, livro_id, data_inicio, data_devolucao, status, observacoes) VALUES (?, ?, ?, ?, ?, ?)',
            [usuario_id, livro_id, data_inicio, data_devolucao, status, observacoes]
        );

        return res.json({ message: "Aluguel criado com sucesso.", aluguelId: results.insertId });
    } catch (err) {
        console.error('Erro ao criar aluguel:', err.message);
        res.status(500).json({ Message: "Erro no servidor" });
    }
});

// Rate limit para proteger contra abusos
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // Limite de 100 requests por IP
});
app.use('/api/', apiLimiter);

// Porta de escuta do servidor
const port = process.env.DB_PORT || 3001;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
