import { hash } from "bcrypt";
import { User,appointmentModel } from "../models/db.js";

class UserController {
  static async getCurrentUser(req, res) {
    return await User.findOne({
      _id: req.session.uid,
    });
  }

  static async updateCurrentUser(req, res) {
    const {
      licenseNumber,
      firstname,
      lastname,
      age,
      modelName,
      modelYear,
      plateNumber,
      make,
      date,
      time
    } = req.body;

    const user = await User.findOne({ _id: req.session.uid });
    let updateData = {};

    if (
      await User.findOne({
        licenseNumber: await hash(licenseNumber, 10),
      })
    ) {
      req.session.flash = {
        type: "danger",
        message:
          "License Number already exists. Please use another license number",
      };
      return;
    }

    if (user.licenseNumber === "Default") {
      if (
        !licenseNumber ||
        !firstname ||
        !lastname ||
        !age ||
        !modelName ||
        !modelYear ||
        !plateNumber ||
        !make ||
        !date ||
        !time
      ) {
        req.session.flash = {
          type: "danger",
          message: "Please fill all the fields",
        };
        return;
      }

      updateData = {
        licenseNumber: await hash(licenseNumber, 10),
        firstname: firstname,
        lastname: lastname,
        age: age,
        carInfo: {
          modelName: modelName,
          modelYear: modelYear,
          make: make,
          plateNumber: plateNumber,
        },
      };
    } else {
      if (!modelName || !modelYear || !plateNumber || !make) {
        req.session.flash = {
          type: "danger",
          message: "Please fill all the fields",
        };
        return;
      }
      updateData = {
        carInfo: {
          modelName: modelName,
          modelYear: modelYear,
          make: make,
          plateNumber: plateNumber,
        },
      };
    }

    const all_details = User.findOneAndUpdate(
      {
        _id: req.session.uid,
      },
      updateData
    );
    appointmentModel.find(
      {
        $and: [
          {
            date: date,
            time: time,
          },
        ],
      },
      (error, data) => {
        if (error || !data) {
          console.log(error);
        } else {
          // res.end(html);
          // console.log(form_data);
          appointmentModel.findByIdAndUpdate(
            data[0]._id,
            { isTimeSlotAvailable: false },
            (error, updated) => {
              if (error || !updated) {
                console.log(error);
              } 
              
            }
          );
        }
      }
    );
    req.session.flash = {
      type: "success",
      message: "User Details Updated Successfully",
    };
    return all_details;
  }
}

export default UserController;
