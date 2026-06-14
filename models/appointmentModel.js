const pool = require('./db');

async function getAllAppointments() {
    const query = `
        SELECT a.*, 
               p.first_name, p.last_name,
               d.name as doctor_name, d.specialty
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN doctors d ON a.doctor_id = d.id
        ORDER BY a.appointment_date DESC, a.appointment_time
    `;
    const result = await pool.query(query);
    return result.rows;
}

async function getAppointmentById(id) {
    const query = `
        SELECT a.*, 
               p.first_name, p.last_name, p.phone as patient_phone,
               d.name as doctor_name, d.specialty
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN doctors d ON a.doctor_id = d.id
        WHERE a.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

async function createAppointment(patientId, doctorId, date, time, reason) {
    const query = `
        INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
        VALUES ($1, $2, $3, $4, $5, 'scheduled')
        RETURNING *
    `;
    const values = [patientId, doctorId, date, time, reason];
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function updateAppointment(id, doctorId, date, time, status, reason) {
    const query = `
        UPDATE appointments 
        SET doctor_id = $1, appointment_date = $2, appointment_time = $3, 
            status = $4, reason = $5
        WHERE id = $6
        RETURNING *
    `;
    const values = [doctorId, date, time, status, reason, id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function deleteAppointment(id) {
    await pool.query('DELETE FROM appointments WHERE id = $1', [id]);
    return true;
}

async function getTodayAppointments(date) {
    const query = `
        SELECT a.*, 
               p.first_name, p.last_name, p.phone,
               d.name as doctor_name, d.specialty
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN doctors d ON a.doctor_id = d.id
        WHERE a.appointment_date = $1 AND a.status != 'cancelled'
        ORDER BY a.appointment_time
    `;
    const result = await pool.query(query, [date]);
    return result.rows;
}

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getTodayAppointments
};