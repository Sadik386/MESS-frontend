import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import API_URL from '../../config/api';

const MemberDashboard = () => {
    const { user } = useContext(AuthContext);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchReport();
        }
    }, [user]);

    const fetchReport = async () => {
        try {
            const date = new Date();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const token = localStorage.getItem('token');
            // We need an endpoint to get specific user report or just filter from monthly report
            // Let's use the monthly report endpoint and filter for current user
            const res = await axios.get(`${API_URL}/api/reports/monthly/${month}/${year}`, {
                headers: { 'x-auth-token': token }
            });

            const myReport = res.data.reports.find(r => r.user.id === user.id);
            setReport(myReport);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">My Dashboard</h2>

            {report ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-100 p-4 rounded shadow">
                        <h3 className="text-lg font-semibold text-blue-800">Total Meals</h3>
                        <p className="text-3xl font-bold text-blue-600">{report.totalMeals}</p>
                    </div>
                    <div className="bg-green-100 p-4 rounded shadow">
                        <h3 className="text-lg font-semibold text-green-800">Deposit (This Month)</h3>
                        <p className="text-3xl font-bold text-green-600">{report.totalDepositThisMonth}</p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded shadow">
                        <h3 className="text-lg font-semibold text-yellow-800">Meal Rate</h3>
                        <p className="text-3xl font-bold text-yellow-600">{report.mealRate}</p>
                    </div>
                    <div className="bg-red-100 p-4 rounded shadow">
                        <h3 className="text-lg font-semibold text-red-800">Total Cost</h3>
                        <p className="text-3xl font-bold text-red-600">{report.totalCost}</p>
                    </div>
                </div>
            ) : (
                <p>No data available for this month.</p>
            )}

            <div className="mt-8 bg-white p-6 rounded shadow">
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                <p>Coming soon...</p>
            </div>
        </div>
    );
};

export default MemberDashboard;
