const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true
}));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "biblioteca"
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

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

app.get('/', verifyUser, (req, res) => {
    return res.json({ Message: "Success", name: req.name });
});

app.get('/User', verifyUser, (req, res) => {
    const sql = 'SELECT * FROM usuario WHERE Nome = ?';
    db.query(sql, [req.name], (err, data) => {
        if (err) return res.json({ Message: "Erro ao buscar dados do usuário" });
        if (data.length > 0) {
            return res.json({ Status: "Success", user: data[0] });
        } else {
            return res.json({ Message: "Usuário não encontrado" });
        }
    });
});

app.post("/Login", (req, res) => {
    const sql = 'SELECT * FROM usuario WHERE Email = ? AND Senha = ?';
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) return res.json({ Message: "Server Side Error" });
        if (data.length > 0) {
            const name = data[0].Nome;
            const token = jwt.sign({ name }, 'our-jsonwebtoken-secret-key', { expiresIn: "1d" });
            res.cookie('token', token);
            return res.json({ Status: "Success", name });
        } else {
            return res.json({ Message: "Usuário não encontrado" });
        }
    });
});

app.get('/Logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success" });
});

app.get('/Livros', (req, res) => {
    const sql = "SELECT * FROM livro;";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/Historia', (req, res) => {
    const sql = "SELECT * FROM livro WHERE categoria LIKE '%Historia%';";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/Biografias', (req, res) => {
    const sql = "SELECT * FROM livro WHERE categoria LIKE '%Biografias%';";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.listen(8088, () => {
    console.log("Running on port 8088");
});


