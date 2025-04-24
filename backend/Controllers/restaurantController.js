const bcrypt = require("bcryptjs");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const { use } = require("../Routes/userRoutes");
const multer = require('multer');
const { where } = require("sequelize");

const upload = multer({dest : 'uploads/'});
const Restaurant = db.Restaurant


const signup = async (req , res) => {
    try{
        const {name , email , cnpj ,address, password , phone} = req.body
        const data = {
            name,
            email,
            cnpj,
            password : await bcrypt.hash(password , 10),
            address,
            phone,
        };
        
        const restaurant = await Restaurant.create(data);


        if (restaurant) {
            let token = jwt.sign({id : restaurant.id} , process.env.SECRET_KEY , {
                expiresIn: 1 * 24 * 60 * 60 * 1000,
            })


        res.cookie("jwt" , token ,{ maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log('user' , JSON.stringify(restaurant, null , 2))
        console.log("token" , token);

        return res.status(201).send([restaurant , token]);
        } else {
            return res.status(500).send('incorrect details');
        }
    }catch(err){
        console.log(err);
    }
};

const login = async (req, res) => {
    try {
   const { email, password } = req.body;

      const restaurant = await Restaurant.findOne({
        where: {
        email: email
      } 
      
      });
      if(!restaurant){
        return res.status(401).json({ error: 'credenciais invalidas' });
      }
      if (restaurant) {
        const isSame = await bcrypt.compare(password, restaurant.password);
        if (isSame) {
          let token = jwt.sign({ id: restaurant.id }, process.env.SECRET_KEY, {
            expiresIn: 1 * 24 * 60 * 60 * 1000,
          });
   
          res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
          console.log("user", JSON.stringify(restaurant, null, 2));
          console.log(token);
          return res.status(201).send([restaurant , token]);
        } else {
          return res.status(401).json({ error: 'credenciais invalidas' });
        }
      } else {
        return res.status(401).json({ error: 'credenciais invalidas' });
      }
    } catch (error) {
        return res.status(500).send(error);
    }
   };
   const change_profile = async (req , res) =>{
    try{
      const user = await  Restaurant.findOne({
        where : {
          id : req.body.userId
        }
      })
      user.name = req.body.userName
      user.address = req.body.address
      user.phone = req.body.phone
      user.profile_picture = `http://localhost:8000/api/restaurant/restaurant-photo/${user.id}`;
      await user.save();
    res.status(200).json({message : 'usuario alterado'})
    }catch(err){
      res.status(404).json({message : 'usuario nao encontrado'})
    }
   };
   
   module.exports = {
    signup,
    login,
    change_profile,
   };