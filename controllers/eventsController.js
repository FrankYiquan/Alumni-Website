const Event = require("../models/event");
const User = require("../models/user");
const mongoose = require("mongoose");
const passport = require("passport");
const ObjectId = mongoose.Types.ObjectId;
const httpStatus = require("http-status-codes");


//set up event params
const getEventParams = (body, userEmail) => {
  
    return {
        title: body.title,
        description: body.description,
        location: body.location,
        startDate: body.startDate,
        endDate: body.endDate,
        isOnline: body.isOnline,
        registrationLink: body.registrationLink,
        organizer: body.organizer,
        attendees: body.attendees,
        eventCreater: userEmail,
    };
};



module.exports = {
    //show all the events 
    index: (req, res, next) => {
      Event.find()
        .then((events) => {
          res.locals.events = events;
          next();
        })
        .catch((error) => {
          console.log(`Error fetching events: ${error.message}`);
          next(error);
        });
    },
    // indexView: (req, res) => {
    //   res.render("events/index");
    //   //res.json(res.locals.events);
    // },
  
    //api for events for either display events in json format or not
    indexView: (req, res) => {
      res.render("events/index");
    },


  //create new events
    new: (req, res) => {
      res.render("events/new");
    },

      
    create: async (req, res, next) => {
      if (req.skip) next();
      const userEmail = req.user.email;
        let eventParams = getEventParams(req.body, userEmail);

        try {
            // Find organizer and attendees by username
            const organizer = await User.findOne({ name: eventParams.organizer });
            const attendees = await User.find({ name: { $in: eventParams.attendees } });
    
            if (!organizer) {
                throw new Error('Organizer not found');
            }
    
            eventParams.organizer = organizer._id;
    
            if (!attendees) {
                throw new Error('One or more attendees not found');
            }
    
            eventParams.attendees = attendees.map((attendee) => attendee._id);
    
            const event = await Event.create(eventParams);
    
            req.flash('success', `${event.title} event created successfully!`);
            res.locals.redirect = '/events';
            res.locals.event = event;
            next();
        } catch (error) {
            console.log(`Error saving event: ${error.message}`);
            req.flash('error', `Failed to create event because: ${error.message}.`);
            res.locals.redirect = '/events/new';
            next();
        }
    },
    
  
 // show users after clikcing on it + edit
show: (req, res, next) => {
  let eventId = req.params.id;
  Event.findById(eventId)
    .then((event) => {
      res.locals.event = event;
      next();
    })
    .catch((error) => {
      console.log(`Error fetching event: ${error.message}`);
      next(error);
    });
},

  
  //redirct website from one webpage to the another
    redirectView: (req, res, next) => {
      let redirectPath = res.locals.redirect;
      if (redirectPath) res.redirect(redirectPath);
      else next();
    },
  
    showView: (req, res) => {
      res.render("events/show");
    },
  
    edit: (req, res, next) => {
      let eventId = req.params.id;
      
      Event.findById(eventId)
        .then((event) => {
          res.render("events/edit", {
            event: event,
          });
        })
        .catch((error) => {
          console.log(`Error fetching event: ${error.message}`);
          next(error);
        });
    },

    //update event info
    update: async (req, res, next) => {
      try {
          let eventId = req.params.id;
          let eventParams = getEventParams(req.body);
  
          const organizer = await User.findOne({ name: eventParams.organizer });
          const attendees = await User.find({ name: { $in: eventParams.attendees } });
  
          if (!organizer) {
              throw new Error('Organizer not found');
          }
  
          eventParams.organizer = organizer._id;
  
          if (!attendees) {
              throw new Error('One or more attendees not found');
          }
  
          eventParams.attendees = attendees.map((attendee) => attendee._id);
  
          const event = await Event.findByIdAndUpdate(eventId, {
              $set: eventParams,
          });
          
          req.flash('success', `${event.title} event updated successfully!`);
          res.locals.redirect = `/events/${eventId}`;
          res.locals.event = event;
          next();
      } catch (error) {
        req.flash(`Error updating failed: ${error.message}`);
          console.log(`Error updating event: ${error.message}`);
          next(error);
      }
  },
  
  
  
  // delete method
delete: (req, res, next) => {
  let eventId = req.params.id;
  Event.findOneAndDelete({ _id: eventId }) // Change to findOneAndDelete
    .then(() => {
      res.locals.redirect = "/events";
      next();
    })
    .catch((error) => {
      console.log(`Error deleting user by ID: ${error.message}`);
      next();
    });
},

//get eventID and render expressInerest view
showExpressInterestForm: (req, res) => {
  const eventId = req.params.id;
  //console.log(`my eventId is: ${eventId}`);
  //res.render("events/expressInterest");
  res.render("events/expressInterest", { eventId: eventId });
},


//if user is not a registered use, direct it to the user create page; otherwise, add its id to attendee array within the event
expressInterest: async (req, res, next) => {
  try {

    const userName = req.body.userName;
    
    

    // Check if the entered name corresponds to an existing user
    const existingUser = await User.findOne({ name: userName });

    if (existingUser) {
      // User is found, handle expressing interest
      const user = existingUser;

      
      // Add the user to the event's attendees array if not already present
      const eventId = req.params.id;
      const event = await Event.findById(eventId);
      if (!event.attendees.includes(user._id)) {
        event.attendees.push(user._id);
        await event.save();
      }
      console.log("the user is  found");
      res.redirect(`/events/${eventId}`);
    } else {
      console.log("the user is not found");
      // User is not found, redirect to register page with a flash message
      req.flash('error', 'You are not a registered user. Please register to express interest.');
      res.redirect("/events/new"); // Adjust the route as needed
    }
  } catch (error) {
    console.error(`Error expressing interest: ${error.message}`);
    next(error);
  }
},


//add validation before creating new jobs
validate: (req, res, next) => {
  req.check("title", "Title cannot be empty").notEmpty();
  req.check("description", "Description cannot be empty").notEmpty();
  req.check("location", "Location cannot be empty").notEmpty();
  req.check("startDate", "StartDate cannot be empty").notEmpty();
  req.check("endDate", "EndDate cannot be empty").notEmpty();
  
  req.getValidationResult().then((error) => {
    if (!error.isEmpty()) {
      let messages = error.array().map((e) => e.msg);
      req.skip = true;
      req.flash("error", messages.join(" and "));
      res.locals.redirect = "/users/new";
      next();
    } else {
      next();
    }
  });
},

//check whether user had login
authenticateUser: (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error', 'You must be logged in to access this page.');
    res.redirect('/users/login');
  }
},

//check user is either admin or creater of event to update event
checkUser: async (req, res, next) => {
  let eventCreater = "";

  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId).exec();

    if (!event) {
      console.log('event not found');
    } else {
      console.log('Found event:', event);
      // Access the jobCreator field
      eventCreater = event.eventCreater;
      //console.log('Job Creator:', jobCreater);
    }
  } catch (error) {
    console.error('Error fetching event by ID:', error.message);
  }

  //console.log(`user: ${req.user.email}`);
  //console.log(`user is admin: ${req.user.isAdmin}`);

  if (req.user.isAdmin || eventCreater === req.user.email) {
    return next();
  } else {
   // console.log("I am at 2");
    req.flash('error', 'You are not eligible to access this page.');
    res.redirect('/events');
  }
},

deleteEvent: (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  } else {
   // console.log("I am at 2");
    req.flash('error', 'You are not eligible to perform this function.');
    res.redirect('/events');
  }
},

//handel event mondal
respondJSON: (req, res) => {
  res.json({
    status: httpStatus.OK,
    data: res.locals,
  });
},

//respond error message in JSON format
errorJSON: (error, req, res, next) => {
  let errorObject;
  if (error) {
    errorObject = {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    };
  } else {
    errorObject = {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Unknown Error.",
    };
  }
  res.json(errorObject);
},

//handel join event in modal
join: (req, res, next) => {
  console.log("I am at join");
  let eventId = req.params.id,
    currentUser = req.user;
  console.log(eventId);
  console.log(currentUser);
  if (currentUser) {
    Event.findByIdAndUpdate(eventId, {
      $addToSet: {
        attendees: currentUser._id,
      },
    })
      .then(() => {
        res.locals.success = true;
        next();
      })
      .catch((error) => {
        next(error);
      });
  } else {
    next(new Error("User must log in."));
  }
},



};















  


  