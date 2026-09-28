import * as taskService from '../services/taskService.js';
import { handleError } from './handleError.js';

// GET /tasks?owner=<id>&priority=high&completed=false  (todos los filtros son opcionales)
export async function getTasks(req, res) {
  try {
    const { owner, priority, completed } = req.query;
    const filter = {};
    if (owner) filter.owner = owner;
    if (priority) filter.priority = priority;
    if (completed !== undefined) filter.completed = completed === 'true';

    const tasks = await taskService.findAll(filter);
    res.status(200).json(tasks);
  } catch (error) {
    handleError(res, error);
  }
}

export async function getTaskById(req, res) {
  try {
    const task = await taskService.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    handleError(res, error);
  }
}

export async function createTask(req, res) {
  try {
    const task = await taskService.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    handleError(res, error);
  }
}

export async function updateTask(req, res) {
  try {
    const task = await taskService.update(req.params.id, req.body);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    handleError(res, error);
  }
}

export async function deleteTask(req, res) {
  try {
    const task = await taskService.remove(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json({ message: 'Task deleted', id: task._id });
  } catch (error) {
    handleError(res, error);
  }
}