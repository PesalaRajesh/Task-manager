import { useState } from 'react';
import { useRouter } from 'next/router';
import API from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/login', { email, password });
            localStorage.setItem('token', res.data.token);
            router.push('/dashboard');
        } catch (err) {
            alert('Login Failed');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleLogin} className="space-y-4 p-8 shadow-lg rounded-lg">
                <h2 className="text-2xl">Login</h2>
                <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full border p-2" />
                <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full border p-2" />
                <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">Login</button>
                <p>Don't have an account? <a href="/signup" className="text-blue-500">Signup</a></p>
            </form>
        </div>
    );
}
