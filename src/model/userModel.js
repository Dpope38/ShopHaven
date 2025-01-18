import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     fullname: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: [true, "invalid/incorrect information"],
//     },
//     orders: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Order",
//     },
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },
//     hasShippingAddress: {
//       type: Boolean,
//       default: false,
//     },
//     shippingAddress: {
//       firstname: {
//         type: String,
//         require: [true, "Provide your first-name"],
//       },
//       lastname: {
//         type: String,
//         require: [true, "Provide your last-name"],
//       },
//       address: {
//         type: String,
//         require: [true, "Provide your address"],
//       },
//       city: {
//         type: String,
//         require: [true, "Provide your city"],
//       },
//       postalCode: {
//         type: String,
//       },
//       province: {
//         type: String,
//       },
//       country: {
//         type: String,
//         require: [true, "Provide your country"],
//       },
//       phone: {
//         type: String,
//         require: [true, "Provide your phone"],
//       },
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// const User = mongoose.model("User", userSchema);
// export default User;

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Invalid/Incorrect information"],
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wishlists",
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    hasShippingAddress: {
      type: Boolean,
      default: false,
    },
    shippingAddress: {
      firstname: {
        type: String,
        require: [true, "Provide your first-name"],
      },
      lastname: {
        type: String,
        require: [true, "Provide your last-name"],
      },
      address: {
        type: String,
        require: [true, "Provide your address"],
      },
      city: {
        type: String,
        require: [true, "Provide your city"],
      },
      postalCode: {
        type: String,
      },
      province: {
        type: String,
      },
      country: {
        type: String,
        require: [true, "Provide your country"],
      },
      phone: {
        type: String,
        require: [true, "Provide your phone"],
      },
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
