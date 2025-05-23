const bcrypt = require("bcryptjs");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const { use } = require("../Routes/userRoutes");
const multer = require('multer');
const { where, BOOLEAN } = require("sequelize");

const upload = multer({dest : 'uploads/'});
const Restaurant = db.Restaurant
const User = db.Users;

const showR = async (req , res) => {
    const { userId } = req.query;
    try {
      const user = await User.findOne({
        where : {id : userId}
      })

      if (user) {
        const AllRestaurants = await Restaurant.findAll()
        return res.status(200).send(AllRestaurants);
      }else{
        return res.status(404).send('Usuario nao encontrado');
      }
    } catch (error) {
      return res.status(500).send('Server error');
    }

}
const signup = async (req , res) => {
    try{
        const {name , email , cnpj ,address, password , phone , time , auto_close_time_permanence} = req.body
        const data = {
            name,
            email,
            cnpj,
            password : await bcrypt.hash(password , 10),
            address,
            phone,
            default_time_permanence : time,
            auto_close_time_permanence,
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
    const userId = req.body.userId;
    try{
      const user = await Restaurant.findOne({
        where : {
          id : userId
        }
      })
      user.name = req.body.userName
      user.address = req.body.address
      user.phone = req.body.phone
      user.default_time_permanence = req.body.defaultTimePermanence;
      user.auto_close_time_permanence = req.body.autoCloseTimePermanence === "true" ? true : false;
      user.profile_picture = `http://localhost:8000/api/restaurant/restaurant-photo/${user.id}`;
      await user.save();
    res.status(200).json({message : 'usuario alterado'})
    }catch(err){
      console.log(err);
      res.status(404).json({message : 'usuario nao encontrado'})
    }
   };
   
   module.exports = {
    showR,
    signup,
    login,
    change_profile,
   };