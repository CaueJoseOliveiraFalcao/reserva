//importing modules
const express = require('express')
const restaurantController = require('../Controllers/restaurantController')
const { signup, login , change_profile } = restaurantController
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const restaurantAuth = require('../Middlewares/restaurantAuth')

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'restaurantsUploads/'); // Define a pasta onde os arquivos serão salvos
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = req.body.userId;
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (fileExtension === '.jpg' || fileExtension === '.png' || fileExtension === '.jpeg'){
            cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
        }

    }
});

const upload = multer({ storage });

router.post('/signup' , restaurantAuth.verify_restaurant  ,signup);

router.post('/login' , login);


router.get('/restaurant-photo/:id' , photo = (req , res) =>{
    restaurantId = req.params.id;
    
    const imagePath = path.join(__dirname , '..', 'restaurantsUploads' , `profile-${restaurantId}.jpg`);

    if(fs.existsSync){
        res.sendFile(imagePath);
    }else{
        req.status(404).json({message:'imagem nao encontrada'});
    }
});

router.get('/verify-restaurant-token'  , restaurantAuth.verify_token);


router.post('/change-profile' ,upload.single('profile'), change_profile);

module.exports = router;