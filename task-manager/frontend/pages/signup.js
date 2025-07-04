import { useState } from 'react';
import { useRouter } from 'next/router';
import API from '../services/api';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/signup', { username, email, password });
            localStorage.setItem('token', res.data.token);
            router.push('/dashboard');
        } catch (err) {
            alert('Signup Failed');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSignup} className="space-y-4 p-8 shadow-lg rounded-lg">
                <h2 className="text-2xl">Signup</h2>
                <input type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} className="block w-full border p-2" />
                <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full border p-2" />
                <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full border p-2" />
                <button type="submit" className="bg-green-500 text-white p-2 w-full rounded">Signup</button>
                <p>Already have an account? <a href="/" className="text-blue-500">Login</a></p>
            </form>
        </div>
    );
}
