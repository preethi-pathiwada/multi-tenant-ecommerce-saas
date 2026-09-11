import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{type:String, trim:true, default:""},
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
}, {timeStamps: true});

const Store = mongoose.model("Store", storeSchema);
export default Store;