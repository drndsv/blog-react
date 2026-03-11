import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Stack,
  Typography,
  TextField,
  Alert,
  Button,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import cookie from 'cookie';
import Cookies from 'js-cookie';

import Header from '../components/Header';
import {
  createArticle,
  getArticles,
  getComments,
  getUserProfile,
} from '../lib/api';
import { wrapper, setUser } from '../store/store';
import type { Article, Comment, User } from '../lib/apiTypes';
import { getImageUrl } from '../lib/utils/getImageUrl';
import { useRouter } from 'next/router';
import { useState } from 'react';

type ProfilePageProps = {
  user: User | null;
  articles: Article[];
  comments: Comment[];
};

const ProfilePage = ({ user, articles, comments }: ProfilePageProps) => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateArticle = async () => {
    setSubmitError('');
    setSubmitSuccess('');

    if (!title.trim() || !content.trim()) {
      setSubmitError('Title and content are required');
      return;
    }

    const token = Cookies.get('jwt');

    if (!token) {
      setSubmitError('You are not authorized');
      return;
    }

    try {
      setIsSubmitting(true);

      await createArticle(token, {
        title: title.trim(),
        content: content.trim(),
        previewImage,
      });

      setSubmitSuccess('Article created successfully');
      setTitle('');
      setContent('');
      setPreviewImage(null);

      await router.replace(router.asPath);
    } catch (err) {
      console.error('Create article failed:', err);
      setSubmitError('Failed to create article');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Create Article
            </Typography>

            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  {submitError && <Alert severity="error">{submitError}</Alert>}
                  {submitSuccess && (
                    <Alert severity="success">{submitSuccess}</Alert>
                  )}

                  <TextField
                    label="Title"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <Button variant="outlined" component="label">
                    Upload preview image
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setPreviewImage(file);
                      }}
                    />
                  </Button>

                  {previewImage && (
                    <Typography variant="body2" color="text.secondary">
                      Selected file: {previewImage.name}
                    </Typography>
                  )}

                  <TextField
                    label="Content"
                    fullWidth
                    multiline
                    minRows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={handleCreateArticle}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating...' : 'Create article'}
                    </Button>
                  </Box>
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
