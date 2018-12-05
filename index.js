let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let mysql = require('mysql');
let mysqlCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senhamysql',
    database: 'rango'
});
mysqlCon.connect();

io.on('connection', (socket) => {
    console.log("User connected.");

    socket.on('disconnect', function() {
        // gerenciar desconexão de usuário
        console.log("User disconnected.");
    });

    socket.on('login-vendedor', (dados) => {
        let email = dados.email;
        let senha = dados.senha;

        mysqlCon.query('SELECT email, senha FROM vendedor WHERE email = ?', [email], function(err, result) {
            if (err) throw err;

            if (result.length != 1) {
                socket.emit('retorno-login-vendedor', {
                    mensagem: 'Email não cadastrado no sistema.'
                });
            } else {
                var senhaBanco = result[0].senha;
                if (senha === senhaBanco) {
                    socket.emit('retorno-login-vendedor', {
                        mensagem: 'Login realizado com sucesso!'
                    });
                } else {
                    socket.emit('retorno-login-vendedor', {
                        mensagem: 'A senha não corresponde ao email informado.'
                    });
                }
            }
        });
    });

    socket.on('cadastro-vendedor', (dados) => {
        var nomeNegocio = dados.nomeNegocio;
        var cpf = dados.cpf;
        var telefone = dados.telefone;
        var categoria = dados.categoria;
        var distanciaEntrega = dados.distanciaEntrega;
        var nome = dados.nome;
        var email = dados.email;
        var senha = dados.senha;
        var formaPagamento = dados.formaPagamento;

        mysqlCon.query('SELECT * FROM vendedor WHERE cpf = ?', [cpf], function(err, result) {
            if (err) throw err;

            if (result.length > 0) {
                socket.emit('retorno-cadastro-vendedor', {
                    mensagem: 'Já existe um vendedor cadastrado com este cpf.'
                });
            } else {
                mysqlCon.query("INSERT INTO vendedor (cpfVendedor, nome, email, senha, limiteEntrega, formaPagamento) VALUES " +
                    "(%, %, %, %, %, %)" [cpf, nome, email, senha, distanciaEntrega, formaPagamento], function(err, result) {
                        if (err) throw err;
                        socket.emit('retorno-cadastro-vendedor', {
                            mensagem: "Cadastro realizado com sucesso."
                        });
                    });
            }
        });
    });

    socket.on('login-cliente', (dados) => {
        let email = dados.email;
        let senha = dados.senha;

        mysqlCon.query("SELECT email, senha FROM cliente WHERE email = ?", [email], function(err, result) {
            if (err) throw err;

            if (result.length != 1) {
                socket.emit('retorno-login-cliente', {
                    mensagem: 'Email não cadastrado no sistema.'
                });
            } else {
                let senhaBanco = result[0].senha;
                if (senha === senhaBanco) {
                    socket.emit('retorno-login-cliente', {
                        mensagem: 'Login realizado com sucesso!'
                    });
                } else {
                    socket.emit('retorno-login-cliente', {
                        mensagem: 'A senha não corresponde ao email informado.'
                    });
                }
            }
        });
    });

    socket.on('cadastro-cliente', (dados) => {
        let nome = dados.nome;
        let email = dados.email;
        let senha = dados.senha;

        
    });
});

var port = process.env.PORT || 3001;

http.listen(port, function() {
    console.log('Listening in http://localhost:' + port);
});