const express = require('express');
const Router = express.Router();
const { check, validationResult } = require('express-validator');
const mysqlConnection = require('../connection');


Router.get('/:empid',  (req, res) => {
    // let sql = "SELECT emp_degree.id, emp_degree.degree as str1,emp_degree.empid FROM emp_degree WHERE emp_degree.empid=? ORDER BY emp_degree.id";

    let sql = "SELECT emp_degree.empid, list_empdegree.str1 FROM emp_degree INNER JOIN list_empdegree ON emp_degree.degree=list_empdegree.listid WHERE emp_degree.empid=?";

    mysqlConnection.query(sql,req.param("empid"), (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
})



// used with angular 20221130 with angular-datatable for emp degree
// Search Datatable severside code
// *******************************************************************************************************
    
// Router.post('/search/angular-datatable',authenticateToken, function (req, res) { // with local auth
// Router.post('/empdegree-angular-datatable/:empid', function (req, res) {
    Router.post('/empdegree-angular-datatable', function (req, res) { // sending empid in body now

        console.log(req.body);
        // return;

        let draw = req.body.draw;
        let limit = req.body.length;
        let offset = req.body.start;
        // let ordercol = req.body['order[0][column]'];
        let ordercol = req.body.order[0].column;//changed 20221130 for angular
        // let orderdir =  req.body['order[0][dir]'];
        let orderdir = req.body.order[0].dir;//changed 20221130 for angular
        let search = req.body.search.value;
        // let search = req.body['search[value]'];

    
        // to get the column name from index since dtable sends col index
        var columns = {
            0: 'empid',
            1: 'str1',
         }
    
        var totalData = 0;
        var totalbeforefilter = 0;
        var totalFiltered = 0;
        var col = columns[ordercol];// to get name of order col not index
    
        // For Getting the TotalData without Filter
        let sql1 = `SELECT * FROM emp_degree WHERE emp_degree.id>0`;
        mysqlConnection.query(sql1, (err, rows, fields) => {
            totalData = rows.length;
            totalbeforefilter = rows.length;
        });
    
        // let sql = `SELECT emp_main.empid, emp_main.firstname, emp_main.lastname, list_empjobtitle.str1 AS jobtitle, \
        // list_empregistration.str1 AS registration, emp_main.consultant, emp_main.hiredate, emp_main.created_at, \
        // emp_main.updated_at FROM emp_main INNER JOIN list_empjobtitle ON emp_main.jobtitle = list_empjobtitle.listid \
        // INNER JOIN list_empregistration on emp_main.registration=list_empregistration.listid WHERE emp_main.empid>0`

        // let sql = "SELECT emp_degree.empid, list_empdegree.str1 FROM emp_degree INNER JOIN list_empdegree ON emp_degree.degree=list_empdegree.listid WHERE emp_degree.empid=?"
        let sql = "SELECT emp_degree.empid, list_empdegree.str1 FROM emp_degree INNER JOIN list_empdegree ON emp_degree.degree=list_empdegree.listid WHERE emp_degree.empid="+req.body.empid;

        if (search == "") {
            console.log("No Search");
            sql = sql + ` order by ${col} ${orderdir} limit ${limit} offset ${offset} `;
            console.log(sql);
            mysqlConnection.query(sql, (err, rows, fields) => {
                
                if (!err) {
                    totalFiltered = rows.length; //totalbeforefilter
                    res.json({
                        "draw": draw,
                        "recordsTotal": totalFiltered, //totalData,
                        "recordsFiltered": totalFiltered,
                        "data": rows
                    });
                }
                else {
                    console.log(err);
                }

                // if (!err) {

                //     if (!filterpresent) {
                //         totalFiltered = totalbeforefilter;
                //     }
                //     else{
                //         totalFiltered = rows.length;
                //     }
                //     res.json({
                //         "draw": draw,
                //         "recordsTotal": totalData,
                //         "recordsFiltered": totalFiltered,
                //         "data": rows
                //     });
                // }
                // else {
                //     console.log(err);
                // }

            });
    
        } else {
            console.log(sql);
            sql = sql + ` AND list_empdegree.str1 LIKE '%${search}%'`;
    
            mysqlConnection.query(sql, (err, rows, fields) => {
                if (!err) {
                    totalFiltered = rows.length
                    res.json({
                        "draw": draw,
                        "recordsTotal": totalFiltered, //totalData,
                        "recordsFiltered": totalFiltered,
                        "data": rows
                    });
                }
                else {
                    console.log(err);
                }
                
            });
    
        } // end else
    });
    









module.exports = Router;