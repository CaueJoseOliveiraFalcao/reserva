
const express = require("express");
const db = require("../Models");
const jwt = require("jsonwebtoken");
 const Restaurant = db.restaurant;

 const verify_token_each = async (req , res, next) => {
  try {
    const RestaurantToken = req.headers.authorization;

    if (!RestaurantToken) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = RestaurantToken.split(" ")[1].replace(/"/g, "");

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: err.message || "Token inválido" });
      }

      console.log("Token verificado:", decoded);
      req.user = decoded; // Adiciona usuário decodificado
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno do servidor", error: error.message });
  }
};
const verify_token = async (req , res) => {
  try{
    const RestaurantToken = req.headers.authorization;
    if (!RestaurantToken){
      return res.status(409).json({error : 'token nao fornecido' , RestaurantToken})
    }
    const token = RestaurantToken.split(" ")[1].replace(/"/g, ''); 
    jwt.verify(token , process.env.SECRET_KEY , (err , decoded) => {
      if (err) {
        return res.status(409).json({message : 'token invalido'})
      }
      return res.status(200).json({message : 'token valido' , data : decoded})
    })
  }catch(error){
    return res.status(409).json({message : error.message})
  }
}
 const verify_restaurant = async (req, res, next) => {
    try {
      if (!req.body.cnpj || req.body.cnpj.length != 14) {
        return res.status(409).json({ error: "cnpj invalido" });
      } else {
        const cnpj = await Restaurant.findOne({
          where: {
            cnpj: req.body.cnpj,
          },
        });
        if (cnpj){
            return res.status(409).json({ error: "cnpj ja usado" });
        }
      }
  
      const emailcheck = await Restaurant.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (emailcheck) {
        return res.status(409).json({ error: "Email em uso" });
      }
  
      next();
    } catch (error) {
      console.log(error);
    }
  };
 module.exports = {
    verify_restaurant,
    verify_token,
    verify_token_each
};