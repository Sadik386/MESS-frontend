import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import MemberDashboard from '../components/Dashboard/MemberDashboard';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="mt-10">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p className="text-xl mb-6">Welcome, {user && user.name}</p>

            {user && user.role === 'admin' ? (
                <AdminDashboard />
            ) : (
                <MemberDashboard />
            )}
        </div>
    );
};

export default Dashboard;
