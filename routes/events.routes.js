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

router.post("/upload", fileUploader.single("image"), (req, res, next) => {
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

  res.json({ fileUrl: req.file.path });
});

router.post(
  "/events/create",
  fileUploader.single("image"),
  async (req, res, nex) => {
    try {
      const {
        name,
        location,
        date,
        typeOfEvent,
        creator,
        attendees,
        image,
        description,
      } = req.body;
      const { _id } = req.payload;

      let newEvent;
      if (req.file) {
        newEvent = await Event.create({
          name,
          /* image, */
          description,
          image: req.file.path,
          location,
          typeOfEvent,
          date,
          creator: _id,
        });
      } else {
        newEvent = await Event.create({
          name,
          description,
          image,
          location,
          typeOfEvent,
          date,
          creator: _id,
        });
      }

      let creatorMyEvents = await User.findByIdAndUpdate(
        _id,
        { $push: { myEvents: newEvent._id } },
        { new: true }
      );
      res.json(newEvent);
    } catch (error) {
      console.log(error);
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: error.message });
    }
  }
);

router.put(
  "/events/:eventId",
  fileUploader.single("image"),
  (req, res, nex) => {
    const { name, location, date, creator, attendees, image, description } =
      req.body;
    const { eventId } = req.params;
    const { _id } = req.payload;

    Event.findById(eventId).then((event) => {
      if (event.creator != _id) {
        res.status(400).json({ errorMessage: "Not the creator of the event" });
        return;
      }
    });

    if (req.file) {
      Event.findByIdAndUpdate(
        eventId,
        {
          name,
          image: req.file.path,
          description,
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
          description,
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

//SEE ALL EVENTS

router.get("/events", (req, res, next) => {
  Event.find()
    .populate("creator")
    .then((events) => {
      res.json(events);
    })
    .catch((err) => res.status(500).json({ errorMessage: error.message }));
});

//ATTEND AN EVENT
router.post("/events/:eventId/attend", async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { _id } = req.payload;

    console.log("_________", req.payload);

    let user = await User.findById(_id);
    console.log(user);
    if (user.myEvents.includes(eventId)) res.status(400);

    let eventWithAttendee = await Event.findByIdAndUpdate(
      eventId,
      { $push: { attendees: _id } },
      { new: true }
    );

    let updateMyEvents = await User.findByIdAndUpdate(
      _id,
      { $push: { myEvents: eventId } },
      { new: true }
    );

    res.json(eventWithAttendee);
  } catch (error) {
    console.log(error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ errorMessage: error.message });
    }
    return res.status(500).json({ errorMessage: error.message });
  }
});

//SEE SPECIFIC EVENT
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

//SEE USER'S EVENTS
router.get("/user-events/:id", (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .populate("myEvents")
    .populate({
      path: "myEvents",
      populate: { path: "creator attendees" },
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) =>
      res.status(400).json({ message: "Invalid event supplied" })
    );
});

//Remove Event from list
router.put("/my-events/:eventId", async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { _id } = req.payload;

    let eventWithoutAttendee = await Event.findByIdAndUpdate(
      eventId,
      { $pull: { attendees: _id } },
      { new: true }
    );

    let updateMyEvents = await User.findByIdAndUpdate(
      _id,
      { $pull: { myEvents: eventId } },
      { new: true }
    );

    res.json(eventWithoutAttendee);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ errorMessage: error.message });
    }
    return res.status(500).json({ errorMessage: error.message });
  }
});

//DELETE EVENT
router.delete("/events/:eventId", (req, res, next) => {
  const { eventId } = req.params;
  console.log("______________________________DELETE", req.params);
  const { _id } = req.payload;

  Event.findById(eventId).then((event) => {
    if (event.creator != _id) {
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
