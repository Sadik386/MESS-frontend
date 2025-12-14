import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const Register = () => {
    const authContext = useContext(AuthContext);
    const { isAuthenticated } = authContext;
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'member'
    });

    const { name, email, password, role } = user;

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (name === '' || email === '' || password === '') {
            alert('Please fill in all fields');
        } else {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                const res = await axios.post(`${API_URL}/api/auth/register`, {
                    name,
                    email,
                    password,
                    role
                }, config);

                localStorage.setItem('token', res.data.token);
                alert('Registration successful! Please login.');
                navigate('/login');
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.msg || 'Registration failed');
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md">
                <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-center text-2xl font-bold mb-6">Register</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Full Name"
                            name="name"
                            value={name}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="******************"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                            Role
                        </label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="role"
                            name="role"
                            value={role}
                            onChange={onChange}
                        >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            type="submit"
                        >
                            Register
                        </button>
                    </div>
                    <p className="text-center text-gray-600 text-sm mt-4">
                        Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-700">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
