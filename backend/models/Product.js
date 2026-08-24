import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    stock:{
        type:Number,
        required:true,
        min:0,
        default:0
    },
    images:[
        {type:String}
    ],
    store:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Store",
        required:true
    },
    variants:[
        {
            name:{
                type:String,
                required: true
            },
            price:{
                type:Number,
                required: true,
                min:0
            },
            stock:{
                type:Number,
                required: true,
                min:0
            }
        }
       ]

}, {timeStamps:true});

const Product = mongoose.model("Product", productSchema);
export default Product;