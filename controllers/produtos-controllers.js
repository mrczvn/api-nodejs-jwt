const mysql = require('../mysql').pool;

exports.getProdutos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.status(500).send({ error })
    conn.query(
      'SELECT * FROM produtos;',
      (error, result, field) => {
        conn.release();
        if (error) res.status(500).send({ error })
        const response = {
          quantidade: result.length,
          produtos: result.map(prod => {
            let { id_produto, nome, preco } = prod;
            return {
              id_produto,
              nome,
              preco,
              request: {
                tipo: 'GET',
                descrição: 'Retorna os detalhes de um produto específico',
                url: `http://localhost:3000/produtos/${id_produto}`,
              }
            }
          })
        }
        return res.status(200).send(response)
      }
    )
  })
};

exports.postProdutos = (req, res, next) => {
  console.log(req.usuario);
  mysql.getConnection((error, conn) => {
    if (error) res.status(500).send({ error })
    conn.query(
      'INSERT INTO produtos (nome, preco) VALUES (?,?)',
      [req.body.nome, req.body.preco],
      (error, result, field) => {
        conn.release();
        if (error) res.status(500).send({ error })
        let { id_produto } = result;
        let { nome, preco } = req.body;
        const response = {
          id_produto,
          nome,
          preco,
          request: {
            tipo: 'POST',
            descrição: 'Insere um Produto',
            url: `http://localhost:3000/produtos`
          }
        }
        return res.status(201).send(response);
      }
    )
  });
};

exports.getUmProduto = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) res.status(500).send({ error })
    conn.query(
      'SELECT * FROM produtos WHERE id_produto = ?;',
      [req.params.id_produto],
      (error, result, field) => {
        conn.release();
        if (error) res.status(500).send({ error })

        if (!result.length) {
          return res.status(404).send({
            mensagem: 'Não foi encontrado produto com este ID'
          })
        }
        const response = {
          produto: {
            id_produto: result[0].id_produto,
            nome: result[0].nome,
            preço: result[0].preco,
            request: {
              tipo: 'GET',
              descrição: 'Retorna todos os produtos',
              url: 'http://localhost:3000/produtos'
            }
          }
        }
        return res.status(200).send(response)
      }
    )
  });
};

exports.updateProduto = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) res.status(500).send({ error })
    conn.query(
      `UPDATE produtos
        SET nome       = ?,
            preco      = ?
      WHERE id_produto = ?`,
      [req.body.nome, req.body.preco, req.params.id_produto],
      (error, result, field) => {
        conn.release();
        if (error) res.status(500).send({ error })
        let { id_produto } = req.params;
        let { nome, preco } = req.body;
        const response = {
          mensagem: 'Produto atualizado com sucesso',
          produtoAtualizado: {
            id_produto,
            nome,
            preco,
            request: {
              tipo: 'GET',
              descrição: 'Retorna os detalhes de um produto específico',
              url: `http://localhost:3000/produtos/${id_produto}`
            }
          }
        }
        return res.status(202).send(response)
      }
    )
  })
};

exports.deleteProduto = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) res.status(500).send({ error })
    conn.query(
      'DELETE FROM produtos WHERE id_produto = ?',
      [req.params.id_produto],
      (error, result, field) => {
        conn.release();
        if (error) res.status(500).send({ error })
        const response = {
          mensagem: 'Produto removido com sucesso',
          request: {
            tipo: 'POST',
            descrição: 'Insere um produto',
            url: 'http://localhost:3000/produtos',
            body: {
              nome: "String",
              preco: "Number"
            }
          }
        }
        return res.status(202).send(response);
      }
    )
  });
};