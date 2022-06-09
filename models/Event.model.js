const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    name: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://www.trroofingsheets.co.uk/wp-content/uploads/2016/05/default-no-image-1.png",
    },
    typeOfEvent: {
      type: String,
      required: true,
      enum: ["Campo de escrita", "Workshop", "Jam", "Concerto", "Outro"],
    },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
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

/* ADD DESCRIPTION AND CHANGE DEFAULT PIC */
