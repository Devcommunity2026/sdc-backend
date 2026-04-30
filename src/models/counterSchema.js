import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,   // ✅ MUST BE STRING (THIS FIXES YOUR ERROR)
  },
  seq: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;