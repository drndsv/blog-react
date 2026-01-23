import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, TextField, Container, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setToken } from '../store/store';
import { login } from '../lib/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const dispatch = useDispatch();

    const handleLogin = async () => {
        try {
            const token = await login(email, password);
            if (token) {
                dispatch(setToken(token));
                router.push('/');
            }
        } catch (err) {
            console.error('Login failed:', err);
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <TextField
                fullWidth
                label="Email"
                margin="normal"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleLogin}
                style={{ marginTop: '16px' }}
            >
                Login
            </Button>
            <Button
                fullWidth
                variant="text"
                color="secondary"
                onClick={() => router.push('/register')}
                style={{ marginTop: '8px' }}
            >
                Register
            </Button>
        </Container>
    );
};

export default LoginPage;