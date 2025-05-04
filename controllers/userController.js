import { getAllUsers, addUser } from '../models/userModel.js';

export async function getUsers(req, res) {
  const users = await getAllUsers();
  res.json(users);
}

export async function createUser(req, res) {
  const { name, email } = req.body;
  try {
    const result = await addUser(name, email);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
