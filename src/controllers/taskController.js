const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.createTask = async (req, res) => {
  const { title, description, dueDate, priority, status, assignedTo } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    let parsedDueDate = null;
    if (dueDate) {
      parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({ message: 'Invalid due date format' });
      }
    }

    let assignedToUser = null;
    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({ message: 'Invalid assignedTo ID format' });
      }
      assignedToUser = await User.findById(assignedTo);
      if (!assignedToUser) {
        return res.status(400).json({ message: 'AssignedTo user not found' });
      }
    }

    const validPriorities = ['Low', 'Medium', 'High'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority value' });
    }

    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = new Task({
      title,
      description,
      dueDate: parsedDueDate,
      priority: priority || 'Medium',
      status: status || 'Pending',
      assignee: req.user.id, // Logged-in user is the assignee (creator)
      assignedTo: assignedTo || null,
    });

    await task.save();

    if (assignedToUser) {
      const io = req.app.get('io');
      io.to(assignedTo).emit('notification', {
        message: `You have been assigned to complete task: ${title}`,
        taskId: task._id,
        type: 'task',
        createdAt: new Date(),
      });
    }

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Task validation failed', errors: error.errors });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid data format', error: error.message });
    }
    res.status(500).json({ message: 'Server error during task creation', error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  const { search, priority, status, dueDate } = req.query;

  try {
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (priority) {
      query.priority = priority;
    }
    if (status) {
      query.status = status;
    }
    if (dueDate) {
      const startOfDay = new Date(dueDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dueDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.dueDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const tasks = await Task.find(query)
      .populate('assignee', 'username')
      .populate('assignedTo', 'username');
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, priority, status, assignedTo } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    let parsedDueDate = null;
    if (dueDate) {
      parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({ message: 'Invalid due date format' });
      }
    }

    let assignedToUser = null;
    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({ message: 'Invalid assignedTo ID format' });
      }
      assignedToUser = await User.findById(assignedTo);
      if (!assignedToUser) {
        return res.status(400).json({ message: 'AssignedTo user not found' });
      }
    }

    const validPriorities = ['Low', 'Medium', 'High'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority value' });
    }

    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = parsedDueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
    // assignee remains unchanged (logged-in user who created the task)

    await task.save();

    if (assignedToUser && assignedTo !== task.assignedTo) {
      const io = req.app.get('io');
      io.to(assignedTo).emit('notification', {
        message: `You have been assigned to complete task: ${task.title}`,
        taskId: task._id,
        type: 'task',
        createdAt: new Date(),
      });
    }

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Task validation failed', errors: error.errors });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid data format', error: error.message });
    }
    res.status(500).json({ message: 'Server error during task update', error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.remove();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error during task deletion', error: error.message });
  }
};