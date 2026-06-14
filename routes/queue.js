const express = require('express');
const router = express.Router();
const appointmentModel = require('../models/appointmentModel');

router.get('/today', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const appointments = await appointmentModel.getTodayAppointments(today);
        res.render('pages/queue/today', { appointments, today, title: "Today's Queue" });
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', { title: 'Error', message: error.message });
    }
});

router.get('/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const appointments = await appointmentModel.getTodayAppointments(date);
        res.render('pages/queue/today', { appointments, today: date, title: `Queue for ${date}` });
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', { title: 'Error', message: error.message });
    }
});

module.exports = router;