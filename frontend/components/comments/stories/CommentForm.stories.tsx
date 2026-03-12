import type { Meta, StoryObj } from '@storybook/react';
import { CommentForm } from '../CommentForm';

const meta: Meta<typeof CommentForm> = {
  title: 'Comments/CommentForm',
  component: CommentForm,
};

export default meta;
type Story = StoryObj<typeof CommentForm>;

export const Default: Story = {
  args: {
    value: '',
    error: '',
    isSubmitting: false,
    onChange: () => {},
    onSubmit: () => {},
  },
};

export const WithText: Story = {
  args: {
    value: 'This is a draft comment.',
    error: '',
    isSubmitting: false,
    onChange: () => {},
    onSubmit: () => {},
  },
};

export const WithError: Story = {
  args: {
    value: '',
    error: 'Comment is required',
    isSubmitting: false,
    onChange: () => {},
    onSubmit: () => {},
  },
};

export const Submitting: Story = {
  args: {
    value: 'Sending comment...',
    error: '',
    isSubmitting: true,
    onChange: () => {},
    onSubmit: () => {},
  },
};
