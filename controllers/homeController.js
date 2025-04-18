module.exports = {
  //render home page
  respondWithHome: (req, res) => {
    res.render("home");
  },

  //render about page
  respondWithAbout: (req, res) => {
    res.render("about");
  },

  //render events page
  respondWithEvents: (req, res) => {
    res.render("events");
  },

  //render contact page
  respondWithContact: (req, res) => {
    if (req.method == "GET") {
      res.render("contact");
    } else if (req.method == "POST") {
      let name = req.body.name;
      let message = req.body.message;
      res.render("contact", { name: name, message: message });
    }
  },

  //render jobs view
  respondWithJobs: (req, res) => {
    res.render("jobs");
  },

  //handel chat view
  chat: (req, res) => {
    res.render("chat");
  },
};
