const express = require('express');
const router = express.Router();
const doctorModel = require('../models/doctorModel');

router.get('/', async (req, res) => {
    try {
        const doctors = await doctorModel.getAllDoctors();
        res.render('pages/doctors/list', { doctors, title: 'Doctors' });
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', { title: 'Error', message: error.message });
    }
});

router.get('/create', (req, res) => {
    res.render('pages/doctors/create', { title: 'Add Doctor' });
});

router.post('/create', async (req, res) => {
    try {
        const { name, specialty, phone, email } = req.body;
        await doctorModel.createDoctor(name, specialty, phone, email);
        res.redirect('/doctors');
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', { title: 'Error', message: error.message });
    }
});

router.get('/edit/:id', async (req, res) => {
    try {
        const doctor = await doctorModel.getDoctorById(req.params.id);
        if (!doctor) {
            return res.status(404).render('pages/404', { title: 'Not Found' });
        }
        res.render('pages/doctors/edit', { doctor, title: 'Edit Doctor' });
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', { title: 'Error', message: error.message });
    }
});

router.post('/edit/:id', async (req, res) => {
    try {
        const { name, specialty, phone, email } = req.body;
        await doctorModel.updateDoctor(req.params.id, name, specialty, phone, email);
        res.redirect('/doctors');
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', { title: 'Error', message: error.message });
    }
});

router.post('/delete/:id', async (req, res) => {
    try {
        await doctorModel.deleteDoctor(req.params.id);
        res.redirect('/doctors');
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', { title: 'Error', message: error.message });
    }
});

module.exports = router;