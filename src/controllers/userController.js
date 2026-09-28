import * as userService from '../services/userService.js';
import { handleError } from './handleError.js';

export async function getUsers(req, res) {
  try {
    const users = await userService.findAll();
    res.status(200).json(users);
  } catch (error) {
    handleError(res, error);
  }
}

export async function getUserById(req, res) {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    handleError(res, error);
  }
}

export async function createUser(req, res) {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    handleError(res, error);
  }
}

export async function updateUser(req, res) {
  try {
    const user = await userService.update(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    handleError(res, error);
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await userService.remove(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted', id: user._id });
  } catch (error) {
    handleError(res, error);
  }
}