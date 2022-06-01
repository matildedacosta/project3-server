const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    image: {
      type: String,
      default:
        "https://icon-library.com/images/profile-image-icon/profile-image-icon-25.jpg",
    },
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
      enum: [
        "Artista",
        "Cantor(a)",
        "Compositor(a)",
        "Guitarrista",
        "Baixista",
        "Pianista",
        "Instrumento de orquestra",
        "Produtor(a)",
        "Engenheiro/a som",
        "Engenheiro/a mistura",
        "Engenheiro/a masterização",
        "Outro",
      ],
    },
    links: {
      spotify: {
        type: String,
      },
      soundCloud: {
        type: String,
      },
      youtube: {
        type: String,
      },
      instagram: {
        type: String,
      },
      facebook: {
        type: String,
      },
      portfolio: {
        type: String,
      },
    },
    myEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    myComments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    receivedComments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
