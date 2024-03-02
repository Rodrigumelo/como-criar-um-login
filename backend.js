const http = require('http');
const path = require('path');
const express = require('express');
const fs = require("fs");
const session = require('express-session');

const app = express();
const server = http.createServer(app);

app.use(session({ secret: "abc" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurações
app.set('port', process.env.PORT || 3000);

// Seção de login
app.use('/acesso-restrito/*', (req, res, next) => {
    if (req.session.nome) {
        next();
    } else {
        res.redirect('/public/index.html');
    }
});

// Artigos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Inicialização do servidor
server.listen(app.get('port'), () => {
    console.log('Server na porta', app.get('port'));
});

// Seção de login 2
app.post('/login', (req, res) => {
    fs.readFile('public/usuarios.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Erro ao ler o arquivo de usuários:", err);
            res.send('falhou');
            return;
        }

        const usuariosparse = JSON.parse(data);
        const nome = req.body.nomes;
        const senha = req.body.senha;

        for (const umUsuario of usuariosparse) {
            if (nome == umUsuario.nome && senha == umUsuario.senha) {
                req.session.nome = umUsuario;
                res.send('conectado');
                return;
            }
        }
        res.send('falhou');
    });
});
