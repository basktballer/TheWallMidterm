"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/register", (req, res) => {
    const {first_name, last_name, username, email, password, avatar} = req.body;
    let id = 0;
    // User Max Number Incrementer, USED FOR DEVELOPMENT ONLY!!!
    knex('users').max('id')
      .then((results) => {
        id = results[0].max + 1;
        const userDetailsArr = [{id: id, first_name: first_name, last_name: last_name , username: username, email: email , password: password, avatar: avatar }]
        knex('users')
          .insert(userDetailsArr)
          .then(() => console.log(`Person added. First Name: ${userDetailsArr[0].first_name}, Last Name: ${userDetailsArr[0].last_name}, username: ${userDetailsArr[0].username}, avatar: ${userDetailsArr[0].avatar}`))
          .catch((err) => { console.log(err); throw err })
          .finally(() => {
              knex.destroy();
          }); 
      });
    //
    });       
  // login
  router.put("/login", (req, res) => {
    console.log(req.body);
    knex
      .select("*")
      .from("users")
      .where(`username=${req.body.user.username}`)
      .then((err, results) => {

        if(err){ return res.status(400).json({ error: 'User not found'}); }

        const {id, username, password, avatar} = results;

        if(password === req.body.user.password){
        // if(bcrypt.compareSync( password, req.body.user.password)){
          req.session.user_id = id;
          return res.status(200).json({id, username, avatar});
        }

        return res.status(400).json({ error: 'Incorrect password'});
    });
  });

  // logout
  router.put('/logout', (req, res) => {
    req.session.user_id = '';
    return res.status(200);
  });

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });



  return router;
}
