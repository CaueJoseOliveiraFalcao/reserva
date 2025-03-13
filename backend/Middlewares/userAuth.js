
const express = require("express");
const db = require("../Models");
 const User = db.users;

 const verify_client = async (req, res, next) => {
  try {
    let cpf = req.body.cpf.trim();


    // Verifique a validade do CPF
    if (cpf.length !== 11) {
      return res.status(409).json({ error: 'CPF inválido' });
    }
  else{
    const cpf = await User.findOne({
      where: {
         cpf: req.body.cpf,
      },
    });
    if (cpf){
      return res.status(409).json({error : 'cpf ja utilizado'});
    }
  }


   const emailcheck = await User.findOne({
     where: {
       email: req.body.email,
     },
   });
   if (emailcheck) {
    return res.status(409).json({error : 'email em uso '});
   }

   next();
 } catch (error) {
   console.log(error);
 }
};
 module.exports = {
    verify_client,
};