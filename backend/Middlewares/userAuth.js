
const express = require("express");
const db = require("../Models");
const jwt = require("jsonwebtoken");
 const User = db.Users;

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
const verify_token_next = async (req , res ,next) => {
  try{
    const UserToken = req.headers.authorization;

    if (!UserToken){
      return res.status(409).json({error : 'token nao fornecido' , UserToken})
    }
    const token = UserToken.split(" ")[1].replace(/"/g, ''); 
    jwt.verify(token , process.env.SECRET_KEY , (err , decoded) => {
      if (err) {
        return res.status(409).json({error : 'token invalido'})
      }
      req.user = decoded; 
      next();
    })
  }catch(error){
    return res.status(409).json({message : error.message})
  }
}
const verify_token = async (req , res) => {
  try{
    const UserToken = req.headers.authorization;

    if (!UserToken){
      return res.status(409).json({error : 'token nao fornecido' , UserToken})
    }
    const token = UserToken.split(" ")[1].replace(/"/g, ''); 
    jwt.verify(token , process.env.SECRET_KEY , (err , decoded) => {
      if (err) {
        return res.status(409).json({error : 'token invalido'})
      }
      return res.status(200).json({message : 'token valido' , data : decoded})
    })
  }catch(error){
    return res.status(409).json({message : error.message})
  }
}
 module.exports = {
    verify_client,
    verify_token,
    verify_token_next
};