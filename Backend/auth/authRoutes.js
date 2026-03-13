const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "mitransh_secret_key_2024";

// Middleware to verify token
const auth = require("../middleware/auth");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, phone, password, language } = req.body;

    // Validate required fields
    if (!username || !email || !phone || !password) {
      return res.status(400).json({ msg: "Please provide all required fields" });
    }

    // Check if username already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ msg: "Username already taken" });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Check if phone already exists
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ msg: "Phone number already registered" });
    }

    // Validate Cameroon phone format
    const cleanPhone = phone.replace(/\s/g, '');
    const phoneRegex = /^(\+237|237)?[6-9]\d{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({ msg: "Invalid Cameroon phone number" });
    }

    // Format phone to +237 format
    let formattedPhone = cleanPhone;
    if (cleanPhone.startsWith("237")) {
      formattedPhone = "+" + cleanPhone;
    } else if (cleanPhone.startsWith("+237")) {
      formattedPhone = cleanPhone;
    } else if (cleanPhone.length === 9) {
      formattedPhone = "+237" + cleanPhone;
    }

    // Hash password with bcrypt (highly secured)
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      phone: formattedPhone,
      password: hashedPassword,
      language: language || "en",
    });

    await newUser.save();

    // Create token
    const token = jwt.sign(
      { id: newUser._id },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      msg: "Registration successful",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        language: newUser.language,
        profilePic: newUser.profilePic,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// LOGIN - can use username, email, or phone
router.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ msg: "Please provide login and password" });
    }

    // Find user by username, email, or phone
    let user = await User.findOne({ username: login });
    if (!user) {
      user = await User.findOne({ email: login });
    }
    if (!user) {
      // Format phone for lookup
      const cleanPhone = login.replace(/\s/g, '');
      let formattedPhone = cleanPhone;
      if (cleanPhone.startsWith("237")) {
        formattedPhone = "+" + cleanPhone;
      } else if (cleanPhone.length === 9) {
        formattedPhone = "+237" + cleanPhone;
      }
      user = await User.findOne({ phone: formattedPhone });
    }

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        language: user.language,
        profilePic: user.profilePic,
        isVendor: user.isVendor,
        followers: user.followers.length,
        following: user.following.length,
        totalLikes: user.totalLikes,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET CURRENT USER
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// UPDATE USER PROFILE
router.put("/profile", auth, async (req, res) => {
  try {
    const { language, profilePic, bio, location, mtnNumber, orangeNumber, isVendor } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (language) user.language = language;
    if (profilePic) user.profilePic = profilePic;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (mtnNumber !== undefined) user.mtnNumber = mtnNumber;
    if (orangeNumber !== undefined) user.orangeNumber = orangeNumber;
    if (isVendor !== undefined) user.isVendor = isVendor;

    await user.save();

    res.json({
      msg: "Profile updated",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        language: user.language,
        profilePic: user.profilePic,
        bio: user.bio,
        location: user.location,
        isVendor: user.isVendor,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// FOLLOW/UNFOLLOW USER
router.post("/follow/:id", auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow) {
      return res.status(404).json({ msg: "User not found" });
    }

    const currentUser = await User.findById(req.user.id);
    
    if (currentUser.following.includes(req.params.id)) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== req.params.id
      );
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== req.user.id
      );
      await currentUser.save();
      await userToFollow.save();
      res.json({ msg: "Unfollowed successfully" });
    } else {
      // Follow
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user.id);
      await currentUser.save();
      await userToFollow.save();
      res.json({ msg: "Followed successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
