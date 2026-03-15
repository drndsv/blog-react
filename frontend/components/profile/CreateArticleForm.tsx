import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { createArticle } from '../../lib/api';
import {
  TITLE_MAX_LENGTH,
  CONTENT_MAX_LENGTH,
} from '../../lib/constants/article';

type CreateArticleFormProps = {
  onSuccess?: () => Promise<void> | void;
};

export const CreateArticleForm = ({ onSuccess }: CreateArticleFormProps) => {
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

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setSubmitError('Title and content are required');
      return;
    }

    if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      setSubmitError(
        `Title must be no more than ${TITLE_MAX_LENGTH} characters`,
      );
      return;
    }

    if (trimmedContent.length > CONTENT_MAX_LENGTH) {
      setSubmitError(
        `Content must be no more than ${CONTENT_MAX_LENGTH} characters`,
      );
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
        title: trimmedTitle,
        content: trimmedContent,
        previewImage,
      });

      setSubmitSuccess('Article created successfully');
      setTitle('');
      setContent('');
      setPreviewImage(null);

      if (onSuccess) {
        await onSuccess();
      } else {
        await router.replace(router.asPath);
      }
    } catch (err) {
      console.error('Create article failed:', err);
      setSubmitError('Failed to create article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          {submitError && <Alert severity="error">{submitError}</Alert>}
          {submitSuccess && <Alert severity="success">{submitSuccess}</Alert>}

          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            slotProps={{
              htmlInput: {
                maxLength: TITLE_MAX_LENGTH,
              },
            }}
            helperText={`${title.length}/${TITLE_MAX_LENGTH}`}
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
            slotProps={{
              htmlInput: {
                maxLength: CONTENT_MAX_LENGTH,
              },
            }}
            helperText={`${content.length}/${CONTENT_MAX_LENGTH}`}
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
  );
};
