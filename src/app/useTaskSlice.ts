import axios from "axios";
import { create } from "zustand";

interface Task {
	title: string;
	completed: boolean;
	id: number;
}

interface TaskState {
	loading: boolean;
	error: {
		message: string;
	};
	tasks: Task[];
	fetchTask: () => Promise<void>;
	addTask: (task: Task) => void;
	removeTask: (id: number) => void;
	editTask: (updatedTask: Task, id: number) => void;
}

export const useTaskSlice = create<TaskState>((set) => ({
	loading: false,
	error: {
		message: "",
	},
	tasks: [],
	fetchTask: async () => {
		set((state) => ({ ...state, loading: true }));
		try {
			const res = await axios.get<Task[]>("http://localhost:3000/tasks");
			const data = res.data;
			set((state) => ({ ...state, tasks: data, loading: false }));
		} catch (error) {
			set((state) => ({
				...state,
				error: (state.error as any).message,
				loading: false,
			}));
		}
	},
	addTask: async (task: Task) => {
		try {
			const res = await axios.post("http://localhost:3000/tasks", task);
			const data = await res.data;
			console.log(`${data} added`);
		} catch (error) {
			console.log(error);
		}
		set((state) => ({ ...state, tasks: [...state.tasks, task] }));
	},
	removeTask: async (id: number) => {
		try {
			const res = await axios.delete(`http://localhost:3000/tasks/${id}`);
			const data = await res.data;
			console.log(`${data} deleted`);
		} catch (error) {
			console.log(error);
		}
		set((state) => ({
			tasks: state.tasks.filter((task: Task) => task.id !== id),
		}));
	},
	editTask: async (updatedTask: Task, id) => {
		try {
			const res = await axios.put(
				`http://localhost:3000/tasks/${id}`,
				updatedTask
			);
			const data = await res.data;
			console.log(data);
		} catch (error) {}
		set((state) => ({
			tasks: state.tasks.map((currentTask: Task) =>
				currentTask.id === id ? updatedTask : currentTask
			),
		}));
	},
}));
