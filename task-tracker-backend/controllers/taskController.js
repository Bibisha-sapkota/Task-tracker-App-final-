const Task = require('../models/taskModel');

const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.status(200).json(tasks);
};

const createTask = async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.user._id });
  res.status(201).json(task);
};

const updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  res.status(200).json(task);
};

const deleteTask = async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.status(204).end();
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
