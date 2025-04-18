const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        location:{
            type: String,
            required: true,
        },
        eventCreater:{
            type: String,
            required: true,
            unique: true,
        },
        startDate:{
            type: Date,
            required: true,
        },
        endDate:{
            type: Date,
            required: true,
        },
        isOnline:{
            type: Boolean,
            default: false,
        },
        registrationLink:{
            type:String
        },
        organizer:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:true
        },
        attendees:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }]
    }
)

eventSchema.methods.getInfo = function () {
    return `Title: ${this.title} Description: ${this.description} Location ${this.location}`;
  };
  eventSchema.methods.findLocalEvents = function () {
    return this.model("Event").find({ title: this.title });
  };


const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
