import { Router } from "express";
import { startOfHour, parseISO } from "date-fns";
import AppointmentsRepository from "../repositories/AppointmentsRepository";

const appointmentsRouter = Router();

const appointmentsRepository = new AppointmentsRepository();

// interface Appointment {
//     id: string;
//     provider: string;
//     date: Date;
// }
// não é mais necessário devido ao arquivo Appoimtments.ts na pasta models

// const appointments: Array<Appointment> = [];

appointmentsRouter.get("/", (request, response) => {
    const appointments = appointmentsRepository.all();

    return response.json(appointments);
});

appointmentsRouter.post("/", (request, response) => {
    const { provider, date } = request.body;

    const parsedDate = startOfHour(parseISO(date));

    const findAppointmentsInSameDate = appointmentsRepository.findByDate(
        parsedDate,
    );

    if (findAppointmentsInSameDate) {
        response
            .status(400)
            .json({ message: "This appointment is alredy booked!" });
    }

    const appointment = appointmentsRepository.create(provider, parsedDate);

    return response.json(appointment);
});

export default appointmentsRouter;
