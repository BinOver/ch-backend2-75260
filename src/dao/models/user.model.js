import { Schema, model } from "mongoose";
import cartModel from "./cart.model.js";

const userSchema = new Schema({

    last_name: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true,
        uniquie: true
    },
    email:{
        type: String,
        required: true,
        uniquie: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    age:{
        type: Number,
        require:true
    },
    role: {
        type: String,
        default: 'user'
    },
    cart: {	
        type: Schema.Types.ObjectId,
        ref: 'cart',
    }
});

userSchema.pre('save', async function(next){
    if(!this.cart){
        try {
            const newCart = await cartModel.create({});
            this.cart = newCart._id;
        }catch(error){
            next(error);
        }
    } else {
        next();
    }
})

const userModel = model('user',userSchema);
export default userModel;