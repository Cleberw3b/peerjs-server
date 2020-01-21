var express = require('express');
var router = express.Router();
const { ipfsID, addFile, listDir, getFile } = require("../public/javascripts/ipfs-connector")

/* GET home page. */
router.get('/', function (req, res, next) {
  // let id = ipfsID();
  // res.send({ id });
  res.send("hi there!");
});

router.post('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
