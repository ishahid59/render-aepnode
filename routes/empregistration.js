const express = require('express');
const Router = express.Router();
const { check, validationResult } = require('express-validator');
const mysqlConnection = require('../connection');

Router.get('/',  (req, res) => {
    let sql = "SELECT list_empregistration.listid, list_empregistration.str1,list_empregistration.str2 FROM list_empregistration WHERE list_empregistration.listid>-1 ORDER BY list_empregistration.listid";
    mysqlConnection.query(sql, (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
})

module.exports = Router;