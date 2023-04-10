import { appointmentModel } from "../models/db.js";

export default async (req, res) => {
  const { date } = req.query;
  try {
    const slotTime = await appointmentModel.find({ date });
    res.json({ date: date, slotTime: slotTime });
    return;
  } catch (err) {
    console.log(err);
  }
};
