import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { logout } from '../lib/api';
import { RootState, setUser, setToken } from '../store/store';

const Header = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        logout();
        dispatch(setUser(null));
        dispatch(setToken(null));
        router.push('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Blog
                </Typography>
                {!user ? (
                    <Button color="inherit" onClick={() => router.push('/login')}>
                        Login
                    </Button>
                ) : (
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;