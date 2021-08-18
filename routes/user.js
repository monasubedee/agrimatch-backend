import express from 'express';
import { checkPhoneNumber, signinUser, signupUser, getNumberOfUsers } from '../controllers/user.js';
import config from '../config.js';
import multer from 'multer';
import auth from '../middlewares/auth.js';


const router = express.Router();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
       // const imgPath = file.fieldname === 'proPic' ? config.PROPIC_URL : config.GPA_CERT_URL;
        cb(null, "./images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);

    }
});


const fileFilter = (req, file, cb) => {
    const mimeType = file.mimetype;
   
    // if(mimeType.startsWith("image/")){
    //     return cb(null,true);
    // }

    if(mimeType == "image/png" || mimeType == "image/jpg" || mimeType == "image/jpeg"){
        return cb(null,true);
    }
    
    else {
        return cb(new Error(mimeType + ' files are not allowed.'), false)
    }
}

const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 524288000
    }
});

const cpUpload = upload.fields([{ name: 'proPic', maxCount: 1 }, { name: 'gpaCertPic', maxCount: 1 }])

router.post('/checkPhNumber', checkPhoneNumber);

router.post('/signup', cpUpload, signupUser);

router.post('/signin',signinUser);

router.get('/getUserCount',auth, getNumberOfUsers);




export default router;
