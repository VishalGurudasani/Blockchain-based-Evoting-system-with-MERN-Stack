const express = require("express");
const User = require("../Models/user");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const transporter = require("../Middleware/nodemailer");
var jwt = require("jsonwebtoken");
var fetchuser = require("../Middleware/fetchuser");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const JWT_SECRET = "evoting#";

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
    body("voterid", "Enter a valid voterid").isLength({ min: 1 }),
    body("adharno", "Enter a valid adharno").isLength({ min: 1 }),
  ],
  async (req, res) => {
    console.log("Request Body:", req.body);
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry a user with this email already exists",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
        voterid: req.body.voterid,
        adharno: req.body.adharno,
      });

      const verificationLink = `http://localhost:5000/api/auth/verify/?id=${user._id.toString()}`;
      const emailContent = `Click <a href="${verificationLink}">here</a> to verify your email.`;

      const mailOptions = {
        from: "flavio.hegmann@ethereal.email",
        to: user.email,
        subject: "Email Verification",
        html: emailContent,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      const data = {
        user: {
          id: user._id,
        },
      };
      console.log(data);
      const authtoken = jwt.sign(data, JWT_SECRET);

      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//verifying email
router.get("/verify", async (req, res) => {
  let userId = req.query.id;
  console.log(userId);
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, error: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userId);
    console.log("User:", user);
    if (!user) {
      return res.status(400).json({ success: false, error: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.json({ success: true, message: "Email already verified" });
    }

    user.isEmailVerified = true;
    await user.save();

    res.json({ success: true, message: "Email successfully verified" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
    body("voterid", "enter your voterid").exists(),
    body("adharno", "enter your adharno").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, voterid, adharno } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      const voteridCompare = await bcrypt.compare(voterid, user.voterid);
      const adharCompare = await bcrypt.compare(adharno, user.adharno);
      if (!passwordCompare && !voteridCompare && !adharCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;

      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
//for creating ballot checking if the user is admin or not
router.post(
  "/admin",
  [body("email", "Enter a valid email").isEmail()],
  async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user.isAdmin !== true) {
        success = false;
        return res.status(400).json({ error: "you are not an admin" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
