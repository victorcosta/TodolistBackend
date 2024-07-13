import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
    title: string;
    completed: boolean;
    userId: mongoose.Schema.Types.ObjectId;
}

const taskSchema: Schema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model<ITask>('Task', taskSchema);
