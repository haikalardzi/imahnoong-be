import db from "../../../config/db.js";

export async function deleteRecord(id) {
    return db('observation_records').where({ id }).update({ disable: true });
}

export async function getAllRecords() {
    return db('observation_records').where({ disable: false });
}