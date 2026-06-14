const pool = require('./db');

async function getAllPatients() {
    const result = await pool.query('SELECT * FROM patients ORDER BY id');
    return result.rows;
}

async function getPatientById(id) {
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);
    return result.rows[0];
}

async function createPatient(firstName, lastName, phone, email, birthDate, address) {
    const query = `
        INSERT INTO patients (first_name, last_name, phone, email, birth_date, address)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    const values = [firstName, lastName, phone, email, birthDate, address];
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function updatePatient(id, firstName, lastName, phone, email, birthDate, address) {
    const query = `
        UPDATE patients 
        SET first_name = $1, last_name = $2, phone = $3, email = $4, 
            birth_date = $5, address = $6
        WHERE id = $7
        RETURNING *
    `;
    const values = [firstName, lastName, phone, email, birthDate, address, id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function deletePatient(id) {
    await pool.query('DELETE FROM patients WHERE id = $1', [id]);
    return true;
}

module.exports = {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient
};