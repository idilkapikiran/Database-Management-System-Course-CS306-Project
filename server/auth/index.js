const express = require('express');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const path = require('path');
const db = require('../db/connection.js');

//const { reactive } = require('@vue/reactivity');

const router = express.Router(); //like a mini express app

const schema = Joi.object().keys({
    email: Joi.string().regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/).required(),//regexi emiale göre updatelde
    password: Joi.string().trim().min(6).required(),
    // name: Joi.string().min(1),
    // age: Joi.number(),
    // ssn: Joi.string().min(1)
}).options({allowUnknown: true});

/*router.get('/', (req, res) => {
    res.json({
        message: 'Auth router is working'
    });
});*/

router.post('/register', (req, res, next) => 
{
    //const validation = schema.validate(req.body);
    const schemaRes = schema.validate(req.body);
    console.log(schemaRes);
  
    if (schemaRes.error == null) 
    { //check uniqueness of the name
        //console.log("passed schema");
        //console.log(req.body);
        //console.log(req.body.adress);
        let sql = `SELECT email FROM People WHERE email = '${schemaRes.value.email}'`;
        let query = db.query(sql, (err, emails) => 
        {
            //console.log(emails);
            if (err) 
            {
                next(err);
                throw err;//bunu düzenle refresh page
            }
            if (emails.length >= 1)//is in db
            {
                const error = new Error('There is already a user with that e-mail.');
                //res.send(error);
                next(error);
            } 
            else 
            {//hash passwrd
                console.log("username accepted ");
                bcrypt.hash(req.body.password, 3).then(hashedPasswrd => 
                {
                    const newUser = 
                    {//NULL LARI EKLE
                        ssn: req.body.ssn,
                        name: req.body.name ,
                        age: req.body.age,
                        email: req.body.email,
                        password: hashedPasswrd
                    };
                    db.query('INSERT INTO People SET ?', newUser, function (error, results, fields) {
                        if (error) {
                            console.log(newUser);
                            res.send("There was a problem adding the information to the database.");
                        }
                        else {
                            res.redirect("/");
                        }
                    });
                });
            };
        });
    } else{
        res.status(422);
        next(schemaRes.error);
    }
});

router.post('/logout', (req, res) => {
    console.log(req.session.id);
    console.log(req.session);
    req.session.destroy();
    console.log("session D-E-S-T-R-O-Y-E-D");
    res.redirect('http://localhost:8080/index.html')
});

function respondError422(res, next) 
{
   
    const error = new Error('Unable to login.');
    res.status(203).json({
        flag: 1,
        message: "error"
    });
    //res.send("Unable to login");
    //res.redirect('http://localhost:8080/login.html')
    //ext(error);
}

router.post('/login', async function (req, res, next)
{
    console.log(req.body)
    const schemaRes = schema.validate(req.body);
    //console.log(schemaRes)
    if (schemaRes.error == null) 
    {
        var pm;
        console.log("in pm check");
        pm = await pmCheck(schemaRes, req, res);
        console.log("pm check returned: " + pm);
    }
    else {
        respondError422(res);
        }
    
});

async function pmCheck(schemaRes, req, res)
{
    try 
    {
        let sql1 = `SELECT ssn, password FROM People WHERE email = '${schemaRes.value.email}'`
        let query1 = db.query(sql1, (err, res1) =>
        {
            if(res1.length > 0)
            {
                let sql = `SELECT aid FROM Admin WHERE ssn = '${res1[0].ssn}'`;
                let query = db.query(sql, (err, user) =>/*.then(user => */
                {
                    if (user.length > 0)
                    {    //user exists  
                        console.log("3. pm exists\npm: hashed pw is " + user[0].password);
                        bcrypt
                        .compare(req.body.password, res1[0].password).then(isMatch =>
                        {
                            console.log("4. pm: ismatch is " + isMatch);
                            if (!isMatch) {
                                //throw err;
                                console.log("5. err: pm does not match");
                                respondError422(res);
                                return 1;
                            }
                            else {
                                console.log("5. pm: SUCCESFUL")
                                req.session.isLoggedIn = true;
                                //console.log(req.session.id)
                                //req.session.save();
                                //console.log(req.headers)
                                console.log(req.session);
                                console.log(req.session.id);
                                res.json({
                                    flag: 0,
                                    message: "success"
                                });
                                //res.redirect('http://localhost:8080/index.html')
                                //console.log(req.session);
                                //res.send(req.session.isLoggedIn)

                                /*res.writeHead(302, {
                                    Location: 'http://front-end.com:8888/some/path'
                                });
                                res.end();*/
                                //res.redirect("/");
                                return 1;
                            }
                        });
                    } 
                    else {
                        return 0;
                    }
                });
            } else {return 0;}
        });
        //respondError422(res);
        return 0;
    }  catch (e) {
       console.log(e);
       return 0;
      }
}



// async function smCheck(schemaRes, req, res)
// {
//     try
//     {
//         //console.log(schemaRes.value.email)
//         let sql = `SELECT email, passwrd FROM sales_manager WHERE email = '${schemaRes.value.email}'`;
//         let query = db.query(sql, (err, user) =>/*.then(user => */
//         {
           
//             if (user.length > 0) 
//             {    //user exists  
//                 console.log("3. sm exists\nsm: hashed pw is " + user[0].passwrd);
//                 bcrypt
//                 .compare(req.body.password, user[0].passwrd).then(isMatch =>
//                 {
//                     console.log("4. sm: ismatch is " + isMatch);
//                     if (!isMatch) {
//                         //throw err;
//                         console.log("5. err: sm does not match");
//                         respondError422(res);
//                         return 1;
//                     }
//                     else {
//                         console.log("5. sm: SUCCESFUL")
//                         res.json({
//                             isPM: false,
//                             isSM: true,
//                             isUser: false
//                         });
//                         //res.redirect("/");
//                         return 1;
//                     }
//                 });
//             } 
//             else {
//             //respondError422(res, next);
//                 return 0;
//             }
//         });
//         return 0;
//     } catch (e) {
//         console.log(e);
//         return 0;
//        }
// }

async function userCheck(schemaRes, req, res)
{
    try
    {
        //console.log("2.user: passed schema")
        let sql = `SELECT email, password FROM People WHERE email = '${schemaRes.value.email}'`;
        let query = db.query(sql, (err, user) =>/*.then(user => */
        {
            if (user.length > 0) 
            {    //user exists  
                console.log("3. user exists\nuser: hashed pw is " + user[0].passwrd);
                bcrypt
                .compare(req.body.password, user[0].passwrd).then(isMatch =>
                {
                    console.log("4. user: ismatch is " + isMatch);
                    if (!isMatch) {
                        //throw err;
                        console.log("5. err: user does not match");
                        respondError422(res);
                        return 1;
                    }
                    else {
                        console.log("5. user: SUCCESFUL")
                        res.json({
                            isPM: false,
                            isSM: false,
                            isUser: true
                        });
                        //res.redirect("/");
                        return 1;
                    }
                });
            } 
            else {
            respondError422(res);
            }
        });
        return 0;
    }  catch (e) {
    console.log(e);
    return 0;
   }
}

//no frontend
router.get('/login/:email/:password', (req, res, next) => 
{
    const schemaRes = Joi.validate(req.params, schema);
    if (schemaRes.error === null) 
    {
        let sql = `SELECT email, passwrd FROM users WHERE email = '${schemaRes.value.email}'`;
        let query = db.query(sql, (err, user) => 
        {
            if (user) 
            {    //user exists  
                //console.log(user[0].passwrd);
                bcrypt
                .compare(req.params.password, user[0].passwrd, function (err, isMatch)
                {
                    console.log(isMatch);
                    if (err) {
                        //throw err;
                        respondError422(res, next);
                    }
                    else {
                        res.redirect("/");
                    }
                });
            } 
            else {
            respondError422(res, next);
            }
        });
    }
});

module.exports= router;

/*router.post('/login', async function (req, res, next)
{
    console.log(req.body)
    const schemaRes = Joi.validate(req.body, schema);

    if (schemaRes.error === null) 
    {
        this.flag = 2;
        await adminCheck(schemaRes, req, res);
        console.log(this.flag)
        if (this.flag === 0)
        {
            console.log("2. passed schema")
            let sql = `SELECT email, passwrd FROM users WHERE email = '${schemaRes.value.email}'`;
            let query = db.query(sql, (err, user) => 
            {
                if (user.length > 0) 
                {    //user exists  
                    console.log("3. hashed pw is " + user[0].passwrd);
                    bcrypt
                    .compare(req.body.password, user[0].passwrd, function (err, isMatch)
                    {
                        console.log("4. ismatch is " + isMatch);
                        if (err) {
                            //throw err;
                            respondError422(res, next);
                        }
                        else {
                            console.log("5. SUCCESFUL")
                            res.redirect("/");
                        }
                    });
                } 
                else {
                respondError422(res, next);
                }
            });
        }
        else {
            console.log("5. admin SUCCESFUL")
        }
    }
    else {
        respondError422(res);
        }
});


//no frontend
router.get('/register/:email/:password', (req, res, next) => 
{
    const schemaRes = Joi.validate(req.params, schema);
    console.log("in register");
    if (schemaRes.error == null) 
    { //check uniqueness of the name
        console.log("passed schema");
        console.log(req.params.email);
        let sql = `SELECT email FROM users WHERE email = '${schemaRes.value.email}'`;
        let query = db.query(sql, (err, emails) => 
        {
            console.log(emails);
            if (err) 
            {
                next(err);
                throw err;//bunu düzenle refresh page
            }
            if (emails.length >= 1)//is in db
            {
                console.log("username taken");
                const error = new Error('Username is taken. Please choose another one.');
                next(error);
            } 
            else 
            {//hash passwrd
                console.log("username accepted ");
                bcrypt.hash(req.params.password, 3).then(hashedPasswrd => 
                {
                    const newUser = 
                    {//NULL LARI EKLE
                        user_id: null,
                        name: null,
                        email: req.params.email,
                        passwrd: hashedPasswrd,
                        home_address: null,
                        card_info: null
                    };
                    db.query('INSERT INTO users SET ?', newUser, function (error, results, fields) {
                        if (error) {
                            //If it failed, return error
                            console.log(newUser);
                            res.send("There was a problem adding the information to the database.");
                        }
                        else {
                            //If it worked, set the header so the address bar doesn't still say /adduser
                            //res.location("userlist");
                            //And forward to success page
                            res.redirect("/");
                        }
                    });
                });
            };
        });
    } else{
        res.status(422);
        next(schemaRes.error);
    }
});
*/

