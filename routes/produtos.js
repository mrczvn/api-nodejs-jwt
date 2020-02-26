const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');

const ProdutosController = require('../controllers/produtos-controllers')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
});

router.get('/', ProdutosController.getProdutos);
router.post('/', login.opcional, ProdutosController.postProdutos);
router.get('/:id_produto', ProdutosController.getUmProduto);
router.put('/:id_produto', login.opcional, ProdutosController.updateProduto);
router.delete('/:id_produto', login.opcional, ProdutosController.deleteProduto);

module.exports = router;
