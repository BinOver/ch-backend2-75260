import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const colection = "Product";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price:  {
        type: Number,
        required: true
    },
    thumbnail:  {
        type: [String],
    },
    img:  {
        type: String,
    },
    code:  {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
});

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model(colection, productSchema); 

export default ProductModel;