import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import cookie from 'cookie';
import { useRouter } from 'next/router';

import Header from '../components/Header';
import { ArticleCard } from '../components/articles/ArticleCard';
import { CommentCard } from '../components/comments/CommentCard';
import { CreateArticleForm } from '../components/profile/CreateArticleForm';
import { ProfileInfoCard } from '../components/profile/ProfileInfoCard';
import { getArticles, getComments, getUserProfile } from '../lib/api';
import type { Article, Comment, User } from '../lib/apiTypes';
import { wrapper, setUser } from '../store/store';

type ProfilePageProps = {
  user: User | null;
  articles: Article[];
  comments: Comment[];
};

const ProfilePage = ({ user, articles, comments }: ProfilePageProps) => {
  const router = useRouter();

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

            <ProfileInfoCard user={user} />
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom>
              Create Article
            </Typography>

            <CreateArticleForm
              onSuccess={async () => {
                await router.replace(router.asPath);
              }}
            />
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
                  <ArticleCard key={article.id} article={article} />
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
                  <CommentCard key={comment.id} comment={comment} />
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
