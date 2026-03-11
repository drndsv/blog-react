import {
  Card,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from '@mui/material';
import type { Article, User } from '../../lib/apiTypes';
import { getImageUrl } from '../../lib/utils/getImageUrl';
import { ArticleComments } from '../comments/ArticleComments';

type ArticleCardProps = {
  article: Article;
  currentUser?: User | null;
};

export const ArticleCard = ({ article, currentUser }: ArticleCardProps) => {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
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

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Author: {article.author?.name ?? 'Unknown'}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
          }}
        >
          {article.content}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <ArticleComments articleId={article.id} currentUser={currentUser} />
      </CardContent>
    </Card>
  );
};
