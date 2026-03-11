import { Card, CardContent, Typography } from '@mui/material';
import type { Comment } from '../../lib/apiTypes';

type CommentCardProps = {
  comment: Comment;
};

export const CommentCard = ({ comment }: CommentCardProps) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          variant="body1"
          gutterBottom
          sx={{
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
          }}
        >
          {comment.content}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Article ID: {comment.articleId ?? 'Unknown'}
        </Typography>
      </CardContent>
    </Card>
  );
};
