drop database if exists dadosrango;
create database dadosRango;

use dadosRango;

/*Tabelas de dados:*/


Create Table Cliente(
	cpfCliente varchar(20) not null, 
	primeiroNome varchar(20),
    ultimoNome varchar (20),
	email varchar(40) not null, 
	senha varchar(40) not null, 
    sexo enum('H','M'),
	foto blob, 
	descricao varchar (200), 
	constraint pk_cpfCliente primary key(cpfCliente)
);

Create Table Vendedor(
	cpfVendedor varchar(20) not null, 
	primeiroNome varchar(20),
    ultimoNome varchar (20),
	email varchar(40) not null, 
	senha varchar(40) not null,
    sexo enum('H','M'),
	limiteEntrega float, 
	formaPagamento varchar(40), 
	foto blob, 
	descricao varchar (40), 
	constraint pk_cpfVendedor primary key(cpfVendedor)
);

create table Telefone(
	codTelefone int auto_increment , 
	telefone int, 
	cpf_dono double,
	constraint pk_Telefone primary key(codTelefone)
);
                       
create table Produto(
	idProduto int(8) auto_increment, 
	nome varchar(20), 
	categoria varchar(40), 
	descrição varchar(40),
	disponivel enum ('S','N'), 
	preco float, 
	foto blob, 
	fk_CpfVendedor varchar(20), 
	foreign key(fk_CpfVendedor) references Vendedor(cpfVendedor),
	constraint pk_idProduto primary key(idProduto)
);
                      
create table Pagamento(

	idPagamento int(8) auto_increment, 
	valor float, 
	formaPagamento varchar (40), 
	dataPagamento date,
	horaPagamento time,
	constraint pk_Pagamento primary key (idPagamento)
);
                      
create table Pedido(
	idPedido int(8) auto_increment, 
	statusPedido enum('PE','PR'), 
	valor float, 
	horario time, 
	dataPedido date,
	fk_CpfVendedor varchar(20), 
	fk_CpfCliente varchar(20), 
	fk_IdPagamento int(8), 
	foreign key(fk_CpfVendedor) references Vendedor(cpfVendedor),
	foreign key(fk_CpfCliente) references Cliente(cpfCliente), 
	foreign key(fk_IdPagamento) references Pagamento(idPagamento), 
	constraint pk_Pedido primary key(idPedido)
);
                    
create table Avaliação(
	idAvaliacao int(8) auto_increment, 
	avaliacao varchar(40), 
	nota int(10),
	fk_CpfVendedor varchar(20), 
	fk_CpfCliente varchar(20), 
	foreign key(fk_CpfVendedor) references Vendedor(cpfVendedor),
	foreign key(fk_CpfCliente) references Cliente(cpfCliente),
    constraint pk_Avaliação primary key(idAvaliacao)
);
                       
create table Carteira(
	idCarteira int(8) auto_increment, 
	fk_CpfVendedor varchar(20), 
	fk_IdPedido int(8), 
	foreign key(fk_CpfVendedor) references Vendedor(cpfVendedor), 
	foreign key(fk_IdPedido) references Pedido(idPedido),
	constraint pk_Carteira primary key(idCarteira)
);   

create table Endereco(
	idEndereco int(8) auto_increment, 
	cep int, 
	cidade varchar(40), 
	bairro varchar(40), 
	numero varchar(40), 
	nome varchar(40),
	fk_CpfVendedor varchar(20), 
	foreign key(fk_CpfVendedor) references Vendedor(cpfVendedor),
	constraint pk_Endereco primary key(idEndereco)
);
					
create table Administrador(
	cpfAdmin int not null, 
	nome varchar(40), 
	email varchar(40) not null, 
	senha varchar(40) not null, 
	constraint pk_Administrador primary key(cpfAdmin)
);










create table BaneVendedor(fk_CpfVendedor varchar(20), fk_CpfAdmin int, motivacao varchar(40), foreign key(fk_CpfVendedor) references Vendedor(cpfVendedor),
						  foreign key(fk_CpfAdmin) references Administrador(cpfAdmin), primary key(fk_CpfAdmin, fk_CpfVendedor));
                          
create table BaneCliente(fk_CpfCliente varchar(20), fk_CpfAdmin int, motivacao varchar(40), foreign key(fk_Cpfcliente) references Cliente(cpfCliente),
						  foreign key(fk_CpfAdmin) references Administrador(cpfAdmin), primary key(fk_CpfAdmin, fk_CpfCliente));



