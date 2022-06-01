const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    comment: { type: String, required: true },
    /* date: { type: Date, required: true }, */
    commentBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
