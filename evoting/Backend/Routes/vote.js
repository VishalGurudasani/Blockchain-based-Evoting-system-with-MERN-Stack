const express = require("express");
const router = express.Router();
const User = require("../Models/user");

// Define the route to retrieve the voter's ID based on the voterid

router.get("/getVoterId/:voterid", async (req, res) => {
  const { voterid } = req.params;

  try {
    const voter = await User.findOne({ voterid });

    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    // Respond with the voter ID
    res.json({ voterId: voter.voterid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
