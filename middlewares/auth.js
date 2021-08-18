import jwt from 'jsonwebtoken';
import config from '../config.js';

const auth = async(req,res,next) => {

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedData = jwt.verify(token,config.JWT_KEY);

        req.userData = decodedData;

        next();
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({message:'Auth failed'})
    }

}


export default auth;