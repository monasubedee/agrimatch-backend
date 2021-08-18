import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const locationSchema = new Schema({
    _id: { type: Schema.Types.ObjectId },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    chatRoom: { type: Schema.Types.ObjectId, ref: 'ChatRoom' },
    chatType: String,
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: [Number]
    }


},
    {
        timestamps: true
    });

locationSchema.indexes({ location: "2dsphere " });

const Location = mongoose.model('Location', locationSchema);


export default Location;