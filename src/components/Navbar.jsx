import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useContext(AuthContext);

    const onLogout = () => {
        logout();
    };

    const authLinks = (
        <ul className="flex space-x-4">
            <li>
                <span className="text-white">Hello, {user && user.name}</span>
            </li>
            <li>
                <a onClick={onLogout} href="#!" className="text-white hover:text-gray-300">
                    Logout
                </a>
            </li>
        </ul>
    );

    const guestLinks = (
        <ul className="flex space-x-4">
            <li>
                <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
            </li>
        </ul>
    );

    return (
        <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-xl font-bold">Mess Manager</Link>
                {isAuthenticated ? authLinks : guestLinks}
            </div>
        </nav>
    );
};

export default Navbar;
