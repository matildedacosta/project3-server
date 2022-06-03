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

router.delete("/comments/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id } = req.payload;

    let checkCommentOwner = await Comment.findById(id).then((comment) => {
      if (comment.commentBy !== _id) {
        res.status(400).json({ errorMessage: "Not the author of the comment" });
        return;
      }
    });

    let deletedComment = await Comment.findByIdAndRemove(id);
    let deleteReceivedCommentfromUser = await User.findOneAndUpdate(
      { $in: { receivedComments: deletedComment._id } },
      { $pull: { receivedComments: deletedComment._id } },
      { new: true }
    );

    let deletedCommentFromUser = User.findByIdAndUpdate(
      deletedComment.commentBy,
      { $pull: { myComments: deletedComment._id } },
      { new: true }
    );
    res.json(deletedComment);
  } catch (err) {
    res.status(400).json({ message: "Invalid comment supplied" });
  }
});

module.exports = router;
