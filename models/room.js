const mongoose = require("mongoose");
const { Schema } = mongoose;
const roomSchema = Schema(
  {
    floor: {
      type: Number,
      required: true
    },
    roomNumber: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Room cannot have a negative price"]
    },
    checkInDate: {
      type: Date,
      required: true
    },
    checkOutDate: {
      type: Date,
      required: true
    },
    user: { type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Room", roomSchema);
