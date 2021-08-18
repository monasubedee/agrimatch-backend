import ChatRoom from '../models/chatroom.js';
import User from '../models/user.js';
import Location from '../models/location.js';
import mongoose from 'mongoose';

export const createGroupChatRoom = async (req, res) => {

    const { roomName, user, latitude, longitude } = req.body;

    try {
        const room = await ChatRoom.find({ roomName }).exec();

        if (room.length > 0) {
            return res.status(409).send({ message: 'Room Name Already Exists' });
        }

        const roomModel = await new ChatRoom({
            _id: new mongoose.Types.ObjectId,
            roomName,
            roomType: 'GROUP'
        });

        roomModel.participants.push(user);

        const chatRoom = await roomModel.save();

        const userModel = await User.findById(user).exec();

        userModel.chatRooms.push(chatRoom._id);

        userModel.save();

        if(latitude !== undefined && longitude !== undefined){
            const location = {type:'Point',coordinates:[parseFloat(longitude),parseFloat(latitude)]};
            const locationModel = new Location({
                _id:new mongoose.Types.ObjectId,
                user,
                location,
                chatType:'GROUP'
            
            });
            locationModel.chatRoom = roomModel._id;
            await locationModel.save();


        }

        return res.status(201).send({ message: "Success" })


    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}