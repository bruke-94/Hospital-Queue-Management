const pool = require('./db');

async function getAllDoctors() {
    const result = await pool.query('SELECT * FROM doctors ORDER BY name');
    return result.rows;
}

async function getDoctorById(id) {
    const result = await pool.query('SELECT * FROM doctors WHERE id = $1', [id]);
    return result.rows[0];
}

async function createDoctor(name, specialty, phone, email) {
    const query = `
        INSERT INTO doctors (name, specialty, phone, email)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const values = [name, specialty, phone, email];
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function updateDoctor(id, name, specialty, phone, email) {
    const query = `
        UPDATE doctors 
        SET name = $1, specialty = $2, phone = $3, email = $4
        WHERE id = $5
        RETURNING *
    `;
    const values = [name, specialty, phone, email, id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function deleteDoctor(id) {
    await pool.query('DELETE FROM doctors WHERE id = $1', [id]);
    return true;
}

module.exports = {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
};