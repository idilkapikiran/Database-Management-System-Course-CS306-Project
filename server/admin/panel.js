const express = require('express');
const db = require('../db/connection.js');

const router = express.Router();

router.post('/insert', (req,res) => {
    
    try {
        console.log(req.session);
        console.log(req.session.id);
        //console.log(req.body);
        if(req.session.isLoggedIn)
        {
            let request = req.body;
            console.log(request)
            let tableName = request.table;
            
            delete request.table;
            let newPost = request;
            console.log(newPost);
            
            let sql = `INSERT INTO ${tableName} SET ?`;
            let query = db.query(sql, newPost, (err, result) => {
                if(err) res.status(400).json({
                    message: "invalid input",
                    flag: 1,
                });
                else{
                    console.log(result);
                    res.status(200).json({
                        message: "success",
                        result: result,
                        flag: 0,
                    });
                }
            });
        }
        else {
            console.log("unauthorized insert attempt");
            //res.redirect('http://localhost:8080/index.html');
            res.status(203).json({
                message: "error",
                flag: 2,
            });
        }
    } catch (error) {
        res.status(203).json({
            message: "error",
            flag: 2,
        });
    }
    
});

router.post('/delete', (req, res) => {
    try {
        if(req.session.isLoggedIn)
        {
            let request = req.body;
            console.log(request);
            let tableName = request.table;
            let paramFilter = request.paramFilter;
            let paramValue = request.paramValue;
            let sql = `DELETE FROM ${tableName} WHERE ${paramFilter} IN (${paramValue})`;
            let query = db.query(sql, (err, result) => {
                if(err) res.status(400).json({
                    message: "invalid input",
                    flag: 1,
                });
                //console.log("product fetched single\n" + result);
                else{
                    console.log(result);
                    res.status(200).json({
                        message: "success",
                        result: result,
                        flag: 0,
                    });
                }
            });
        }
        else {
            console.log("unauthorized delete attempt");
            //res.redirect('http://localhost:8080/index.html');
            res.status(203).json({
                message: "error",
                flag: 2,
            });
        }
    } catch (error) {
        res.status(203).json({
            message: "error",
            flag: 2,
        });
    }
});

// Select all
router.post('/getall', (req, res) => {
    try {
        let request = req.body;
        //console.log(req.headers);
        //console.log(req.session);
        
        console.log(request)
        console.log(req.session.id);
        let tableName = request.table;
        let sql = `SELECT * FROM ${tableName}`;
        let query = db.query(sql, (err, results) => {
            if(err) {
                res.status(400).json({
                message: "error",
            });
            }
            else if(results.length > 0){
                res.status(200).json({
                    message: "success",
                    result: results,
                    flag: 0,
                });
            }
            else{
                console.log("2")
                res.status(400).json({
                    message: "error",
                });
            }
    });
    } catch (error) {
        console.log("3")
        res.status(400).json({
            message: "error",
        });
    }
});

router.post('/getByFilter', (req, res) => {
    try {
        let request = req.body;
        console.log(request);
        var filters = request.filters;
        var values = request.values;
        var tableName = request.table;
        var mySQL ="";
        console.log(typeof(values[0]));
        if(typeof(values[0]) == typeof("this is a string"))
        {
            mySQL = `SELECT * FROM ${tableName} WHERE ${filters[0]} = '${values[0]}'`;
        }
        else{
            mySQL = `SELECT * FROM ${tableName} WHERE ${filters[0]} >= ${values[0][0]} AND ${filters[0]} <= ${values[0][1]}`;
        }
        var myWhere = "";
        for(var i=1;i<filters.length;i++)
        {
            if(!isNaN(values[i][0]))
            {
                var tempStr = ` AND ${filters[i]} >= ${values[i][0]} AND ${filters[i]} <= ${values[i][1]}`;
                myWhere += tempStr;
            }
            else{
                var tempStr = ` AND ${filters[i]} = '${values[i]}'`;
                myWhere += tempStr;
            }
        };
        mySQL+=myWhere;
        console.log(mySQL);
        let query = db.query(mySQL, (err, results) => {
            if(err) {
                res.status(400).json({
                    message: "invalid input",
                });
                //console.log("error")
            }
            else if(results == null || results.length <= 0) 
            {
                res.status(400).json({
                    message: "invalid input",
                });
                //console.log("1")
            }
            else {
                res.status(200).json({
                    message: "success",
                    flag:0,
                    result: results,
                });
                //console.log(Object.keys(results[0]))
            } 
        
        });
    } catch (error) {
        res.status(400).json({
            message: "error",
        });
    }
    
});

router.post('/getStudents', (req, res) => {
    let request = req.body;
    console.log(request);
    var tableName = 'Student_registered_to';
    let sql = `SELECT * FROM ${tableName}`;
    let query = db.query(sql, (err, results) => {
        if(err) res.status(400).json({message: "error"});
        if(results.length > 0)
        {
            res.status(200).json({
                message: "success",
                rows: ["f_name","sid","major","minor","degree","GPA","ssn"],
                qData: results,
            });
        }
        else res.status(400).json({message: "error"});
    });
});

//filter 
router.post('/getparam', (req, res) => {
    let request = req.body;
    console.log(request);
    let tableName = request.table;
    let paramFilter = request.paramFilter;
    let paramValue = request.paramValue;
    let sql = `SELECT * FROM ${tableName} WHERE ${paramFilter} = ${paramValue}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        //console.log("product fetched single\n" + result);
        console.log(result);
       /* obj = result;
        let result1 = '<table>';
        for (let el in obj) {
          result1 += "<tr><td>" + el + "</td><td>" + obj[el] + "</td></tr>";
        }
        result1 += '</table>';*/
      
        res.send(result);
        
        //res.send(result);
    });
});

module.exports = router;

