const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, default: "" },
    location: { type: String, required: true },
    date: { type: DateAndTime, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Event = model("Event", eventSchema);

module.exports = Event;
