import { Schema, model } from "mongoose";

/**
 * @typedef {Object} CategorySchema
 * @property {string} name - The name of the category. This field is required.
 * @property {string} [image="no-photo.jpg"] - The image associated with the category. Defaults to "no-photo.jpg".
 * @property {Date} createdAt - The date when the category was created. Automatically managed by Mongoose.
 * @property {Date} updatedAt - The date when the category was last updated. Automatically managed by Mongoose.
 */
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please, provide category name"],
    },
    image: {
      type: String,
      default: "no-photo.jpg",
    },
  },
  {
    timestamps: true,
  },
);

const Category = model("Category", categorySchema);
export default Category;
