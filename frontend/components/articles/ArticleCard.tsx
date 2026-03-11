import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import type { Article } from '../../lib/apiTypes';
import { getImageUrl } from '../../lib/utils/getImageUrl';

type ArticleCardProps = {
  article: Article;
};

export const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Card variant="outlined">
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
      </CardContent>
    </Card>
  );
};
