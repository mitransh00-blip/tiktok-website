const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// GET user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// PUT update user profile
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
    res.status(500).json({ msg: err.message });
  }
});

// POST follow/unfollow user
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
      res.json({ msg: "Unfollowed successfully", following: false });
    } else {
      // Follow
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user.id);
      await currentUser.save();
      await userToFollow.save();
      res.json({ msg: "Followed successfully", following: true });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;

