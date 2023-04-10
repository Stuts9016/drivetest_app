import { Router } from "express";
import AuthController from "../controllers/auth_controller.js";
import UserController from "../controllers/user_controller.js";
import { DrivingTest, User, appointmentModel } from "../models/db.js";

const router = Router();

// Post Method to Add Data to the Database
router.post("/addG2", async (req, res) => {
  await UserController.updateCurrentUser(req, res);
  return res.redirect("/g2");
});

router.get("/viewDetail", (req, res) => {
  const form_data = req.body;

  DrivingTest.findOne(
    { LicenseNumber: form_data.LicenseNumber },
    (error, all_details) => {
      console.log(error, all_details);

      // Finding the Details
      if (error) {
        // Change url to g
        req.session.flash = { type: "danger", message: "No data found" };
        res.render("g.ejs");
      } else {
        if (all_details == null) {
          req.session.flash = { type: "danger", message: "No data found" };

          res.render("g.ejs");
          return;
        }

        res.render("g2_update.ejs", { info: all_details }, (error, html) => {
          if (error) {
            console.log(error);
          } else {
            appointmentModel.find(
              {
                $and: [
                  {
                    date: req.body.date,
                    time: req.body.time,
                  },
                ],
              },
              (error, data) => {
                if (error || !data) {
                  console.log(error);
                } else {
                  // res.end(html);
                  appointmentModel.findByIdAndUpdate(
                    data[0]._id,
                    { isTimeSlotAvailable: false },
                    (error, updated) => {
                      if (error || !updated) {
                        console.log(error);
                      } else {
                        res.redirect("/g2");
                      }
                    }
                  );
                }
              }
            );
          }
        });
      }
    }
  );
});

// Post Method to add data to the database from signup page
router.post("/signup", async (req, res) => {
  return await AuthController.signup(req, res);
});

// Post Method to login to the dashboard
router.post("/login", async (req, res) => {
  return await AuthController.login(req, res);
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    console.log("Session Destroyed");
  });
  res.redirect("/login");
});

router.get("/g", async (req, res) => {
  if (!req.session.uid) return;

  // if (!req.session.uid) {
  //   res.redirect("/login");
  //   return;
  // }

  const user = await UserController.getCurrentUser(req, res);

  if (user.licenseNumber === "Default") {
    res.redirect("/g2");
    return;
  } else {
    res.render("g", {
      info: user,
    });
    return;
  }
});

router.get("/g2", async (req, res) => {
  if (!req.session.uid) return;

  const user = await UserController.getCurrentUser(req, res);

  if (user.licenseNumber === "Default") {
    res.render("g2.ejs");
    return;
  } else {
    res.render("g2_update", {
      info: user,
    });
    return;
  }
});

router.get("/login", (req, res) => {
  res.render("login"); // Rendering the Login Page
});

router.get("/", (req, res) => {
  res.render("dashboard"); // Re-directing to the Dashboard
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard"); // Re-directing to the Dashboard
});

router.get("/signup", (req, res) => {
  res.render("signup"); // Re-directing to the signup
});

export default router;
