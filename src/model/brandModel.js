import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "please provide brand name"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
