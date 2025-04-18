const Job = require("../models/job");

//set up job params
const getJobParams = (body, userEmail) => {
  return {
    title: body.title,
    company: body.company,
    location: body.location,
    description: body.description,
    requirement: body.requirement,
    salary: body.salary,
    contactEmail: body.contactEmail,
    contactPhone: body.contactPhone,
    postDate: body.postDate,
    deadlineDate: body.deadlineDate,
    isActive: body.isActive,
    jobCreater: userEmail,
  };
};

module.exports = {
  //show all the jobs 
  index: (req, res, next) => {
    Job.find()
      .then((jobs) => {
        res.locals.jobs = jobs;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching jobs: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("jobs/index");
  },

//create new jobs
  new: (req, res) => {
    res.render("jobs/new");
  },

  create: (req, res, next) => {
    if (req.skip) next();
    //assign who creates the job   
    const userEmail = req.user.email;
    console.log(`creater email: ${userEmail}`); 
    let JobParams = getJobParams(req.body, userEmail);
    Job.create(JobParams)
      .then((job) => {
        req.flash(
          "success",
          `${job.title}'s account created successfully!`
        );

        res.locals.redirect = "/jobs";
        res.locals.job = job;
        next();
      })
      .catch((error) => {
        console.log(`Error saving job: ${error.message}`);
        req.flash(
          "error",
          `Failed to create job account because: ${error.message}.`
        );
        res.locals.redirect = "/jobs/new";
        next();
      });
  },


// show jobs after clikcing on it + edit
show: (req, res, next) => {
  let jobId = req.params.id;
  Job.findById(jobId)
    .then((job) => {
      res.locals.job = job;
      next();
    })
    .catch((error) => {
      console.log(`Error fetching job by ID: ${error.message}`);
      next(error);
    });
},


// redirct the webpage from on page to the another
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  //render jobs/show view
  showView: (req, res) => {
    res.render("jobs/show");
  },

  //edit user info
  edit: (req, res, next) => {
    let jobID = req.params.id;
    Job.findById(jobID)
      .then((job) => {
        res.render("jobs/edit", {
          job: job,
        });
      })
      .catch((error) => {
        console.log(`Error fetching job: ${error.message}`);
        next(error);
      });
  },

  //update user info
  update: (req, res, next) => {
    let jobID = req.params.id,
      jobParams = getJobParams(req.body);
    Job.findByIdAndUpdate(jobID, {
      $set: jobParams,
    })
      .then((job) => {
        req.flash(
            "success",
            `${job.title}'s account updated successfully!`
          );
        res.locals.redirect = `/jobs/${jobID}`;
        res.locals.job = job;
        next();
      })
      .catch((error) => {
        req.flash(`Error updating job: ${error.message}`);
        console.log(`Error updating job: ${error.message}`);
        next(error);
      });
  },


  //delete a message
  delete: (req, res, next) => {
    let jobID = req.params.id;
    Job.findOneAndDelete({ _id: jobID }) // Change to findOneAndDelete
      .then(() => {
        res.locals.redirect = "/jobs";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting job ${error.message}`);
        next();
      });
  },

//add validation before creating new jobs
validate: (req, res, next) => {
  req.check("title", "Title cannot be empty").notEmpty();
  req.check("company", "Company cannot be empty").notEmpty();
  req.check("location", "Location cannot be empty").notEmpty();
  req.check("description", "Description cannot be empty").notEmpty();
  req.check("requirement", "Requirement cannot be empty").notEmpty();
  req.check("salary", "salary cannot be empty").notEmpty();
  req.check("contactEmail", "ContactEmail cannot be empty").notEmpty();
  req.check("contactPhone", "ContactPhone cannot be empty").notEmpty();
  req.check("deadlineDate", "DeadlineDate cannot be empty").notEmpty();
  req.check("isActive", "IsActive cannot be empty").notEmpty();

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

//check whether to user are admin or creator of job
checkUser: async (req, res, next) => {
  let jobCreater = "";

  const jobId = req.params.id;

  try {
    const job = await Job.findById(jobId).exec();

    if (!job) {
      console.log('Job not found');
    } else {
      console.log('Found job:', job);
      // Access the jobCreator field
      jobCreater = job.jobCreater;
      //console.log('Job Creator:', jobCreater);
    }
  } catch (error) {
    console.error('Error fetching job by ID:', error.message);
  }

  //console.log(`user: ${req.user.email}`);
  //console.log(`user is admin: ${req.user.isAdmin}`);

  if (req.user.isAdmin || jobCreater === req.user.email) {
    return next();
  } else {
   // console.log("I am at 2");
    req.flash('error', 'You are not eligible to access this page.');
    res.redirect('/jobs');
  }
},

//check whether user is admin to delete a job
deleteJob: (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  } else {
   // console.log("I am at 2");
    req.flash('error', 'You are not eligible to perform this function.');
    res.redirect('/jobs');
  }
}

  
}


//req.user.email === req.job.jobCreater