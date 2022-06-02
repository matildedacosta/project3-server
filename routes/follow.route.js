const router = require("express").Router();

const mongoose = require("mongoose");
const fileUploader = require("../config/cloudinary.config"); //DOWNLOAD?

const User = require("../models/User.model");

/* CREATE LIST OF FOLLOWING AND FOLLOWED (FIRST ADD IS POST AND THEN GET TO SHOW) */

router.post("/add-follow/:id", (req, res, next) => {
  const { id } = req.params;
  const { loggedUser } = req.body;

  User.findByIdAndUpdate(
    id,
    { $push: { followers: loggedUser._id } },
    { new: true }
  )
    .then((user) => {
      res.json(user);
      return user;
    })
    .then((user) => {
      User.findByIdAndUpdate(
        loggedUser,
        { $push: { following: user } },
        { new: true }
      );
    })
    .catch((err) => {
      res.status(400).json({ message: "Invalid follow" });
    });
});

router.get("/following/:id", (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .populate("following")
    .then((user) => {
      res.json(user);
    });
});

router.delete("/remove-follow/:id", (req, res, next) => {
  const { id } = req.params;
  const { loggedUser } = req.body;

  User.findByIdAndUpdate(
    id,
    { $pull: { followers: loggedUser._id } },
    { new: true }
  )
    .then((user) => {
      res.json(user);
      return user;
    })
    .then((user) => {
      User.findByIdAndUpdate(
        loggedUser,
        { $pull: { following: user } },
        { new: true }
      );
    })
    .catch((err) => {
      res.status(400).json({ message: "Invalid follow" });
    });
});

module.exports = router;
