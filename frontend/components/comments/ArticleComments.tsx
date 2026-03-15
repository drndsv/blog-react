import { Alert, Button, Stack, Typography } from '@mui/material';

import type { User } from '../../lib/apiTypes';
import { useArticleComments } from '../../lib/hooks/useArticleComments';
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
  const {
    visibleComments,
    isCommentsLoading,
    commentsError,

    newComment,
    setNewComment,
    submitError,
    isSubmitting,

    editingCommentId,
    editingContent,
    setEditingContent,
    editError,
    deletingCommentId,

    hasHiddenComments,
    canShowLess,
    setShowAllComments,

    handleCreateComment,
    startEditComment,
    cancelEditComment,
    handleUpdateComment,
    handleDeleteComment,
  } = useArticleComments({ articleId });

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
      ) : visibleComments.length === 0 ? (
        <Typography color="text.secondary">No comments yet</Typography>
      ) : (
        <Stack spacing={2}>
          {visibleComments.map((comment) => (
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

          {hasHiddenComments && (
            <Button variant="text" onClick={() => setShowAllComments(true)}>
              Show all comments
            </Button>
          )}

          {canShowLess && (
            <Button variant="text" onClick={() => setShowAllComments(false)}>
              Show less
            </Button>
          )}
        </Stack>
      )}
    </Stack>
  );
};
