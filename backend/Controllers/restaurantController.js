const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const { use } = require("../Routes/userRoutes");

const Restaurant = db.restaurant


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

        return res.status(201).send(restaurant);
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
   
   module.exports = {
    signup,
    login,
   };