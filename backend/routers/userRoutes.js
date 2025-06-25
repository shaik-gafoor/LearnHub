
const express = require("express");
const multer = require("multer");
const path = require("path");

const authMiddleware = require("../middlewares/authMiddleware");
const {
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
} = require("../controllers/userControllers");

const router = express.Router();

// ✅ Define multer storage and file filter correctly
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

const fileFilter = function (req, file, callback) {
  const ext = path.extname(file.originalname);
  if (ext !== ".mp4") {
    return callback(new Error("Only .mp4 videos are allowed"));
  }
  callback(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// ✅ Routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post(
  "/addcourse",
  authMiddleware,
  upload.array("S_content"),
  postCourseController
);
router.get("/getallcourses", getAllCoursesController);
router.get(
  "/getallcoursesteacher",
  authMiddleware,
  getAllCoursesUserController
);
router.delete(
  "/deletecourse/:courseid",
  authMiddleware,
  deleteCourseController
);
router.post(
  "/enrolledcourse/:courseid",
  authMiddleware,
  enrolledCourseController
);
router.get(
  "/coursecontent/:courseid",
  authMiddleware,
  sendCourseContentController
);
router.post("/completemodule", authMiddleware, completeSectionController);
router.get("/getallcoursesuser", authMiddleware, sendAllCoursesUserController);

module.exports = router;
