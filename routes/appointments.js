const express = require('express');
const router = express.Router();
const appointmentModel = require('../models/appointmentModel');
const patientModel = require('../models/patientModel');
const doctorModel = require('../models/doctorModel');

router.get('/', async (req, res) => {
    try {
        const appointments = await appointmentModel.getAllAppointments();
        res.render('pages/appointments/list', { appointments, title: 'Appointments' });
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', { title: 'Error', message: error.message });
    }
});

router.get('/create', async (req, res) => {
    try {
        const patients = await patientModel.getAllPatients();
        const doctors = await doctorModel.getAllDoctors();
        res.render('pages/appointments/create', { patients, doctors, title: 'Book Appointment' });
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', { title: 'Error', message: error.message });
    }
});

router.post('/create', async (req, res) => {
    try {
        const { patientId, doctorId, date, time, reason } = req.body;
        await appointmentModel.createAppointment(patientId, doctorId, date, time, reason);
        res.redirect('/appointments');
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', { title: 'Error', message: error.message });
    }
});

router.get('/edit/:id', async (req, res) => {
    try {
        const appointment = await appointmentModel.getAppointmentById(req.params.id);
        const doctors = await doctorModel.getAllDoctors();
        if (!appointment) {
            return res.status(404).render('pages/404', { title: 'Not Found' });
        }
        res.render('pages/appointments/edit', { appointment, doctors, title: 'Edit Appointment' });
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', { title: 'Error', message: error.message });
    }
});

router.post('/edit/:id', async (req, res) => {
    try {
        const { doctorId, date, time, status, reason } = req.body;
        await appointmentModel.updateAppointment(req.params.id, doctorId, date, time, status, reason);
        res.redirect('/appointments');
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', { title: 'Error', message: error.message });
    }
});

router.post('/delete/:id', async (req, res) => {
    try {
        await appointmentModel.deleteAppointment(req.params.id);
        res.redirect('/appointments');
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', { title: 'Error', message: error.message });
    }
});

module.exports = router;