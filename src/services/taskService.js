import { Task } from '../models/task.js';

// Campos del dueño que se devuelven en cada tarea (igual que index2.js)
const OWNER_FIELDS = { _id: 1, name: 1, email: 1 };

export const findAll = (filter = {}) =>
  Task.find(filter)
    .populate('owner', OWNER_FIELDS)
    .select('title priority completed dueDate owner')
    .lean();

export const findById = (id) =>
  Task.findById(id).populate('owner', OWNER_FIELDS).lean();

export const create = (data) => Task.create(data);

export const update = (id, data) =>
  Task.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('owner', OWNER_FIELDS)
    .lean();

export const remove = (id) => Task.findByIdAndDelete(id).lean();