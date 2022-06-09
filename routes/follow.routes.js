const router = require("express").Router();

const mongoose = require("mongoose");

const User = require("../models/User.model");

/* WHAT CAN YOU FIND HERE?
- POST ROUTE TO ADD A FOLLOW (EITHER FOLLOWING OR FOLLOWERS)
- GET ROUTES TO SEE THE FOLLOWERS AND FOLLOWINGS
- DELETE ROUTE TO REMOVE A FOLLOWING OR FOLLOWER
*/

router.post("/add-follow/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id } = req.payload;

    let checkIfFollows = await User.findById(_id);
    if (checkIfFollows.following.includes(id)) return;

    let follow = await User.findByIdAndUpdate(
      id,
      { $push: { followers: _id } },
      { new: true }
    );
    let beFollowed = await User.findByIdAndUpdate(
      _id,
      { $push: { following: id } },
      { new: true }
    );
    res.json(beFollowed);
  } catch (error) {
    res.status(400).json({ message: "Invalid follow" });
  }
});

router.get("/following/:id", (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .populate("following")
    .then((user) => {
      res.json(user);
    });
});

router.get("/followers/:id", (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .populate("followers")
    .then((user) => {
      res.json(user);
    });
});

router.put("/remove-follow/:id", async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.payload;

  try {
    let updateFriend = await User.findByIdAndUpdate(
      id,
      { $pull: { followers: _id } },
      { new: true }
    );
    let updateUser = await User.findByIdAndUpdate(
      _id,
      { $pull: { following: id } },
      { new: true }
    );
    res.status(200);
  } catch (err) {
    res.status(400).json({ message: "Invalid follow" });
  }
});

module.exports = router;
