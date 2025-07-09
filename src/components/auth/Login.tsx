import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface LoginFormData {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    const [data, setData] = useState<string>('');
    const navigate = useNavigate();
    const apiRoute = "http://localhost:5000/api";

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${apiRoute}/login`, formData);
            console.log("respppp",res)
            localStorage.setItem('token', res.data.token);
            setData('Login successful!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (error: any) {
            console.error(error.response?.data || error.message);
            setData(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Login
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        fullWidth
                    />
                    <Button variant="contained" color="primary" type="submit">
                        Login
                    </Button>
                    {data && (
                        <Typography variant="body1" color="secondary" align="center">
                            {data}
                        </Typography>
                    )}
                    <Typography variant="body2" align="center">
                        Do not have an account?
                        <Link to="/register">Register</Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
