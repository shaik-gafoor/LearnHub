const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  sectionId: String,
  completed: Boolean,
  completedAt: Date,
});

const enrolledCourseSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    course_Length: {
      type: Number,
      required: true,
    },
    progress: [progressSchema],
    certificateDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("enrolledCourses", enrolledCourseSchema);
