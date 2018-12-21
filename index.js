let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let mysql = require('mysql');
let mysqlCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senhamysql',
    database: 'dadosRango'
});
mysqlCon.connect();

io.on('connection', (socket) => {
    console.log("User connected.");

    socket.on('disconnect', function() {
        // todo: fazer gerencimento de desconexão de usuário
        console.log("User disconnected.");
    });

    socket.on('login-vendedor', (dados) => {
        var email = dados.email;
        var senha = dados.senha;

        mysqlCon.query('SELECT email, senha FROM vendedor WHERE email = ?', [email], function(err, result) {
            if (err) throw err;

            if (result.length != 1) {
                socket.emit('retorno-login-vendedor', 1);
            } else {
                var senhaBanco = result[0].senha;
                if (senha === senhaBanco) {
                    socket.emit('retorno-login-vendedor', 0);
                } else {
                    socket.emit('retorno-login-vendedor', 2);
                }
            }
        });
    });

    socket.on('cadastro-vendedor', (dados) => {
        var nomeNegocio = dados.nomeNegocio;
        var cpf = dados.cpf;
        var telefone = dados.telefone;
        var categoriaEstabelecimento = dados.categoriaEstabelecimento;
        var limiteEntrega = dados.limiteEntrega;
        var valorFrete = dados.valorFrete;
        var nomeVendedor = dados.nomeVendedor;
        var sobrenomeVendedor = dados.sobrenomeVendedor;
        var sexo = dados.sexo;
        var email = dados.email;
        var senha = dados.senha;
        var formaPagamento = dados.formaPagamento;

        mysqlCon.query('SELECT * FROM vendedor WHERE cpfVendedor = ?', [cpf], function(err, result) {
            if (err) throw err;

            if (result.length > 0) {
                socket.emit('retorno-cadastro-vendedor', 1);
            } else {
                mysqlCon.query('SELECT * FROM vendedor WHERE email = ?', [email], function(err, result) {
                    if (err) throw err;

                    if (result.length > 0) {
                        socket.emit('retorno-cadastro-vendedor', 2);
                    } else {
                        mysqlCon.query('INSERT INTO vendedor (cpfVendedor, primeiroNome, ultimoNome, email, senha, sexo, limiteEntrega, formaPagamento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                            [cpf, nomeVendedor, sobrenomeVendedor, email, senha, sexo, limiteEntrega, formaPagamento]);
                        socket.emit('retorno-cadastro-vendedor', 0);
                    }
                });
            }
        });
    });

    socket.on('login-cliente', (dados) => {
        var email = dados.email;
        var senha = dados.senha;

        mysqlCon.query("SELECT email, senha FROM cliente WHERE email = ?", [email], function(err, result) {
            if (err) throw err;

            if (result.length != 1) {
                socket.emit('retorno-login-cliente', 1);
            } else {
                var senhaBanco = result[0].senha;
                if (senha === senhaBanco) {
                    socket.emit('retorno-login-cliente', 0);
                } else {
                    socket.emit('retorno-login-cliente', 2);
                }
            }
        });
    });

    socket.on('cadastro-cliente', (dados) => {
        var cpf = dados.cpf;
        var nome = dados.nome;
        var sobrenome = dados.sobrenome;
        var email = dados.email;
        var senha = dados.senha;

        mysqlCon.query('SELECT * FROM cliente WHERE cpfCliente = ?', [cpf], function(err, result) {
            if (err) throw err;

            if (result.length > 0) {
                socket.emit('retorno-cadastro-cliente', 1);
            } else {
                mysqlCon.query('SELECT * FROM cliente WHERE email = ?', [email], function(err, result) {
                    if (err) throw err;

                    if (result.length > 0) {
                        socket.emit('retorno-cadastro-cliente', 2);
                    } else {
                        mysqlCon.query('INSERT INTO cliente (cpfCliente, primeiroNome, ultimoNome, email, senha) VALUES (?, ?, ?, ?, ?)',
                            [cpf, nome, sobrenome, email, senha]);
                        socket.emit('retorno-cadastro-cliente', 0);
                    }
                });
            }
        });
    });

    socket.on('pesquisa-produto', (dados) => {
        var textoPesquisa = dados.textoPesquisa;

        mysqlCon.query('SELECT nome, preco FROM produto WHERE LOWER(nome) LIKE ?', ['%' + textoPesquisa.toLowerCase() + '%'], function(err, result) {

            if (err) throw err;

            var retorno = [];
            for (i = 0; i < result.length; i++) {
                var linha = result[i];
                retorno.push({
                    nome: linha.nome,
                    preco: linha.preco,
                    nomeEstabelecimento: 'Estabelecimento X'
                });
            }

            socket.emit('retorno-pesquisa-produto', retorno);
        });
    });

    socket.on('cadastro-produto', (dados) => {
        var nome = dados.nome;
        var preco = dados.preco;
        var tempoMedioPreparo = dados.tempoMedioPreparo;
        var descricao = dados.descricao;
        var disponivel = dados.disponivel;

        if (disponivel) {
            disponivel = 'S'
        } else {
            disponivel = 'N'
        }

        mysqlCon.query('INSERT INTO produto (nome, descrição, preco, disponivel) VALUES (?, ?, ?, ?)',
            [nome, descricao, preco, disponivel]);
        
        socket.emit('retorno-cadastro-produto', 0); // sucesso
    });
});

var port = process.env.PORT || 3001;

http.listen(port, function() {
    console.log('Listening in http://localhost:' + port);
});