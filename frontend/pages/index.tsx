import {
  Container,
  Typography,
  Button,
  Stack,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import { getUserProfile, getArticles } from '../lib/api';
import { wrapper, setUser } from '../store/store';
import Header from '../components/Header';
import cookie from 'cookie';
import { useRouter } from 'next/router';
import type { Article } from '../lib/apiTypes';

type HomePageProps = {
  user: {
    id: number;
    email: string;
    name: string;
  } | null;
  articles: Article[];
};

const HomePage = ({ user, articles }: HomePageProps) => {
  const router = useRouter();

  return (
    <div>
      <Header />
      <Container sx={{ py: 4 }}>
        <Stack spacing={3}>
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

          <Box>
            <Typography variant="h5" gutterBottom>
              Latest Articles
            </Typography>

            {articles.length === 0 ? (
              <Typography color="text.secondary">No articles yet.</Typography>
            ) : (
              <Stack spacing={2}>
                {articles.map((article) => (
                  <Card key={article.id} variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {article.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Author: {article.author?.name ?? 'Unknown'}
                      </Typography>

                      <Typography variant="body1">{article.content}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </Container>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async ({ req }) => {
    try {
      const cookies = cookie.parse(req.headers.cookie || '');
      const token = cookies.jwt;

      const [articlesResponse, user] = await Promise.all([
        getArticles(1, 20),
        token ? getUserProfile(token) : Promise.resolve(null),
      ]);

      store.dispatch(setUser(user));
      return {
        props: {
          user,
          articles: articlesResponse.data,
        },
      };
    } catch (err) {
      console.error('Error fetching home page data:', err);
      return {
        props: {
          user: null,
          articles: [],
        },
      };
    }
  });

export default HomePage;
