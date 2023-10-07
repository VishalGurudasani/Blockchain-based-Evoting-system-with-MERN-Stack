const express = require("express");
const router = express.Router();
const transporter = require("../Middleware/nodemailer");
const otpGenerator = require("otp-generator");
const OTPModel = require("../Models/OTPM");
const bcrypt = require("bcryptjs");
const User = require("../Models/user");

router.post("/send-otp", async (req, res) => {
  const email = req.body.email;
  const purpose = req.body.purpose;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  let subject;
  if (purpose === "login") {
    subject = "Login OTP";
  } else if (purpose === "reset-password") {
    subject = "Forgot Password OTP";
  } else {
    return res.status(400).json({ message: "Invalid purpose" });
  }

  const generatedOtp = otpGenerator.generate(4, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const expirationTimestamp = Date.now() + 5 * 60 * 1000;

  const otpData = new OTPModel({
    email: user.email,
    expiration: expirationTimestamp,
    otp: generatedOtp,
    purpose: purpose,
  });

  await otpData.save();

  const mailOptions = {
    from: "flavio.hegmann@ethereal.email",
    to: email,
    subject: subject,
    text: `Your OTP is: ${generatedOtp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: "OTP sent successfully. It will be valid for 5 minutes",
    });
  } catch (error) {
    console.log("Error sending email:", error);
    return res.json({ success: false, message: "Error sending OTP email" });
  }
});

// Endpoint to verify OTP for password reset
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpData = await OTPModel.findOne({ email });

    if (!otpData) {
      return res
        .status(400)
        .json({ success: false, message: "No OTP found for this email" });
    }

    // Verify the entered OTP and check if it's still valid
    if (otpData.otp !== otp || otpData.expiration < new Date()) {
      await OTPModel.deleteOne({ email });
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP or expired OTP" });
    }

    await OTPModel.deleteOne({ email });

    res.json({ success: true, message: "OTP verification successful" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to reset the user's password using OTP and new password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const otpData = await OTPModel.findOne({
      email,
      otp,
      expiration: { $gte: new Date() },
    });

    if (!otpData) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP or expired OTP" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    await OTPModel.deleteOne({ _id: otpData._id });

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
