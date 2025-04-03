//importing modules
const express = require('express')
const userController = require('../Controllers/userController')
const { signup, login } = userController
const userAuth = require('../Middlewares/userAuth')
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { change_profile } = require('../Controllers/userController');

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req , file , cb) => {
        cb(null , 'userUploads')
    }, 
    filename : (req , file , cb) => {
        const uniqueSuffix = req.body.userId;
        const fileExtension = path.extname(file.originalname).toLocaleLowerCase();
        if (fileExtension === '.jpg' || fileExtension == '.png' || fileExtension == '.jpeg') {
            cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
        }
    }
})


const upload = multer({storage});

router.post('/change-profile' , upload.single('profile') , change_profile)

router.post('/signup' , userAuth.verify_client  ,signup);

router.post('/login' , login);

router.get('/user-photo/:id' , photo = (req , res) =>{
    const userId = req.params.id;
    
    const imagePath = path.join(__dirname , '..', 'userUploads' , `profile-${userId}.jpg`);

    if(fs.existsSync){
        res.sendFile(imagePath);
    }else{
        req.status(404).json({message:'imagem nao encontrada'});
    }
});

router.get('/verify-user-token' , userAuth.verify_token);

module.exports = router;