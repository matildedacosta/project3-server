const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    name: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://www.google.com/imgres?imgurl=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1492684223066-81342ee5ff30%3Fixlib%3Drb-1.2.1%26ixid%3DMnwxMjA3fDB8MHxzZWFyY2h8NHx8ZXZlbnR8ZW58MHx8MHx8%26w%3D1000%26q%3D80&imgrefurl=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fevent&tbnid=rXY51srrOmNlKM&vet=12ahUKEwjG3abnzo74AhWS0YUKHbtcCB8QMygBegUIARDcAQ..i&docid=foueM1D4WNDpkM&w=1000&h=667&q=event%20images&ved=2ahUKEwjG3abnzo74AhWS0YUKHbtcCB8QMygBegUIARDcAQ",
    },
    typeOfEvent: {
      type: String,
      required: true,
      enum: ["Campo de escrita", "Workshop", "Jam", "Concerto", "Outro"],
    },
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
