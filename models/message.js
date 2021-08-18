import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const messageModel = new Schema({
    _id: Schema.Types.ObjectId,
    room: { type: Schema.Types.ObjectId, ref: 'ChatRoom' },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,


},
    {
        timestamps: true
    }
);


const Message = mongoose.model('Chat', messageModel);

export default Message;