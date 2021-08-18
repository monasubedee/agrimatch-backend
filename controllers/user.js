import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import sharp from 'sharp';
import mongoose from 'mongoose';
import Media from '../models/media.js';
import Location from '../models/location.js';
import config from '../config.js';


export const checkPhoneNumber = async (req, res) => {
    const { phoneNumber, userType } = req.body;
    try {
        const user = await User.find({ phoneNumber, userType }).exec();

        if (user && user.length >= 1) {
            return res.status(409).json({ message: 'Phone number exists.' })
        }
        return res.status(200).json({ message: 'OK' });

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ err });
    }
}

export const signupUser = async (req, res) => {
    const { phoneNumber, name, userType, password, email, latitude, longitude, gpaCertNo } = req.body;
    const proPic_file = req.files["proPic"] && req.files["proPic"].length > 0 ? req.files["proPic"][0] : undefined;

    const gpaCert_file = req.files["gpaCertPic"] && req.files["gpaCertPic"].length > 0 ? req.files["gpaCertPic"][0] : undefined;

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        phoneNumber,
        userType,
        password,
        email,
        name
    });

    if (userType === "Farmer" && gpaCertNo !== undefined && gpaCertNo.trim().length > 0) {
        user.gpaCertNo = gpaCertNo;
    }
    if (userType === "Farmer" && gpaCert_file !== undefined) {
        const gpa_media_model = new Media({
            _id: new mongoose.Types.ObjectId
        });

        const pic = await sharp(gpaCert_file.path).metadata();
        gpa_media_model.width = pic.width;
        gpa_media_model.height = pic.height;
        gpa_media_model.contentType = gpaCert_file.mimetype;
        gpa_media_model.name = gpaCert_file.filename;

        const rnMedia = await gpa_media_model.save();
        user.profile = rnMedia._id;
    }

    if (proPic_file !== undefined) {
        const proPic_media_model = new Media({
            _id: new mongoose.Types.ObjectId
        });

        const pic = await sharp(proPic_file.path).metadata();
        proPic_media_model.width = pic.width;
        proPic_media_model.height = pic.height;
        proPic_media_model.contentType = proPic_file.mimetype;
        proPic_media_model.name = proPic_file.filename;

        const rnMedia = await proPic_media_model.save();
        user.profile = rnMedia._id;
    }
    try {
        const result = await user.save();

        if (latitude !== undefined && longitude !== undefined) {
            const location = { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] };
            const locationModel = new Location({
                _id: new mongoose.Types.ObjectId,
                user: result._id,
                chatType:'SINGLE',
                location

            });
             await locationModel.save();
        }



        const token = jwt.sign({
            phoneNumber: result.phoneNumber,
            userId: result._id
        },
            config.JWT_KEY
        );

        return res.status(201).json({
            token: token,
            userId: result._id,
            name: result.name,
            userType: result.userType
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });


    }
}


export const signinUser = async (req, res) => {
    const { userType, phoneNumber, password } = req.body;
    try {

        const user = await User.find({ userType, phoneNumber, password }).exec();

        if (user && user.length < 1) {
            return res.status(401).json({ message: "Auth failed" })
        }

        const token = jwt.sign({
            phoneNumber: user[0].phoneNumber,
            userId: user[0]._id
        },
            config.JWT_KEY
        );

        return res.status(200).json({
            token: token,
            userId: user[0]._id,
            name: user[0].name,
            userType: user[0].userType
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}


export const getNumberOfUsers = async (req, res) => {
    const { userType } = req.query;

    try {
        const users = await User.find({ userType }).exec();

        return res.status(200).json({ userCount: users.length });
    }
    catch (err) {
        return res.status(500).json({ err });
    }




}