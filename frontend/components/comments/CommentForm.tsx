import { Alert, Box, Button, Stack, TextField } from '@mui/material';
import { COMMENT_MAX_LENGTH } from '../../lib/constants/article';

type CommentFormProps = {
  value: string;
  error: string;
  isSubmitting: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export const CommentForm = ({
  value,
  error,
  isSubmitting,
  onChange,
  onSubmit,
}: CommentFormProps) => {
  return (
    <Stack spacing={1}>
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Write a comment"
        fullWidth
        multiline
        minRows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        slotProps={{
          htmlInput: {
            maxLength: COMMENT_MAX_LENGTH,
          },
        }}
        helperText={`${value.length}/${COMMENT_MAX_LENGTH}`}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Add comment'}
        </Button>
      </Box>
    </Stack>
  );
};
