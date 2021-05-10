const express = require('express');
const db = require('../db/connection.js');

const router = express.Router();

//Insert 
/*router.post('/insert', (req,res) => {
    let request = req.body;
    console.log(request)
    /*let tableName = request.table;
    let post = request.values; 
    console.log(post)
    //console.log(request.values.length)
    
    var i;
    for(i=0; i< request.values.length; i++)
    {
        let sql = `INSERT INTO ${tableName} SET ?`;
        let query = db.query(sql, post[i], (err, result) => {
            if(err) throw err;
            console.log(result);
            //res.send(result);
        });
    }
    res.end();
});*/

router.post('/insert', (req,res) => {
    let request = req.body;
    console.log(request)
    let tableName = request.table;
    //let post = request.values; 
    
    delete request.table;
    let newPost = request;
    /*const index = newPost.indexOf(tableName);
    if (index > -1) {
        newPost.splice(index, 1);
    }*/
    console.log(newPost);
    //console.log(request.values.length)
    
    let sql = `INSERT INTO ${tableName} SET ?`;
    let query = db.query(sql, newPost, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
});

// Delete product given pid
router.post('/delete', (req, res) => {
    let request = req.body;
    console.log(request);
    let tableName = request.table;
    let paramFilter = request.paramFilter;
    let paramValue = request.paramValue;
    let sql = `DELETE FROM ${tableName} WHERE ${paramFilter} = ${paramValue}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        //console.log("product fetched single\n" + result);
        res.send(result);
    });
});

// Select all
router.post('/getall', (req, res) => {
    let request = req.body;
    console.log(request);
    let tableName = request.table;
    let sql = `SELECT * FROM ${tableName}`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
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

/*
router.get('/getparam', (req, res) => {
    let request = req.body;
    let params = request.params;
    var i;
    var allResults = [];
    for(i = 0; i < params.length; i++)
    {
        let sql = `SELECT * FROM ${params[i].table} WHERE ${params[i].paramFilter} = ${params[i].paramValue}`;
        let query = db.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result[0]);

            console.log(result);
            Array.prototype.push.apply(allResults, result);
            
        });
    }
    console.log(allResults);
    res.send(allResults);
});
*/


/*
//Insert product
router.post('/insertproduct', (req,res) => {
    let post = req.body;
    //console.log(post.product)
    post.product.cost = post.product.current_price * 0.4;
    let sql = `INSERT IGNORE INTO products SET ?`;
    let query = db.query(sql, post.product, (err, result) => {
        if(err) throw err;
        console.log(result);
        //res.send('Product '+ req.body.pname +' added...');
        //delete result.stock;
        res.send(result);
    });
});



// Select all products
router.get('/getproducts', (req, res) => {
    let sql = 'SELECT * FROM products';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        //console.log(results);
        res.send(results);
    });
});

// Select single product
router.get('/getproductid', (req, res) => {
    let sql = `SELECT * FROM products WHERE product_id = ${req.body.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        //console.log("product fetched single\n" + result);
        res.send(result);
    });
});

// Update product stock given attribute id
router.put('/updateproduct', (req, res) => 
{
    let products = req.body.product;
    console.log(products)
    var j
    var sql = `SELECT A.attribute_id, A.stock, P.product_id FROM attribute A, features F, products P WHERE P.product_id = F.product_id AND F.attribute_id = A.attribute_id AND P.product_id = '${products.product_id}'`
    db.query(sql, (error, results) => {
        if(error) throw error;
        console.log(results);
        var att_id = results[0].attribute_id;
        let attID1 = `UPDATE attribute SET stock = ${products.stock} WHERE attribute_id = ${att_id} `;
        let query1 = db.query(attID1, (err, result1) => 
        {
            if(err) throw err;
            console.log(result1);
            res.send(result1);
        });
    });
});
// Delete product given pid
router.post('/deleteproduct', (req, res) => {
    let post = req.body;
    //console.log(post.product)
    let sql = `DELETE FROM products WHERE product_id = ${post.product.product_id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
});

// View Invoices
router.get('/getinvoices', (req, res) => {
    let sql = 'SELECT * FROM invoice';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send(results);
    });
});

// View Invoices history
router.get('/getinvoicehistory', (req, res) => {
    let sql = 'SELECT * FROM invoice_history';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send(results);
    });
});

// View products to be delivered
router.get('/getdeliverylist', (req, res) => {
    let sql = 'SELECT * FROM delivery_list';//If only not delivered ones are needed, change sql statement according to situation
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        //console.log(results);
        res.send(results);
    });
});

// View the addresses for delivery
router.get('/getdeliveryaddresses', (req, res) => {
    let sql = `SELECT * FROM delivery_list WHERE delivery_status != ${2} `;//If only not delivered ones are needed, change sql statement according to situation
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        //console.log(results);
        res.send(results);
    });
});
*/
module.exports = router;

