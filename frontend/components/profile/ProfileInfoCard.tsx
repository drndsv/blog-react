import { Card, CardContent, Stack, Typography } from '@mui/material';
import type { User } from '../../lib/apiTypes';

type ProfileInfoCardProps = {
  user: User;
};

export const ProfileInfoCard = ({ user }: ProfileInfoCardProps) => {
  return (
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
  );
};
