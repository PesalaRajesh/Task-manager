import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import API from '../services/api';

export default function Dashboard() {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
        }
    }, []);

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const router = useRouter();

    const fetchTasks = async () => {
        try {
            const res = await API.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.log(err);
            router.push('/');
        }
    };

    useEffect(() => { fetchTasks(); }, []);

    const createTask = async (e) => {
        e.preventDefault();
        await API.post('/tasks', { title, description });
        setTitle('');
        setDescription('');
        fetchTasks();
    };

    const deleteTask = async (id) => {
        await API.delete(`/tasks/${id}`);
        fetchTasks();
    };

    const updateStatus = async (id, status) => {
        await API.put(`/tasks/${id}`, { status });
        fetchTasks();
    };

    const logout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl mb-4">Dashboard</h2>
            <button onClick={logout} className="mb-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
            <form onSubmit={createTask} className="mb-4 space-y-2">
                <input type="text" placeholder="Task Title" required value={title} onChange={(e) => setTitle(e.target.value)} className="block w-full border p-2" />
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="block w-full border p-2" />
                <button type="submit" className="bg-green-500 text-white p-2 w-full rounded">Add Task</button>
            </form>

            <ul>
                {tasks.map(task => (
                    <li key={task.id} className="mb-2 border p-4 rounded">
                        <h4 className="text-xl">{task.title}</h4>
                        <p>{task.description}</p>
                        <p>Status: {task.status}</p>
                        <button onClick={() => updateStatus(task.id, 'Pending')} className="mr-2 bg-yellow-500 text-white px-2 rounded">Pending</button>
                        <button onClick={() => updateStatus(task.id, 'In Progress')} className="mr-2 bg-blue-500 text-white px-2 rounded">In Progress</button>
                        <button onClick={() => updateStatus(task.id, 'Completed')} className="mr-2 bg-green-500 text-white px-2 rounded">Completed</button>
                        <button onClick={() => deleteTask(task.id)} className="bg-red-500 text-white px-2 rounded">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
