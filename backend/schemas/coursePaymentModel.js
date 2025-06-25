const mongoose = require("mongoose");

const coursePaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    paymentReference: {
      type: String,
      default: function () {
        return `REF-${Date.now()}`;
      },
    },
    // Simulated card meta (NEVER use real info)
    cardDetails: {
      maskedNumber: {
        type: String,
        default: "**** **** **** 1234",
      },
      method: {
        type: String,
        default: "Credit Card",
      },
    },
    status: {
      type: String,
      enum: ["enrolled", "pending", "failed"],
      default: "enrolled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("coursePayment", coursePaymentSchema);
