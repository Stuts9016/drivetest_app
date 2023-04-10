const { carRegistrationModel } = require("../db.js");

module.exports = (req, res, next) => {
  carRegistrationModel.findById(req.session.userId, (error, user) => {
    if (error || !user) {
      console.log(error);
      return res.redirect("/login");
    }
    switch (user.role) {
      case "driver":
        {
          if (req.url == "/gtest" || req.url == "/g2test") next();
          else return res.redirect("/");
        }
        break;
      case "admin":
        {
          if (req.url == "/gtest" || req.url == "/g2test")
            return res.redirect("/");
        }
        break;

      case "examiner":
        {
          if (req.url == "/gtest" || req.url == "/g2test")
            return res.redirect("/");
        }
        break;

      default:
        break;
    }
    // next()
  });
};
