const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const { use } = require("../Routes/userRoutes");

const User = db.users


const signup = async (req , res) => {
    try{
        const {name , email , cpf , password , phone} = req.body
        const data = {
            name,
            email,
            cpf,
            password : await bcrypt.hash(password , 10),
            phone
        };

        const user = await User.create(data);


        if (user) {
            let token = jwt.sign({id : user.id} , process.env.SECRET_KEY , {
                expiresIn: 1 * 24 * 60 * 60 * 1000,
            })


        res.cookie("jwt" , token ,{ maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log('user' , JSON.stringify(user, null , 2))
        console.log("token" , token);

        return res.status(201).send(user);
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

      const user = await User.findOne({
        where: {
        email: email
      } 
      
      });
      const find = await User.findAll();
      console.log(find);
   
      if (user) {
        const isSame = await bcrypt.compare(password, user.password);
        if (isSame) {
          let token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
            expiresIn: 1 * 24 * 60 * 60 * 1000,
          });
   
          res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
          console.log("user", JSON.stringify(user, null, 2));
          console.log(token);
          return res.status(201).send(user);
        } else {
          return res.status(401).send("Credenciais Invalidas");
        }
      } else {
        return res.status(401).send("Credenciais Invalidas");
      }
    } catch (error) {
      console.log(error);
    }
   };
   
   module.exports = {
    signup,
    login,
   };