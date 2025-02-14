import { Schema, model } from "mongoose";

const colorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Color = model("Color", colorSchema);
export default Color;
