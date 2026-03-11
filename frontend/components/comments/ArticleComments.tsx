import { Alert, Stack, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

import type { Comment, User } from '../../lib/apiTypes';
import {
  createComment,
  deleteComment,
  getCommentsByArticle,
  updateComment,
} from '../../lib/api';
import { COMMENT_MAX_LENGTH } from '../../lib/constants/article';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';

type ArticleCommentsProps = {
  articleId: number;
  currentUser?: User | null;
};

export const ArticleComments = ({
  articleId,
  currentUser,
}: ArticleCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState('');

  const [newComment, setNewComment] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editError, setEditError] = useState('');
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null,
  );

  const loadComments = async () => {
    try {
      setIsCommentsLoading(true);
      setCommentsError('');

      const response = await getCommentsByArticle(articleId, 1, 50);
      setComments(response.data);
    } catch (err) {
      console.error('Failed to load comments:', err);
      setCommentsError('Failed to load comments');
    } finally {
      setIsCommentsLoading(false);
    }
  };

  useEffect(() => {
    void loadComments();
  }, [articleId]);

  const handleCreateComment = async () => {
    setSubmitError('');

    const trimmedComment = newComment.trim();

    if (!trimmedComment) {
      setSubmitError('Comment is required');
      return;
    }

    if (trimmedComment.length > COMMENT_MAX_LENGTH) {
      setSubmitError(
        `Comment must be no more than ${COMMENT_MAX_LENGTH} characters`,
      );
      return;
    }

    const token = Cookies.get('jwt');

    if (!token) {
      setSubmitError('Only authorized users can write comments');
      return;
    }

    try {
      setIsSubmitting(true);

      await createComment(token, {
        content: trimmedComment,
        articleId,
      });

      setNewComment('');
      await loadComments();
    } catch (err) {
      console.error('Failed to create comment:', err);
      setSubmitError('Failed to create comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditComment = (comment: Comment) => {
    setEditError('');
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const cancelEditComment = () => {
    setEditError('');
    setEditingCommentId(null);
    setEditingContent('');
  };

  const handleUpdateComment = async (commentId: number) => {
    setEditError('');

    const trimmedContent = editingContent.trim();

    if (!trimmedContent) {
      setEditError('Comment is required');
      return;
    }

    if (trimmedContent.length > COMMENT_MAX_LENGTH) {
      setEditError(
        `Comment must be no more than ${COMMENT_MAX_LENGTH} characters`,
      );
      return;
    }

    const token = Cookies.get('jwt');

    if (!token) {
      setEditError('Only authorized users can edit comments');
      return;
    }

    try {
      await updateComment(token, commentId, {
        content: trimmedContent,
      });

      setEditingCommentId(null);
      setEditingContent('');
      await loadComments();
    } catch (err) {
      console.error('Failed to update comment:', err);
      setEditError('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const token = Cookies.get('jwt');

    if (!token) {
      return;
    }

    try {
      setDeletingCommentId(commentId);
      await deleteComment(token, commentId);
      await loadComments();
    } catch (err) {
      console.error('Failed to delete comment:', err);
    } finally {
      setDeletingCommentId(null);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Comments</Typography>

      {currentUser ? (
        <CommentForm
          value={newComment}
          error={submitError}
          isSubmitting={isSubmitting}
          onChange={setNewComment}
          onSubmit={handleCreateComment}
        />
      ) : (
        <Typography color="text.secondary">
          Log in to write comments.
        </Typography>
      )}

      {isCommentsLoading ? (
        <Typography color="text.secondary">Loading comments...</Typography>
      ) : commentsError ? (
        <Alert severity="error">{commentsError}</Alert>
      ) : comments.length === 0 ? (
        <Typography color="text.secondary">No comments yet</Typography>
      ) : (
        <Stack spacing={2}>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              isEditing={editingCommentId === comment.id}
              editingContent={editingContent}
              editError={editError}
              deletingCommentId={deletingCommentId}
              onStartEdit={startEditComment}
              onCancelEdit={cancelEditComment}
              onChangeEditingContent={setEditingContent}
              onSave={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};
