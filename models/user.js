import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    phoneNumber: {
        type: String,
        required: true
    },
    userType: String,
    password: {
        type: String,
        required: true
    },
    email: String,
    name: String,
    gpaCertNo: String,
    gpaCertPic: {
        type: Schema.Types.ObjectId,
        ref: 'Media'
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Media'
    },
    chatRooms: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]


}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);


export default User;