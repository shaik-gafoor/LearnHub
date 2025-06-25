const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = require("../schemas/userModel");
const courseSchema = require("../schemas/courseModel");
const enrolledCourseSchema = require("../schemas/enrolledCourseModel");
const coursePaymentSchema = require("../schemas/coursePaymentModel");

// Register Controller
const registerController = async (req, res) => {
  try {
    const existsUser = await userSchema.findOne({ email: req.body.email });
    if (existsUser) {
      return res
        .status(400)
        .send({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    const newUser = new userSchema(req.body);
    await newUser.save();

    return res.status(201).send({ message: "Register success", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

// Login Controller
const loginController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res
        .status(401)
        .send({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
    const userData = user.toObject();
    delete userData.password;

    return res
      .status(200)
      .send({ message: "Login successful", success: true, token, userData });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

// Get All Courses (Public)
const getAllCoursesController = async (req, res) => {
  try {
    const allCourses = await courseSchema.find();
    if (!allCourses.length) {
      return res.status(404).send({ message: "No courses found" });
    }
    return res.status(200).send({ success: true, data: allCourses });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

// Post Course (Educator)
const postCourseController = async (req, res) => {
  try {
    const {
      userId,
      C_educator,
      C_title,
      C_categories,
      C_price,
      C_description,
      S_title,
      S_description,
    } = req.body;

    let S_content = [];
    if (Array.isArray(req.files)) {
      S_content = req.files.map((file) => file.filename);
    }

    const sections = [];

    if (Array.isArray(S_title)) {
      for (let i = 0; i < S_title.length; i++) {
        sections.push({
          S_title: S_title[i],
          S_description: S_description[i],
          S_content: S_content[i]
            ? {
                filename: S_content[i],
                path: `/uploads/${S_content[i]}`,
              }
            : {},
        });
      }
    } else {
      sections.push({
        S_title,
        S_description,
        S_content: S_content[0]
          ? {
              filename: S_content[0],
              path: `/uploads/${S_content[0]}`,
            }
          : {},
      });
    }

    const course = new courseSchema({
      userId,
      C_educator,
      C_title,
      C_categories,
      C_price: C_price == 0 ? "free" : C_price,
      C_description,
      sections,
    });

    await course.save();
    res
      .status(201)
      .send({ success: true, message: "Course created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to create course" });
  }
};

// Get Courses of Logged-in Educator
const getAllCoursesUserController = async (req, res) => {
  try {
    const allCourses = await courseSchema.find({ userId: req.body.userId });
    res.send({ success: true, data: allCourses });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

// Delete Course (Educator)
const deleteCourseController = async (req, res) => {
  const { courseid } = req.params;
  try {
    const course = await courseSchema.findByIdAndDelete(courseid);
    if (course) {
      res
        .status(200)
        .send({ success: true, message: "Course deleted successfully" });
    } else {
      res.status(404).send({ success: false, message: "Course not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

// Enroll in Course
const enrolledCourseController = async (req, res) => {
  const { courseid } = req.params;
  const { userId } = req.body;
  try {
    const course = await courseSchema.findById(courseid);
    if (!course) {
      return res
        .status(404)
        .send({ success: false, message: "Course Not Found" });
    }

    const isAlreadyEnrolled = await enrolledCourseSchema.findOne({
      courseId: courseid,
      userId,
    });

    if (isAlreadyEnrolled) {
      return res
        .status(200)
        .send({ success: false, message: "Already enrolled" });
    }

    await new enrolledCourseSchema({
      courseId: courseid,
      userId,
      course_Length: course.sections.length,
    }).save();
    await new coursePaymentSchema({
      userId,
      courseId: courseid,
      ...req.body,
    }).save();

    course.enrolled += 1;
    await course.save();

    res.status(200).send({ success: true, message: "Enrolled Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

// Send Course Content to Enrolled User
const sendCourseContentController = async (req, res) => {
  const { courseid } = req.params;
  try {
    const course = await courseSchema.findById(courseid);
    const user = await enrolledCourseSchema.findOne({
      courseId: courseid,
      userId: req.body.userId,
    });

    if (!course || !user) {
      return res
        .status(404)
        .send({ success: false, message: "Course or user not found" });
    }

    res.status(200).send({
      success: true,
      courseContent: course.sections,
      completeModule: user.progress,
      certficateData: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

// Mark a Module Complete
const completeSectionController = async (req, res) => {
  const { courseId, sectionId, userId } = req.body;

  try {
    const userProgress = await enrolledCourseSchema.findOne({
      courseId,
      userId,
    });
    if (!userProgress) {
      return res.status(404).send({ success: false, message: "Not enrolled" });
    }

    userProgress.progress.push({ sectionId });
    await userProgress.save();

    res.status(200).send({ success: true, message: "Section completed" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

// Send All Enrolled Courses of a User
const sendAllCoursesUserController = async (req, res) => {
  const { userId } = req.body;
  try {
    const enrolledCourses = await enrolledCourseSchema.find({ userId });
    const detailedCourses = await Promise.all(
      enrolledCourses.map(async (enroll) => {
        return await courseSchema.findById(enroll.courseId);
      })
    );

    res.status(200).send({ success: true, data: detailedCourses });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

// ✅ Export all controllers
module.exports = {
  registerController,
  loginController,
  postCourseController,
  getAllCoursesUserController,
  deleteCourseController,
  getAllCoursesController,
  enrolledCourseController,
  sendCourseContentController,
  completeSectionController,
  sendAllCoursesUserController,
};
