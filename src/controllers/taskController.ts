import { Request, Response } from 'express';
import Task from '../models/Task';

interface AuthRequest extends Request {
    user?: any;
}

export const createTask = async (req: AuthRequest, res: Response) => {
    const { title } = req.body;
    const userId = req.user.id;
    try {
        const newTask = new Task({ title, userId });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error });
    }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;
    try {
        const tasks = await Task.find({ userId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error getting tasks', error });
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    try {
        const task = await Task.findByIdAndUpdate(id, { title, completed }, { new: true });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        await Task.findByIdAndDelete(id);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
};
