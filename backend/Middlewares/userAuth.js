
const express = require("express");
const db = require("../Models");
 const User = db.users;

 const verify_client = async (req, res, next) => {
 try {
   const cpf = await User.findOne({
     where: {
        cpf: req.body.cpf,
     },
   });
   if (cpf) {
     return res.json(409).send("cpf already taken");
   };
   const emailcheck = await User.findOne({
     where: {
       email: req.body.email,
     },
   });
   if (emailcheck) {
     return res.json(409).send("Email taken");
   }

   next();
 } catch (error) {
   console.log(error);
 }
};
 module.exports = {
    verify_client,
};