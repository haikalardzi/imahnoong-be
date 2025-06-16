import { getAllUsers, createUser, editUser, deleteUser } from './user.service.js';

export async function getAllUsersHandler(req, reply) {
    try {
        const users = await getAllUsers();
        reply.send(users);
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}

export async function createUserHandler(req, reply) {
    try {
        const { username, password, role } = req.body;
        await createUser(username, password, role);
        reply.send({ message: 'User created' });
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}

export async function editUserHandler(req, reply) {
    try {
        const id = req.params.id;
        const { username, role } = req.body;
        await editUser(id, username, role);
        reply.send({ message: 'User edited' });
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}

export async function deleteUserHandler(req, reply) {
    try {
        const { id } = req.body;
        await deleteUser(id);
        reply.send({ message: 'User deleted' });
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}