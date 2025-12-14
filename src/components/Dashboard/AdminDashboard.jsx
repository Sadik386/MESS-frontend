import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import API_URL from '../../config/api';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Meal State
    const [meals, setMeals] = useState({}); // { userId: { lunch: 0, dinner: 0 } }

    // Expense State
    const [expenseForm, setExpenseForm] = useState({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [expenses, setExpenses] = useState([]);

    // Payment/Deposit State
    const [paymentForm, setPaymentForm] = useState({
        userId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'deposit'
    });
    const [payments, setPayments] = useState([]);

    // Meal Rate State (auto-calculated)
    const [mealRateData, setMealRateData] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        totalExpenses: 0,
        totalMeals: 0,
        mealRate: 0
    });

    // Member name editing state
    const [editingMember, setEditingMember] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchRecentExpenses();
        fetchRecentPayments();
        fetchMealRate();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/users`, {
                headers: { 'x-auth-token': token }
            });
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchRecentExpenses = async () => {
        try {
            const token = localStorage.getItem('token');
            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();
            const res = await axios.get(`${API_URL}/api/expenses/${month}/${year}`, {
                headers: { 'x-auth-token': token }
            });
            setExpenses(res.data.slice(0, 5)); // Show only last 5
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRecentPayments = async () => {
        try {
            const token = localStorage.getItem('token');
            // We'll need to modify this to get all payments, not just for one user
            // For now, we'll skip this or create a new endpoint
            // Let's just leave it empty for now
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMealRate = async () => {
        try {
            const token = localStorage.getItem('token');
            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();
            const res = await axios.get(`${API_URL}/api/reports/meal-rate/${month}/${year}`, {
                headers: { 'x-auth-token': token }
            });
            setMealRateData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleMealChange = (userId, type, value) => {
        setMeals(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [type]: value
            }
        }));
    };

    const submitMeals = async () => {
        try {
            const token = localStorage.getItem('token');
            for (const [userId, mealData] of Object.entries(meals)) {
                await axios.post(`${API_URL}/api/meals`, {
                    userId,
                    date: selectedDate,
                    lunch: mealData.lunch || 0,
                    dinner: mealData.dinner || 0
                }, {
                    headers: { 'x-auth-token': token }
                });
            }
            alert('Meals updated successfully');
            setMeals({});
        } catch (err) {
            console.error(err);
            alert('Error updating meals');
        }
    };

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/expenses`, expenseForm, {
                headers: { 'x-auth-token': token }
            });
            alert('Expense added successfully');
            setExpenseForm({
                description: '',
                amount: '',
                date: new Date().toISOString().split('T')[0]
            });
            fetchRecentExpenses();
        } catch (err) {
            console.error(err);
            alert('Error adding expense');
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/payments`, paymentForm, {
                headers: { 'x-auth-token': token }
            });
            alert('Payment/Deposit added successfully');
            setPaymentForm({
                userId: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                type: 'deposit'
            });
            fetchUsers(); // Refresh to show updated balances
        } catch (err) {
            console.error(err);
            alert('Error adding payment');
        }
    };

    const updateMemberName = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/users/${userId}`,
                { name: editName },
                { headers: { 'x-auth-token': token } }
            );
            alert('Member name updated successfully');
            setEditingMember(null);
            setEditName('');
            fetchUsers(); // Refresh user list
        } catch (err) {
            console.error(err);
            alert('Error updating member name');
        }
    };

    const startEditingMember = (user) => {
        setEditingMember(user._id);
        setEditName(user.name);
    };

    const cancelEditingMember = () => {
        setEditingMember(null);
        setEditName('');
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

            {/* Auto-Calculated Meal Rate Display */}
            <div className="bg-white p-6 rounded shadow mb-6">
                <h3 className="text-xl font-semibold mb-4">Current Meal Rate (Auto-Calculated)</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="p-4 bg-blue-50 rounded">
                        <p className="text-sm text-gray-600">Month/Year</p>
                        <p className="text-2xl font-bold text-blue-600">{mealRateData.month}/{mealRateData.year}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded">
                        <p className="text-sm text-gray-600">Total Expenses</p>
                        <p className="text-2xl font-bold text-green-600">৳{mealRateData.totalExpenses}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded">
                        <p className="text-sm text-gray-600">Total Meals</p>
                        <p className="text-2xl font-bold text-purple-600">{mealRateData.totalMeals}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded">
                        <p className="text-sm text-gray-600">Meal Rate</p>
                        <p className="text-2xl font-bold text-orange-600">৳{mealRateData.mealRate}</p>
                    </div>
                </div>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <p>Formula: Meal Rate = Total Expenses ÷ Total Meals</p>
                    <p className="mt-1">Calculation: ৳{mealRateData.totalExpenses} ÷ {mealRateData.totalMeals} = ৳{mealRateData.mealRate}</p>
                </div>
            </div>

            {/* Member Management */}
            <div className="bg-white p-6 rounded shadow mb-6">
                <h3 className="text-xl font-semibold mb-4">Manage Members</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Role</th>
                                <th className="px-4 py-2 text-right">Deposit</th>
                                <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} className="border-b">
                                    <td className="px-4 py-2">
                                        {editingMember === u._id ? (
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="border rounded px-2 py-1 w-full"
                                            />
                                        ) : (
                                            u.name
                                        )}
                                    </td>
                                    <td className="px-4 py-2">{u.email}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-right">৳{u.deposit || 0}</td>
                                    <td className="px-4 py-2 text-center">
                                        {editingMember === u._id ? (
                                            <>
                                                <button
                                                    onClick={() => updateMemberName(u._id)}
                                                    className="bg-green-500 text-white px-3 py-1 rounded text-sm mr-2"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEditingMember}
                                                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => startEditingMember(u)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Edit Name
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Daily Meal Entry */}
            <div className="bg-white p-6 rounded shadow mb-6">
                <h3 className="text-xl font-semibold mb-4">Daily Meal Entry</h3>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Member</th>
                                <th className="px-4 py-2">Lunch</th>
                                <th className="px-4 py-2">Dinner</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} className="border-b">
                                    <td className="px-4 py-2">{u.name}</td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            min="0"
                                            value={meals[u._id]?.lunch || ''}
                                            className="border rounded w-16 px-2 py-1"
                                            onChange={(e) => handleMealChange(u._id, 'lunch', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            min="0"
                                            value={meals[u._id]?.dinner || ''}
                                            className="border rounded w-16 px-2 py-1"
                                            onChange={(e) => handleMealChange(u._id, 'dinner', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button
                    onClick={submitMeals}
                    className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Save Meals
                </button>
            </div>

            {/* Add Expense Section */}
            <div className="bg-white p-6 rounded shadow mb-6">
                <h3 className="text-xl font-semibold mb-4">Add Expense</h3>
                <form onSubmit={handleExpenseSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <input
                            type="text"
                            value={expenseForm.description}
                            onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            placeholder="e.g., Rice, Vegetables"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Amount (৳)</label>
                        <input
                            type="number"
                            value={expenseForm.amount}
                            onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                        <input
                            type="date"
                            value={expenseForm.date}
                            onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full"
                        >
                            Add Expense
                        </button>
                    </div>
                </form>

                {/* Recent Expenses */}
                {expenses.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">Recent Expenses</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-3 py-2 text-left">Date</th>
                                        <th className="px-3 py-2 text-left">Description</th>
                                        <th className="px-3 py-2 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map(expense => (
                                        <tr key={expense._id} className="border-b">
                                            <td className="px-3 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                                            <td className="px-3 py-2">{expense.description}</td>
                                            <td className="px-3 py-2 text-right">৳{expense.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Deposit/Payment Section */}
            <div className="bg-white p-6 rounded shadow mb-6">
                <h3 className="text-xl font-semibold mb-4">Add Deposit/Payment</h3>
                <form onSubmit={handlePaymentSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Member</label>
                        <select
                            value={paymentForm.userId}
                            onChange={(e) => setPaymentForm({ ...paymentForm, userId: e.target.value })}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            required
                        >
                            <option value="">Select Member</option>
                            {users.map(u => (
                                <option key={u._id} value={u._id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Amount (৳)</label>
                        <input
                            type="number"
                            value={paymentForm.amount}
                            onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                        <select
                            value={paymentForm.type}
                            onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                        >
                            <option value="deposit">Deposit</option>
                            <option value="due_payment">Due Payment</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                        <input
                            type="date"
                            value={paymentForm.date}
                            onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                        >
                            Add Payment
                        </button>
                    </div>
                </form>

                {/* Member Balances */}
                <div className="mt-4">
                    <h4 className="font-semibold mb-2">Member Deposits</h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-3 py-2 text-left">Member</th>
                                    <th className="px-3 py-2 text-right">Total Deposit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} className="border-b">
                                        <td className="px-3 py-2">{u.name}</td>
                                        <td className="px-3 py-2 text-right">৳{u.deposit || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
