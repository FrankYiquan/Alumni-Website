const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const randToken = require ("rand-token");

const userSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      isAdmin:{type: Boolean, default: false},
      
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password:{
          type: String,
          required: true,
      },
      role:{
          type: String,
          enum: ["student", "alumni"],
          default: "student",
      },
      graduationYear:{
          type: Number,
          required: true,
      },
      major:{
          type:String,
          required:true,
      },
      job:{
          type:String,
      },
      company:{
          type:String,
      },
      city:{
          type:String,
      },
      state:{
          type:String,
      },
      country:{
          type:String,
      },
      zipCode: {
        type: Number,
        min: [10000, "Zip code is too short"],
        max: [99999, "Zip code is too long"],
      },
      bio:{
          type:String
      },
      interests:[{
          type:String
      }],
      apiToken: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );

  

  userSchema.plugin(passportLocalMongoose, { usernameField: "email" });


  
  userSchema.methods.getInfo = function () {
    return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
  };
  userSchema.methods.findLocalUsers = function () {
    return this.model("User").find({ zipCode: this.zipCode });
  };

  userSchema.pre("save", function (next) {
    let user = this;
    if (!user.apiToken) {
      user.apiToken = randToken.generate(16);
      next();
    } else {
      next();
    }
  });
  
  
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;


