import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
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
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          Blog
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="inherit" onClick={() => router.push('/')}>
            Home
          </Button>

          {user && (
            <Button color="inherit" onClick={() => router.push('/profile')}>
              Profile
            </Button>
          )}

          {!user ? (
            <>
              <Button color="inherit" onClick={() => router.push('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => router.push('/register')}>
                Register
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
