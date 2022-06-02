const router = require("express").Router();

const mongoose = require("mongoose");

const User = require("../models/User.model");
const Comment = require("../models/Comment.model");

/* WHAT CAN YOU FIND HERE?
DO I NEED THE GET SPECIFIC MESSAGE?
- POST ROUTE TO ADD COMMENT 
- DELETE ROUTE TO DELETE COMMENT
*/

router.post("/profile/:id/add-comment", async (req, res, next) => {
  try {
    const { comment } = req.body;
    const { _id } = req.payload;
    const { id } = req.params;

    let newComment = await Comment.create({
      comment,
      commentBy: _id,
    });
    let userReceived = await User.findByIdAndUpdate(
      id,
      { $push: { receivedComments: newComment._id } },
      { new: true }
    );
    let userCommented = await User.findByIdAndUpdate(
      _id,
      { $push: { myComments: newComment._id } },
      { new: true }
    );

    res.status(200).json(newComment);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ errorMessage: error.message });
    }
    return res.status(500).json({ errorMessage: error.message });
  }
});

/* 
router.get("/comments/:id", (req, res, nex) => {
  const { id } = req.params;
  Comment.findById(id)
    .populate("commentBy")
    .then((comment) => {
      res.json(comment);
    })
    .catch((err) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
}); */

router.delete("/comments/:id", (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.payload;

  Comment.findById(id)
    .then((comment) => {
      if (comment.commentBy !== _id) {
        res.status(400).json({ errorMessage: "Not the author of the comment" });
        return;
      } else {
        Comment.findByIdAndRemove(id)
          .then((response) => res.json(response))
          .then((comment) => {
            User.findByIdAndUpdate(
              _id,
              { $pull: { receivedComments: comment._id } },
              { new: true }
            ).then((user) => {
              res.json(user);
            });
            return comment;
          })
          .then(() => {
            User.findByIdAndUpdate(
              commentBy,
              { $pull: { myComments: comment._id } },
              { new: true }
            );
          });
      }
    })
    .catch((err) =>
      res.status(400).json({ message: "Invalid comment supplied" })
    );
});

module.exports = router;
