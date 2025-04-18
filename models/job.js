const mongoose = require("mongoose"); 
const jobSchema = mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
        },
        company:{
            type: String,
            required: true,
        },
        location:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        requirement:{
            type: String,
            required: true,
        },
        salary:{
            type: Number,
            required: true,
        },
        contactEmail:{
            type: String,
            required: true,
        },
        contactPhone:{
            type: String,
            required: true,
        },
        postDate:{
            type: Date,
            default: Date.now,
        },
        deadlineDate:{
            type: Date,
            required: true,
        },
        jobCreater:{
            type: String,
            required: true,
            unique: true,
        },
        isActive:{
            type: Boolean,
            default: true,
        }
    }
);
jobSchema.methods.getInfo = function () {
    return `Title: ${this.title} company: ${this.company} location: ${this.location}`;
  };
  jobSchema.methods.findLocalJobs = function () {
    return this.model("Job").find({ title: this.title });
  };


const Job = mongoose.model('Job', jobSchema);
  
  module.exports = Job;