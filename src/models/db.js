import { connect, Schema, model } from "mongoose";

connect(
  "mongodb+srv://Alisha:1234@cluster0.pjpeksk.mongodb.net/DriveTest?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    if (error) {
      console.log(
        "********MongoDB not connected due to the error below*********"
      );
      console.log(error);
    } else {
      console.log("*******MongoDB Connected Successfully!!!*********");
    }
  }
);

const BookTest = new Schema({
  FirstName: String,
  LastName: String,
  Age: Number,
  LicenseNumber: String,
  CarDetails: {
    ModelName: String,
    ModelYear: Number,
    PlateNumber: Number,
  },
});

const DrivingTest = model("BookDrivingTest", BookTest); // Creating a Model

const Users = new Schema({
  username: {
    type: String,
    default: "Default",
  },
  email: {
    type: String,
    default: "Default",
  },
  password: {
    type: String,
    default: "Default",
  },
  userType: {
    type: String,
    default: "Default",
  },
  firstname: {
    type: String,
    default: "Default",
  },
  lastname: {
    type: String,
    default: "Default",
  },
  age: {
    type: Number,
    default: 0,
  },
  licenseNumber: {
    type: String,
    default: "Default",
  },
  carInfo: {
    type: {
      make: String,
      modelName: String,
      modelYear: String,
      plateNumber: String,
    },
    default: {
      make: "Default",
      modelName: "Default",
      modelYear: "Default",
      plateNumber: "Default",
    },
  },
});

const User = model("Users", Users); // Creating a Model
// module.exports = user

// export { DrivingTest, User };

const appointmentSchema=Schema({
  date:String,
  time:String,
  isTimeSlotAvailable:Boolean,});

  const appointmentModel= model("appointment",appointmentSchema)

export {DrivingTest, User,appointmentModel};


