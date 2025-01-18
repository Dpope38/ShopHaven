import { Schema, model } from "mongoose";
import AppError from "../utils/appError.js";

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Coupon is expired
CouponSchema.virtual("isExpired").get(function () {
  return this.endDate < Date.now();
});

CouponSchema.virtual("daysLeft").get(function () {
  const daysLeft =
    Math.ceil((this.endDate - Date.now()) / (1000 * 60 * 60 * 24)) +
    " " +
    "Days Left";
  return daysLeft;
});

// Validation
CouponSchema.pre("validate", function (next) {
  if (this.endDate < this.startDate) {
    next(new AppError("End date cannot be lesser than the start date", 404));
  }
  next();
});

CouponSchema.pre("validate", function (next) {
  if (this.startDate < Date.now()) {
    next(new AppError("Start date cannot be lesser than the today", 404));
  }
  next();
});
CouponSchema.pre("validate", function (next) {
  if (this.endDate < Date.now()) {
    next(new AppError("End date cannot be lesser than the today", 404));
  }
  next();
});

CouponSchema.pre("validate", function (next) {
  if (this.discount <= 0 || this.discount > 100) {
    next(
      new AppError(
        "Discount cannot be less that zero or greater than 100",
        404,
      ),
    );
  }
  next();
});

const Coupon = model("Coupon", CouponSchema);

export default Coupon;
