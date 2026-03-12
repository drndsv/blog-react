import type { Meta, StoryObj } from '@storybook/react';
import { ProfileInfoCard } from '../ProfileInfoCard';

const meta: Meta<typeof ProfileInfoCard> = {
  title: 'Profile/ProfileInfoCard',
  component: ProfileInfoCard,
};

export default meta;
type Story = StoryObj<typeof ProfileInfoCard>;

export const Default: Story = {
  args: {
    user: {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
    },
  },
};

export const LongName: Story = {
  args: {
    user: {
      id: 2,
      name: 'Alexandra Catherine Montgomery-Smith',
      email: 'alexandra@example.com',
    },
  },
};
