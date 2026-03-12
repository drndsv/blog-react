import type { Meta, StoryObj } from '@storybook/react';
import { CommentCard } from '../CommentCard';

const meta: Meta<typeof CommentCard> = {
  title: 'Comments/CommentCard',
  component: CommentCard,
};

export default meta;
type Story = StoryObj<typeof CommentCard>;

export const Default: Story = {
  args: {
    comment: {
      id: 1,
      content: 'This is a comment preview.',
      user: {
        id: 1,
        name: 'Alice Johnson',
      },
      articleId: 10,
    },
  },
};

export const LongContent: Story = {
  args: {
    comment: {
      id: 2,
      content:
        'This is a very long comment. '.repeat(30) +
        '\n\nIt also contains line breaks to test rendering.',
      user: {
        id: 2,
        name: 'Bob Smith',
      },
      articleId: 11,
    },
  },
};
