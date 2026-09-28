import { User } from '../models/user.js';

export const findAll = () => User.find().lean();

export const findById = (id) => User.findById(id).lean();

export const create = (data) => User.create(data);

export const update = (id, data) =>
  User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();

export const remove = (id) => User.findByIdAndDelete(id).lean();