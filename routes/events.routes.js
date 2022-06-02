const router = require("express").Router();

const mongoose = require("mongoose");
const fileUploader = require("../config/cloudinary.config");

const User = require("../models/User.model");
const Event = require("../models/Event.model");

/* WHAT CAN YOU FIND HERE?
- GET ROUTE TO SEE ALL EVENTS
- POST ROUTE TO CREATE EVENT
- POST ROUTE TO ATTEND EVENT
- GET ROUTE TO SEE ALL MY EVENTS --> CHECK IF RIGHT AND ADD TO THE PAPER
- GET ROUTE TO SEE ONE SPECIFIC EVENT
- PUT ROUTE TO UPDATE EVENT
- DELETE ROUTE TO DELETE EVENT
*/

/* ADD CONDITIONAL: YOU CAN ONLY EDIT THE EVENT IF YOU'RE THE CREATOR! */

router.post("/events/create", fileUploader.single("image"), (req, res, nex) => {
  const { name, location, date, creator, attendees, image } = req.body;

  Event.create({
    name,
    image,
    /* image: req.file.path, */
    location,
    date,
    creator,
  }).then((event) => {
    return User.findByIdAndUpdate(
      creator,
      { $push: { myEvents: event._id } },
      { new: true }
    )
      .then((user) => {
        res.json(user);
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        return res.status(500).json({ errorMessage: error.message });
      });
  });
});

router.put(
  "/events/:eventId",
  fileUploader.single("image"),
  (req, res, nex) => {
    const { name, location, date, creator, attendees, image } = req.body;
    const { eventId } = req.params;
    const { _id } = req.payload;

    Event.findById(eventId).then((event) => {
      if (event.creator !== _id) {
        res.status(400).json({ errorMessage: "Not the creator of the event" });
        return;
      }
    });
    if (req.file) {
      Event.findByIdAndUpdate(
        eventId,
        {
          name,
          image,
          /* image: req.file.path, */
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
        eventId,
        {
          name,
          image,
          /*  image: req.file.path, */
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
  }
);

router.get("/events", (req, res, next) => {
  Event.find()
    .populate("creator")
    .then((events) => {
      res.json(events);
    })
    .catch((err) => res.status(500).json({ errorMessage: error.message }));
});

router.post("/events/:eventId/attend", (req, res, next) => {
  const { eventId } = req.params;
  const { _id } = req.payload;

  Event.findByIdAndUpdate(eventId, { $push: { attendees: _id } }, { new: true })
    .then(() => {
      User.findByIdAndUpdate(
        _id,
        { $push: { myEvents: eventId } },
        { new: true }
      );
    })
    .catch((err) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
});

router.get("/user-events/:id", (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .populate("myEvents")
    .then((user) => {
      res.json(user);
    })
    .catch((err) =>
      res.status(400).json({ message: "Invalid event supplied" })
    );
});

router.get("/events/:id", (req, res, nex) => {
  const { id } = req.params;

  Event.findById(id)
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

router.delete("/events/:eventId", (req, res, next) => {
  const { eventId } = req.params;
  const { _id } = req.payload;

  Event.findById(eventId).then((event) => {
    if (event.creator !== _id) {
      res.status(400).json({ errorMessage: "Not the creator of the event" });
      return;
    } else {
      Event.findByIdAndRemove(eventId)
        .then((response) => res.json(response))
        .then((event) => {
          User.findByIdAndUpdate(
            _id,
            { $pull: { myEvents: event._id } },
            { new: true }
          ).then((user) => {
            res.json(user);
          });
        })
        .catch((err) =>
          res.status(400).json({ message: "Invalid event supplied" })
        );
    }
  });
});

module.exports = router;
