const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  title: String,
  videos: [
    {
      title: String,
      url: String,
      duration: String,
    },
  ],
});

const courseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    C_educator: {
      type: String,
      required: [true, "Educator name is required"],
    },
    C_title: {
      type: String,
      required: [true, "Course title is required"],
    },
    C_categories: {
      type: String,
      required: [true, "Course category is required"],
    },
    C_price: {
      type: String,
      default: "Free",
    },
    C_description: {
      type: String,
      required: [true, "Course description is required"],
    },
    sections: [sectionSchema],
    enrolled: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("course", courseSchema);
