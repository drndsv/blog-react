import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, TextField, Container, Typography } from '@mui/material';
import { register } from '../lib/api';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async () => {
        try {
            await register(email, password, name);
            router.push('/login');
        } catch (err) {
            console.error('Registration failed:', err);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <TextField
                fullWidth
                label="Name"
                margin="normal"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
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
                onClick={handleRegister}
                style={{ marginTop: '16px' }}
            >
                Register
            </Button>
        </Container>
    );
};

export default RegisterPage;