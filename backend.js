const http = require('http');
const path = require('path');
const express = require('express');
const fs = require('fs');
const session = require('express-session');
const XLSX = require('xlsx');  // Importa a biblioteca xlsx para manipulação de Excel

const app = express();
const server = http.createServer(app);

app.use(session({
    secret: "abc",
    resave: false, // Define se a sessão deve ser regravada no banco de dados a cada requisição
    saveUninitialized: true // Define se uma nova sessão deve ser criada mesmo que não tenha dados
}));
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

// Endpoint para exportar dados para Excel
app.post('/export', (req, res) => {
    const data = req.body;

    // Cria um novo workbook e worksheet com os dados fornecidos
    const workbook = XLSX.utils.book_new();
    const worksheetData = [
        ["Campo", "Valor"],
        ["Requisitante", data.requisitante || ""],
        ["Matrícula", data.matricula || ""],
        ["Empresa", data.empresa || ""],
        ["Ferramentas Requisitadas", data.ferramentas.join(", ") || ""],
        ["Data de Requisição", data.data_requisicao || ""],
        ["Horário de Requisição", data.horario_requisicao || ""],
        ["Data de Devolução", data.data_devolucao || ""],
        ["Horário de Devolução", data.horario_devolucao || ""]
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Requisição");

    const filePath = path.join(__dirname, 'RequisicaoFerramentas.xlsx');
    XLSX.writeFile(workbook, filePath);

    // Envia o arquivo para o cliente
    res.download(filePath, 'RequisicaoFerramentas.xlsx', (err) => {
        if (err) {
            console.error("Erro ao enviar o arquivo:", err);
        }
        // Remove o arquivo após o download
        fs.unlink(filePath, (err) => {
            if (err) console.error("Erro ao remover o arquivo:", err);
        });
    });
});
