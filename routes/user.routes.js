const router = require("express").Router();

const mongoose = require("mongoose");
const fileUploader = require("../config/cloudinary.config"); //DOWNLOAD?

const User = require("../models/User.model");
const Comment = require("../models/Comment.model");

/* WHAT CAN YOU FIND HERE?
- GET ROUTE TO SEE ALL USERS IN APP
- GET ROUTE TO SEE DETAILS OF CERTAIN USER 
- PUT ROUTE TO EDIT PROFILE
- DELETE ROUTE TO DELETE USER
*/

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
    .populate("following followers myEvents")
    .populate({
      path: "receivedComments",
      populate: { path: "commentBy" },
    })
    .then((user) => {
      res.status(200).json({ user });
    })
    .catch((err) => res.status(500).json({ errorMessage: "error.message" }));
});

router.put("/users/:id", fileUploader.single("image"), (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.payload;

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

  if (id !== _id) {
    res.status(400).json({
      errorMessage: "You can't edit someone's profile who's not you.",
    });
    return;
  }
  /*  if (req.file) */
  User.findByIdAndUpdate(
    id,
    {
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
  const { _id } = req.payload;

  if (id !== _id) {
    res.status(400).json({
      errorMessage: "You can't delete someone's profile who's not you.",
    });
    return;
  }

  let deletedUser = await User.findByIdAndRemove(id);
  await Event.deleteMany({ _id: { $in: deletedUser.myEvents } });
  await Comment.deleteMany({ _id: { $in: deletedUser.myComments } });
  await Comment.deleteMany({ _id: { $in: deletedUser.receivedComments } });

  res.status(200).json({ user });

  res.status(500).json({ errorMessage: error.message });
});

module.exports = router;
