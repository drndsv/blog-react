import { Container, Typography, Button } from '@mui/material';
import { GetServerSideProps } from 'next';
import { getUserProfile } from '../lib/api';
import { wrapper, setUser } from '../store/store';
import Header from '../components/Header';
import cookie from 'cookie';
import { useRouter } from 'next/router';

const HomePage = ({ user }) => {
    const router = useRouter();

    return (
        <div>
            <Header />
            <Container>
                <Typography variant="h4" gutterBottom>
                    Welcome to the Blog!
                </Typography>
                {user ? (
                    <Typography variant="h6">Hello, {user.name}!</Typography>
                ) : (
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => router.push('/login')}
                    >
                        Go to Login
                    </Button>
                )}
            </Container>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (store) => async ({ req }) => {
        try {
            const cookies = cookie.parse(req.headers.cookie || '');
            const token = cookies.jwt;
            const user = token ? await getUserProfile(token) : null;
            store.dispatch(setUser(user));
            return { props: { user } };
        } catch (err) {
            console.error('Error fetching profile:', err);
            return { props: { user: null } };
        }
    }
);

export default HomePage;