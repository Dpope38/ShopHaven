import Color from "../model/color.js";
import mongoose from "mongoose";

/*
  @desc get all Color
  @route GET /api/v1/Color
  @access private/admin
 */

const getAllColor = async (req, res) => {
  const color = await Color.find();

  res.status(200).json({
    length: color.length,
    status: "Success",
    message: "color fetched successfully",
    color,
  });
};

/*
  @desc Creates a Color
  @route POST /api/v1/Color
  @access private/admin
 */

const createColor = async (req, res) => {
  // check if name exist...
  const { name } = req.body;
  const checkedColor = await Color.findOne({ name });

  if (checkedColor) {
    return res.status(400).json({});
  }
  const createColor = await Color.create({
    name: name.toLowerCase(),
  });

  res.status(201).json({
    status: "Success",
    message: "color created successfully",
    data: {
      createColor,
    },
  });
};

/*
  @desc get a single  Color
  @route GET /api/v1/color/:id
  @access private/admin
 */

const getSingleColor = async (req, res) => {
  const color = await Color.findById(req.params.id);

  if (!Color) {
    return res.status(404).json({
      status: "error",
      message: "color not found",
    });
  }
  res.status(200).json({
    status: "success",
    message: "color fetched successfully",
    data: { color },
  });
};

/*
  @desc update   Color
  @route PUT /api/v1/Color/:id
  @access private/admin
 */

const updateColorCtrl = async (req, res) => {
  const { name } = req.body;

  // check if the id object format is correct (optional)
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid Product ID format" });
  }
  // update brand
  const color = await Color.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    { new: true },
  );

  if (!Color) {
    return res.status(404).json({
      status: "fail",
      message: "Color ID not found",
    });
  }

  res.status(200).json({
    status: "Success",
    message: "color Updated Successfully",
    color,
  });
};

const deleteColorctrl = async (req, res) => {
  const color = await Color.findByIdAndDelete(req.params.id);

  if (!color) {
    return res.status(404).json({
      status: "fail",
      message: "Color ID not found",
    });
  }
  res.status(200).json({
    status: "Success",
    message: "Color deleted Successfully",
  });
};
export {
  getAllColor,
  createColor,
  getSingleColor,
  updateColorCtrl,
  deleteColorctrl,
};
