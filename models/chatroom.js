import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const chatRoomSchema = new Schema({
    _id: Schema.Types.ObjectId,
    roomName: String,
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    roomType: String
},
    {
        timestamps: true
    }
);


const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

export default ChatRoom;