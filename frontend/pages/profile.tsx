import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import cookie from 'cookie';

import Header from '../components/Header';
import { getArticles, getComments, getUserProfile } from '../lib/api';
import { wrapper, setUser } from '../store/store';
import type { Article, Comment, User } from '../lib/apiTypes';
import { getImageUrl } from '../lib/utils/getImageUrl';

type ProfilePageProps = {
  user: User | null;
  articles: Article[];
  comments: Comment[];
};

const ProfilePage = ({ user, articles, comments }: ProfilePageProps) => {
  if (!user) {
    return (
      <div>
        <Header />
        <Container sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
          <Typography color="error">
            You are not authorized. Please log in first
          </Typography>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <Container sx={{ py: 4 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h4" gutterBottom>
              My Profile
            </Typography>

            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body1">
                    <strong>ID:</strong> {user.id}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Name:</strong> {user.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {user.email}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom>
              My Articles
            </Typography>

            {articles.length === 0 ? (
              <Typography color="text.secondary">
                You have no articles yet.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {articles.map((article) => (
                  <Card key={article.id} variant="outlined">
                    {article.previewImage && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={getImageUrl(article.previewImage)}
                        alt={article.title}
                      />
                    )}

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

          <Divider />

          <Box>
            <Typography variant="h5" gutterBottom>
              My Comments
            </Typography>

            {comments.length === 0 ? (
              <Typography color="text.secondary">
                You have no comments yet.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {comments.map((comment) => (
                  <Card key={comment.id} variant="outlined">
                    <CardContent>
                      <Typography variant="body1" gutterBottom>
                        {comment.content}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Article ID: {comment.articleId ?? 'Unknown'}
                      </Typography>
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

      if (!token) {
        store.dispatch(setUser(null));

        return {
          props: {
            user: null,
            articles: [],
            comments: [],
          },
        };
      }

      const [user, articlesResponse, commentsResponse] = await Promise.all([
        getUserProfile(token),
        getArticles(1, 100),
        getComments(1, 100),
      ]);

      store.dispatch(setUser(user));

      const userArticles = articlesResponse.data.filter(
        (article) => article.author?.id === user.id,
      );

      const userComments = commentsResponse.data.filter(
        (comment) => comment.user?.id === user.id,
      );

      return {
        props: {
          user,
          articles: userArticles,
          comments: userComments,
        },
      };
    } catch (err) {
      console.error('Error fetching profile page data:', err);

      return {
        props: {
          user: null,
          articles: [],
          comments: [],
        },
      };
    }
  });

export default ProfilePage;
