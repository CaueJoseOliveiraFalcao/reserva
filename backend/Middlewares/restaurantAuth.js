
const express = require("express");
const db = require("../Models");
 const Restaurant = db.restaurant;

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
};