import { Schema, model } from "mongoose";

const brandSchema = new Schema(
  {
    brandName: {
      type: String,
      required: [true, "Provide brand name"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Brand = model("Brand", brandSchema);

export default Brand;
