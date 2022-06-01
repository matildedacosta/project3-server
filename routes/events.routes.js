const router = require("express").Router();

const mongoose = require("mongoose");
const fileUploader = require("../config/cloudinary.config"); //DOWNLOAD?

const User = require("../models/User.model");
const Event = require("../models/Event.model");

router.post("/events/create", fileUploader.single("image"), (req, res, nex) => {
  const { name, image, location, date, creator, attendees } = req.body;

  Event.create({
    name,
    image: req.file.path,
    location,
    date,
    creator,
    attendees,
  })
    .then((event) => {
      res.status(201).json(event);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
});

router.get("/events", (req, res, nex) => {
  res.json();
});

router.get("/events/:id", (req, res, nex) => {
  const { id } = req.params;
  Event.findOne(id)
    .populate("creator attendees")
    .then((event) => {
      res.json(event);
    })
    .catch((err) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
});

router.put("/events/:id", fileUploader.single("image"), (req, res, nex) => {
  const { name, location, date, creator, attendees } = req.body;

  if (req.file) {
    Event.findByIdAndUpdate(
      id,
      {
        name,
        image: req.file.path,
        location,
        date,
        creator,
        attendees,
      },
      { new: true }
    )

      .then((response) => res.json(response))
      .catch((err) => res.status(400).json({ message: "No event updated" }));
  } else {
    Event.findByIdAndUpdate(
      id,
      {
        name,
        location,
        date,
        creator,
        attendees,
      },
      { new: true }
    )

      .then((response) => res.json(response))
      .catch((err) => res.status(400).json({ message: "No event updated" }));
  }
});

router.delete("/events/:id", (req, res, next) => {
  const { id } = req.params;
  Event.findByIdAndRemove(id)
    .then((response) => res.json(response))
    .catch((err) =>
      res.status(400).json({ message: "Invalid event supplied" })
    );
});

module.exports = router;
