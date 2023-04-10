import { compare, hash } from "bcrypt";
import { User } from "../models/db.js";

class AuthController {
  // to get the form data from signup.ejs
  // Then create a new user using DrivingTest.create()
  // We have to use bcrypt for hashing the password
  // before saving to mongodb
  static signup = async (req, res) => {
    const { username, email, password, userType, repass } = req.body;
    const hashedPwd = await hash(password, 10);

    if (password !== repass) {
      req.session.flash = {
        type: "danger",
        message: "Password and Re-Password should be same",
      };
      res.redirect("/signup");
      return;
    }

    if (!username || !email || !password || !userType) {
      req.session.flash = {
        type: "danger",
        message: "Please fill all the fields",
      };
      res.redirect("/signup");
      return;
    }

    if (await User.findOne({ email: email })) {
      req.session.flash = {
        type: "danger",
        message: "Email already exists. Please login or use another email",
      };
      res.redirect("/signup");
      return;
    }

    if (await User.findOne({ username: username })) {
      req.session.flash = {
        type: "danger",
        message:
          "User with given username already exists. Please use another username",
      };
      res.redirect("/signup");
      return;
    }

    User.create(
      {
        username: username,
        email: email,
        password: hashedPwd,
        userType: userType,
      },
      (error) => {
        if (error) {
          console.log(error);
        } else {
          res.redirect("login");
        }
      }
    );
  };

  static login = async (req, res) => {
    const { email, password } = req.body;

    // First we verify that user is existing user in mongo db
    const user_verify = await User.findOne({ email: email });

    if (!user_verify) {
      req.session.flash = {
        type: "danger",
        message: "If you are a new User Signup First or Enter Valid data",
      };
      res.redirect("/login");
    } else {
      // Now We know That user is in db
      // We have to cofirm the password by decrypting it
      const pwd_matched = await compare(password, user_verify.password);

      if (!pwd_matched) {
        req.session.flash = {
          type: "danger",
          message: "Invalid Password Try Again",
        };
        res.redirect("/login");
      } else {
        req.session.uid = user_verify.id;
        req.session.userType = user_verify.userType;
        res.redirect("/dashboard");
      }
    }
  };
}

export default AuthController;
