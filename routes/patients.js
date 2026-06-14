const express = require('express');
const router = express.Router();
const patientModel = require('../models/patientModel');

// List all patients
router.get('/', async (req, res) => {
    try {
        const patients = await patientModel.getAllPatients();
        res.render('pages/patients/list', { patients, title: 'Patients' });
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', { title: 'Error', message: error.message });
    }
});

// Show create form
router.get('/create', (req, res) => {
    res.render('pages/patients/create', { title: 'Add Patient' });
});

// Create patient
router.post('/create', async (req, res) => {
    try {
        const { firstName, lastName, phone, email, birthDate, address } = req.body;
        await patientModel.createPatient(firstName, lastName, phone, email, birthDate, address);
        res.redirect('/patients');
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', { title: 'Error', message: error.message });
    }
});

// Show edit form
router.get('/edit/:id', async (req, res) => {
    try {
        const patient = await patientModel.getPatientById(req.params.id);
        if (!patient) {
            return res.status(404).render('pages/404', { title: 'Not Found' });
        }
        res.render('pages/patients/edit', { patient, title: 'Edit Patient' });
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', { title: 'Error', message: error.message });
    }
});

// Update patient
router.post('/edit/:id', async (req, res) => {
    try {
        const { firstName, lastName, phone, email, birthDate, address } = req.body;
        await patientModel.updatePatient(req.params.id, firstName, lastName, phone, email, birthDate, address);
        res.redirect('/patients');
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', { title: 'Error', message: error.message });
    }
});

// Delete patient
router.post('/delete/:id', async (req, res) => {
    try {
        await patientModel.deletePatient(req.params.id);
        res.redirect('/patients');
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', { title: 'Error', message: error.message });
    }
});

module.exports = router;