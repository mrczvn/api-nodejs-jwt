const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');
const rotaUsuarios = require('./routes/usuarios');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false })); // APENAS DADOS SIMPLES
app.use(express.json()); // JSON NA ENTRADA DO BODY
app.use(cors())

app.options('*', cors());

app.use('/pedidos', rotaPedidos);
app.use('/produtos', rotaProdutos);
app.use('/usuarios', rotaUsuarios);

app.use((req, res, next) => {
  const erro = new Error('Não encontrado');
  erro.status = 404;
  next(erro);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    erro: {
      mensagem: error.message
    }
  });
});

module.exports = app;
