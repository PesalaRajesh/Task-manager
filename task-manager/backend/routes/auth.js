const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Task } = require('../models');
const { auth } = require('../middleware');

const router = express.Router();

// Signup
router.post('/auth/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error creating user' });
    }
});

// Login
router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error logging in' });
    }
});

// Get all tasks (Admin or user)
router.get('/tasks', auth, async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'admin') {
            tasks = await Task.findAll({ include: [{ model: User }] });
        } else {
            tasks = await Task.findAll({ where: { user_id: req.user.id } });
        }
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error fetching tasks' });
    }
});

// Create task
router.post('/tasks', auth, async (req, res) => {
    try {
        const { title, description } = req.body;
        const task = await Task.create({ title, description, user_id: req.user.id });
        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error creating task' });
    }
});

// Update task
router.put('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        if (req.user.role !== 'admin' && task.user_id !== req.user.id)
            return res.status(403).json({ msg: 'Unauthorized' });

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.status = req.body.status || task.status;

        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error updating task' });
    }
});

// Delete task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        if (req.user.role !== 'admin' && task.user_id !== req.user.id)
            return res.status(403).json({ msg: 'Unauthorized' });

        await task.destroy();
        res.json({ msg: 'Task deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error deleting task' });
    }
});

module.exports = router;
