const router = require("express").Router();

const mongoose = require("mongoose");
const fileUploader = require("../config/cloudinary.config"); //DOWNLOAD?

const User = require("../models/User.model");
const Comment = require("../models/Comment.model");

/* http://localhost:5005/api/users */

router.get("/users", (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((err) => res.status(500).json({ errorMessage: error.message }));
});

router.get("/users/:id", (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .populate("following followers  myEvents")
    .populate({
      path: "receivedComments",
      populate: { path: "commentBy" },
    })
    .then((user) => {
      res.status(200).json({ user });
    })
    .catch((err) => res.status(500).json({ errorMessage: error.message }));
});

router.put("/users/:id", (req, res, next) => {
  const { id } = req.params;
  const {
    image,
    username,
    email,
    fullName,
    description,
    location,
    skills,
    links,
  } = req.body;

  User.findByIdAndUpdate(
    id,
    {
      /*  image: req.file.path, */
      image,
      username,
      email,
      fullName,
      description,
      location,
      skills,
      links,
    },
    { new: true }
  )
    .then((user) => {
      res.status(200).json({ user });
    })
    .catch((err) => res.status(500).json({ errorMessage: error.message }));
});

router.delete("/users/:id", async (req, res, next) => {
  const { id } = req.params;

  let deletedUser = await User.findByIdAndRemove(id);
  await Event.deleteMany({ _id: { $in: deletedUser.myEvents } });
  await Comment.deleteMany({ _id: { $in: deletedUser.myComments } });

  res.status(200).json({ user });

  res.status(500).json({ errorMessage: error.message });
});

module.exports = router;
