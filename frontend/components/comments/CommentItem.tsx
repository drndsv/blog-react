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
import type { Comment, User } from '../../lib/apiTypes';
import { COMMENT_MAX_LENGTH } from '../../lib/constants/article';

type CommentItemProps = {
  comment: Comment;
  currentUser?: User | null;
  isEditing: boolean;
  editingContent: string;
  editError: string;
  deletingCommentId: number | null;
  onStartEdit: (comment: Comment) => void;
  onCancelEdit: () => void;
  onChangeEditingContent: (value: string) => void;
  onSave: (commentId: number) => void;
  onDelete: (commentId: number) => void;
};

export const CommentItem = ({
  comment,
  currentUser,
  isEditing,
  editingContent,
  editError,
  deletingCommentId,
  onStartEdit,
  onCancelEdit,
  onChangeEditingContent,
  onSave,
  onDelete,
}: CommentItemProps) => {
  const isOwner = currentUser?.id === comment.user?.id;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Author: {comment.user?.name ?? 'Unknown'}
        </Typography>

        {isEditing ? (
          <Stack spacing={1}>
            {editError && <Alert severity="error">{editError}</Alert>}

            <TextField
              fullWidth
              multiline
              minRows={3}
              value={editingContent}
              onChange={(e) => onChangeEditingContent(e.target.value)}
              slotProps={{
                htmlInput: {
                  maxLength: COMMENT_MAX_LENGTH,
                },
              }}
              helperText={`${editingContent.length}/${COMMENT_MAX_LENGTH}`}
            />

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'flex-end',
              }}
            >
              <Button variant="outlined" onClick={onCancelEdit}>
                Cancel
              </Button>

              <Button variant="contained" onClick={() => onSave(comment.id)}>
                Save
              </Button>
            </Box>
          </Stack>
        ) : (
          <>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-wrap',
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
              }}
            >
              {comment.content}
            </Typography>

            {isOwner && (
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onStartEdit(comment)}
                >
                  Edit
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => onDelete(comment.id)}
                  disabled={deletingCommentId === comment.id}
                >
                  {deletingCommentId === comment.id ? 'Deleting...' : 'Delete'}
                </Button>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
