const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastrarUsuario = (req, res, next) => {
  // select * from usuarios;
  mysql.getConnection((error, conn) => {
    if (error) res.status(500).send(error)
    conn.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [req.body.email],
      (error, result) => {
        if (error) res.status(500).send(error)
        if (result.length > 0) {
          res.status(409).send({ mensagem: 'Usuário já cadastrado' })
        } else {
          bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
            if (errBcrypt) res.status(500).send({ error: errBcrypt })
            conn.query(
              `INSERT INTO usuarios (email, senha) VALUES (?,?)`,
              [req.body.email, hash], (error, result) => {
                conn.release();
                if (error) res.status(500).send(error)
                const { insertId } = result;
                const { email } = req.body;
                const response = {
                  mensagem: 'Usuário criado com sucesso',
                  usuarioCriado: {
                    id_usuario: insertId,
                    email
                  }
                }
                return res.status(201).send(response)
              })
          });
        }
      })
  });
};

exports.login = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) res.status(500).send(error)
    const query = `SELECT * FROM usuarios WHERE email = ?`;
    conn.query(query, [req.body.email], (error, results, field) => {
      conn.release();
      if (error) res.status(500).send(error)
      if (results.length < 1) {
        return res.status(401).send({ mensagem: 'Falha na autenticação' })
      }
      bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
        if (err) res.status(401).send({ mensagem: 'Falha na autenticação' })
        if (result) {
          const token = jwt.sign({
            id_usuario: results[0].id_usuario,
            email: results[0].email
          }, process.env.JWT_KEY,
            {
              expiresIn: "1h"
            });
          return res.status(200).send({
            success: true,
            token: token
          })
        }
        return res.status(401).send({ mensagem: 'Falha na autenticação' })
      })
    })
  })
};
