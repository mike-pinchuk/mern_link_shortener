const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../models/User");

const router = Router();

router.post(
  "/register",
  [
    check("email", "Incorrect email ").isEmail(),
    check("password", "Min lenght of password is 6 symbols").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid data for registration",
        });
      }
      const { email, password } = req.body;
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword });
      await user.save();

      res.status(201).json({ message: "User was created" });
    } catch (error) {
      res.status(500).json({ message: "Something goes wrong", error: error });
    }
  }
);
router.post(
  "/login",
  [
    check("email", "Enter valid email").normalizeEmail().isEmail(),
    check("password", "Enter the password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid data to login",
        });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Wrong credentials" });
      }
      const isValidPass = await bcrypt.compare(password, user.password);

      if (!isValidPass) {
        return res.status(400).json({ message: "Wrong credentials" });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "1h",
      });
      res.json({ token, userId: user.id });
    } catch (error) {
      res.status(500).json({ message: "Something goes wrong", error: error });
    }
  }
);

module.exports = router;
