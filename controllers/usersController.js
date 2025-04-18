const User = require("../models/user");
const passport = require("passport");

//set up user params or field
const getUserParams = (body) => {
  return {
    name: body.name,
    email: body.email,
    password: body.password,
    zipCode: body.zipCode,
    role: body.role,
    major: body.major,
    graduationYear: body.graduationYear,
    job: body.job,
    company: body.company,
    city: body.city,
    state: body.state,
    country: body.country,
    bio: body.bio,
    interests: body.interests,
  };
};

module.exports = {
  //show all the users 
  index: (req, res, next) => {
    User.find()
      .then((users) => {
        res.locals.users = users;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("users/index");
  },

//create new users
  new: (req, res) => {
    res.render("users/new");
   
  },

  create: (req, res, next) => {
    if (req.skip) next();
    let newUser = new User(getUserParams(req.body));
    User.register(newUser, req.body.password, (error, user) => {
      if (user) {
        req.flash(
          "success",
          `${user.name}'s account created successfully!`
        );
        res.locals.redirect = "/users";
        next();
      } else {
        req.flash(
          "error",
          `Failed to create user account because:${error.message}.`
        );
        res.locals.redirect = "/users/new";
        next();
      }
    });
  },


// show users after clikcing on it + edit
show: (req, res, next) => {
  let userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      res.locals.user = user;
      next();
    })
    .catch((error) => {
      console.log(`Error fetching user by ID: ${error.message}`);
      next(error);
    });
},


// redirect website from one webpage to the another
redirectView: (req, res, next) => {
  let redirectPath = res.locals.redirect;
  if (redirectPath) res.redirect(redirectPath);
  else next();
},

  //render users/show view
  showView: (req, res) => {
    res.render("users/show");
  },

  //edit user info
  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        res.render("users/edit", {
          user: user,
        });
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  //update user info
  update: (req, res, next) => {
    let userId = req.params.id,
      userParams = getUserParams(req.body);
    User.findByIdAndUpdate(userId, {
      $set: userParams,
    })
      .then((user) => {
        req.flash(
          "success",
          `${user.name}'s account updated successfully!`
        );
        res.locals.redirect = `/users/${userId}`;
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        req.flash(`Error updating user by ID: ${error.message}`);
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },


  //delete a message
  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findOneAndDelete({ _id: userId }) // Change to findOneAndDelete
      .then(() => {
        res.locals.redirect = "/users";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },

  //user login
  login: (req, res) => {
    res.render("users/login");
  },
  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Failed to login.",
    successRedirect: "/users",
    successFlash: "Login successful!",
  }),

  //provide vlaidations before a new user is created
  validate: (req, res, next) => {
    req
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true,
      })
      .trim();
    req.check("email", "Email is invalid").isEmail();
    req
      .check("zipCode", "Zip code is invalid")
      .notEmpty()
      .isInt()
      .isLength({
        min: 5,
        max: 5,
      })
      .equals(req.body.zipCode);
    req.check("password", "Password cannot be empty").notEmpty();
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

  //handle logout
  logout: (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
  
      req.flash('success', 'Logout successful!');
      console.log("Logout successful");
      // Redirect to the home page after logout
      res.locals.redirect = "/";
      
      next();
    });
  },
//check the apiToken query param
verifyToken: (req, res, next) => {
  let token = req.query.apiToken;
  //console.log(token);

  if (token) {
    User.findOne({ apiToken: token })
      .then((user) => {
        if (user) {
          next();
          console.log("I pass the next")
        }
        else {
          next(new Error("Invalid API token"));
        }
      })
      .catch((error) => {

        next(new Error(error.message));
      });
    
  } else {
   
    next(new Error("Invalid API token"));
  }
},
  
}


