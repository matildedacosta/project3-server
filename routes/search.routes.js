const router = require("express").Router();

const mongoose = require("mongoose");
const fileUploader = require("../config/cloudinary.config"); //DOWNLOAD?

const User = require("../models/User.model");
const Event = require("../models/Event.model");

/* WORK ON TYPE OF EVENT ON MODEL! AND CHECK IF THIS IS CORRECT*/

let filteredEvents;

router.post("/events/filter", (req, res, next) => {
  const { name, typeOfEvent, location } = req.body;

  Event.find({}).then((allEvents) => {
    filteredEvents = allEvents.filter((event) => {
      return (
        name === event.name ||
        typeOfEvent === event.typeOfEvent ||
        location === event.location
      );
    });
  });
});

router.get("/events/filter", (req, res, next) => {
  if (filteredEvents.length < 1) {
    res.status(400).json({ message: "No events were found" });
  }
  res.status(200).json(filteredEvents);
});

let filteredUsers;

router.post("/users/filter", (req, res, next) => {
  const { name, skills, location } = req.body;

  Event.find({}).then((allUsers) => {
    filteredUsers = allUsers.filter((user) => {
      return (
        name === user.name ||
        skills === user.skills ||
        location === user.location
      );
    });
  });
});

router.get("/users/filter", (req, res, next) => {
  if (filteredUsers.length < 1) {
    res.status(400).json({ message: "No users were found" });
  }
  res.status(200).json(filteredUsers);
});

module.exports = router;
