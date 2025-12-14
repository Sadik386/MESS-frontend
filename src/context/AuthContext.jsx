import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

const AuthContext = createContext();

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload
            };
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                loading: false
            };
        case 'AUTH_ERROR':
        case 'LOGIN_FAIL':
        case 'LOGOUT':
        case 'REGISTER_FAIL':
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const loadUser = async () => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            setAuthToken(token);
            try {
                const user = JSON.parse(userData);
                dispatch({
                    type: 'USER_LOADED',
                    payload: user
                });
                return;
            } catch (err) {
                console.error('Error parsing user data:', err);
            }
        }

        dispatch({ type: 'AUTH_ERROR' });
    };

    useEffect(() => {
        loadUser();
    }, []);

    // Login User
    const login = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, formData, config);

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: res.data
            });

            // Store user data in localStorage
            if (res.data.user) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
            }

            // loadUser();
        } catch (err) {
            dispatch({
                type: 'LOGIN_FAIL',
                payload: err.response.data.msg
            });
        }
    };

    // Logout
    const logout = () => dispatch({ type: 'LOGOUT' });

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                user: state.user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

// Helper to set auth token
const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
};
