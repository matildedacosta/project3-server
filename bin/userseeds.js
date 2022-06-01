const mongoose = require("mongoose");
const User = require("../models/User.model");
require("dotenv/config");

const MONGO_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

const users = [
  {
    image: "",
    fullName: "Matilde Costa",
    username: "matildedacosta",
    description: "I love music!",
    email: "matildefigueirascosta@hotmail.com",
    password: {
      type: String,
      required: true,
    },
    location: "Setubal",
    skills: ["Artista", "Cantor(a)", "Produtor(a)", "Compositor(a)"],
    links: {
      spotify: "https://open.spotify.com/artist/6k5suR9VW94cqebhOpwNvy",
      soundCloud: "https://soundcloud.com/itsmatildecosta",
      youtube: "https://www.youtube.com/channel/UCQLd6TnB6qVLDyRd0x3Fljg",
      instagram: "https://www.instagram.com/itsmatildecosta/",
      facebook: "https://www.facebook.com/itsmatildecosta",
    },
  },
  {
    fullName: "Nayr Faquira",
    username: "nayrfaquira",
    description: "I love Rnb!",
    email: "nayr@faquira.com",
    password: {
      type: String,
      required: true,
    },
    location: "Sintra",
    skills: ["Artista", "Cantor(a)", "Produtor(a)", "Compositor(a)"],
    links: {
      spotify:
        "https://open.spotify.com/artist/04UMTpKorelINdwYKsM9Tb?si=4wRXNukeTfGEyvbgV0PlOA",
      youtube: "https://www.youtube.com/channel/UCpP4Np4P84vshWh-kSiA7Lw",
      instagram: "https://www.instagram.com/nayrfaquira/",
      facebook: "https://www.facebook.com/nayrfaquirapaginaoficial",
    },
  },
  {
    fullName: "Jorge Palma",
    username: "jorgepalma",
    description: "piano",
    email: "lizzy@mcalpine.com",
    password: {
      type: String,
      required: true,
    },
    location: "Lisboa",
    skills: ["Artista", "Cantor(a)", "Pianista", "Compositor(a)"],
    links: {
      spotify:
        "https://open.spotify.com/artist/5uOMOTzmfhliUjnyiJh0kn?si=cx0vAVIfTwKcOwQ8Pm4IBw",
      youtube: "https://www.youtube.com/user/jorgepalmaoficial",
      instagram: "https://www.instagram.com/jorgepalmaoficial/",
      facebook: "https://www.facebook.com/jorgepalmaoficial/",
    },
  },
];

User.create(users)
  .then((createdUsers) => {
    console.log(`Created ${createdUsers.length} in the DB`);
    mongoose.disconnect(() => console.log("Disconnected from the db"));
  })
  .catch((err) => console.log(err));
