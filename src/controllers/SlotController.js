import { appointmentModel } from "../models/db.js";

export default (req, res) => {
  const { date } = req.query;

  appointmentModel
    .find({ date })
    .then((slotTime) => {
      res.status(200).send({ date: date, slotTime: slotTime });
    })
    .catch((error) => {
      console.log(error);
    });
};
