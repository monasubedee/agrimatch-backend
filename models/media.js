import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const mediaSchema = new Schema({
    _id: {type:Schema.Types.ObjectId},
    width:Number,
    height:Number,
    name:String,
    contentType:String
},
{
    timestamps:true
});

const Media = mongoose.model('Media',mediaSchema);


export default Media;