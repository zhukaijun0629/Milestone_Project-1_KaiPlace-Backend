const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.get("/:uid", usersControllers.getUserById);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(), //Test@test.com => test@test.com
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);

router.post("/login", usersControllers.login);

router.patch(
  "/:uid",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("old_password").isLength({ min: 6 }),
    check("new_password").isLength({ min: 6 }),
  ],
  usersControllers.updateUser
);

// router.delete("/:uid", usersControllers.deleteUser;

module.exports = router;
