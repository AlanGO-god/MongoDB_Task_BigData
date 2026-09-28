import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A task title is required'],
      trim: true,
      minlength: [3, 'Title must have at least 3 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    completed: {
      type: Boolean,
      default: false
    },
    dueDate: {
      type: Date,
      validate: {
        validator: value => !value || value > new Date(),
        message: 'Due date must be in the future'
      }
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

export const Task = mongoose.model('Task', taskSchema);