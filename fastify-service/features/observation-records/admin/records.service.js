import db from "../../../config/db.js";

export async function deleteRecord(id) {
    return db('observation_records').where({ id }).update({ is_deleted: true });
}

export async function getAllRecords() {
    return db('observation_records').where({ is_deleted: false });
}