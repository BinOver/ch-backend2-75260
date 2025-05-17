import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Debe ser por lo menos 1"],
      },
    },
  ],
});

const autoPopulateProducts = function (next) {
  this.populate("products.product", "_id title price");
  next();
};

cartSchema.pre("findOne", autoPopulateProducts);
cartSchema.pre("find", autoPopulateProducts);
cartSchema.pre("findOneAndUpdate", autoPopulateProducts);

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;
