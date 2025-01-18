/**
 * @fileoverview Mongoose model for the Brand collection.
 *
 * @requires mongoose
 */

/**
 * Mongoose schema for the Brand model.
 *
 * @typedef {Object} Brand
 * @property {string} name - The name of the brand. Required.
 * @property {mongoose.Schema.Types.ObjectId} user - The user associated with the brand.
 * @property {mongoose.Schema.Types.ObjectId[]} products - The products associated with the brand.
 * @property {Date} createdAt - The date the brand was created. Automatically managed by Mongoose.
 * @property {Date} updatedAt - The date the brand was last updated. Automatically managed by Mongoose.
 */
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
