import Message from '../models/message.js';
import User from '../models/user.js';
import ChatRoom from '../models/chatroom.js'
import mongoose from 'mongoose';


export const saveChat = async (req,res) => {

    const { senderId, text, receiverIds, roomType, roomId } = req.body;
    console.log(req.chat_socket)

    const chat_socket = req.chat_socket;

    const messageModel = new Message({ _id: new mongoose.Types.ObjectId() });

    let socket_message = {};

    let room_id;

    messageModel.sender = senderId;

    if (text && text.trim().length > 0) {
        messageModel.text = text;

        socket_message.text = text;
    }

    const receiver_ids = receiverIds;

    try {
        const senderModel = await User.findById(senderId).exec();

        if (roomId) {
            const chatRoom = await ChatRoom.findById(roomId).exec();

            if (chatRoom) {
                room_id = chatRoom._id;
            }

        }
        else {
            const room = await ChatRoom.find({
                participants: { $all: [senderId, ...receiver_ids] },
                roomType
            });

            if (room) {
                room_id = room[0]._id;
            }
            else {
                const roomModel = await new ChatRoom({ _id: new mongoose.Types.ObjectId() });

                roomModel.roomType = roomType;
                roomModel.participants.push(senderId);

                for (var i = 0; i < receiver_ids.length; i++) {
                    roomModel.participants.push(receiver_ids[i]);
                }

                room_id = roomModel._id;

                await roomModel.save();

                senderModel.chatRooms.push(room_id);

                for (var j = 0; j < receiver_ids.length; j++) {

                    const receiverModel = await User.findById(receiver_ids[j]).exec();
                    receiverModel.chatRooms.push(receiver_ids[j]);
                }


            }

            if (room_id) {
                socket_message.room = room_id;

                const { _id, createdAt } = await messageModel.save();

                socket_message._id = _id;
                socket_message.createdAt = createdAt;
                socket_message.user = { _id: senderModel._id, name: senderModel.user };
                socket_message.meta = { room_id, receiverIds: receiver_ids };


            }

            chat_socket.emit('::chat-created', socket_message);

            return res.status(201).send({ socket_message });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }



    // const chat_socket =req.chat_socket;

    // const messageModel = new Message({ _id: new mongoose.Types.ObjectId() });

    // messageModel.sender = senderId;

    // let room_id = roomId;

    // let socket_message = {};

    // if (text && text.trim().length > 0) {
    //     messageModel.text = text;
    //     socket_message['text'] = text;
    // }

    // const receiver_ids = JSON.parse(receiverIds);

    // try {
    //     const sender = await User.findById(senderId).exec();

    //     if (roomId) {
    //         const chatRoom = await ChatRoom.findById(roomId).exec();

    //         if (chatRoom) {
    //             room_id = chatRoom._id;
    //         }
    //     }
    //     else {
    //         const room = await ChatRoom.find({
    //             participants: { $all: [senderId, ...receiver_ids] },
    //             roomType
    //         });

    //         if (room) {
    //             room_id = room[0]._id;
    //         }
    //         else {
    //             const newRoom = new ChatRoom({ _id: new mongoose.Types.ObjectId() });

    //             newRoom.participants.push(senderId);

    //             for (var i = 0; i < receiver_ids.length; i++) {
    //                 newRoom.participants.push(receiver_ids[i]);
    //             }

    //             newRoom.roomType = roomType;

    //             room_id = newRoom._id;

    //             await newRoom.save();

    //             sender.chatRooms.push(newRoom._id);

    //             for (var j = 0; j < receiver_ids.length; j++) {
    //                 const receiver = await User.findById(receiver_ids[j]).exec();

    //                 receiver.chatRooms.push(receiver_ids[j]);
    //             }


    //         }
    //     }
    //     if (room_id) {
    //         socket_message['room'] = room_id;

    //         const { _id, createdAt } = await messageModel.save();

    //         socket_message['_id'] = _id;
    //         socket_message['createdAt'] = createdAt;
    //         socket_message['user'] = { _id: sender._id, name: sender.name };
    //         socket_message['meta'] = { room_id, receiverIds: receiver_ids };


    //     }

    //     chat_socket.emit('chat::created', socket_message);
    //     res.status(201).send({ socket_message });

    // }
    // catch (error) {
    //     console.log(error);
    //     return res.status(500).json({ error });
    // }

}