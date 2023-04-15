//  This controller is used to get the slot time for a particular date
import { appointmentModel } from "../models/db.js";

export default async (req, res) => {
  const { date } = req.query;
  try {
    console.log(date);
    const slotTime = await appointmentModel.find({ date });
    console.log(slotTime);
    res.json({ date: date, slotTime: slotTime });
    return;
  } catch (err) {
    console.log(err);
  }
};
