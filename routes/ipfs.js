var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var router = express.Router();
const { ipfsID, addFile } = require("../public/javascripts/ipfs-connector")

router.get('/id', async function (req, res, next) {
  let id = await ipfsID();
  res.send(id);
});

router.post('/add', async function (req, res, next) {
  let result = {};

  new formidable.IncomingForm().parse(req)
    .on('field', (name, field) => {
      console.log('Field', name, field);
    })
    .on('file', async (name, file) => {
      console.log('Uploaded file', name, file);
      result = await addFile(file);
    })
    .on('aborted', () => {
      console.error('Request aborted by the user');
    })
    .on('error', (err) => {
      console.error('Error', err);
      throw err;
    })
    .on('end', () => {
      res.send(result);
      res.end();
    })
});

module.exports = router;
