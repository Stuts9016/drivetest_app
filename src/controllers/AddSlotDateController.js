//  Controller to add a new date and time slot to the database
import { appointmentModel } from "../models/db.js";

const AddSlotDateController = (req, res) => {
    const appointment = new appointmentModel({
        date: req.body.date,
        time: req.body.time,
        isTimeSlotAvailable: true,
    });
    appointment.save().then((result) => {
        res.redirect('/appointment');
    }).catch((error) => {
        console.log(error);
    });
}

export default AddSlotDateController ;
