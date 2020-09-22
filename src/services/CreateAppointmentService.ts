/* eslint-disable camelcase */
import { startOfHour } from "date-fns";
import { getCustomRepository } from "typeorm";
import AppError from "../errors/AppError";

import Appointment from "../models/Appointment";
import AppointmentsRepository from "../repositories/AppointmentsRepository";

interface RequestDTO {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    public async execute({
        date,
        provider_id,
    }: RequestDTO): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        const appointmentsRepository = getCustomRepository(
            AppointmentsRepository,
        );

        const findAppointmentsInSameDate = await appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentsInSameDate) {
            throw new AppError("This appointment is alredy booked!");
        }

        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        });

        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
