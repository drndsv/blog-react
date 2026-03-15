import type { Meta, StoryObj } from '@storybook/react';
import { CommentItem } from '../CommentItem';

const meta: Meta<typeof CommentItem> = {
  title: 'Comments/CommentItem',
  component: CommentItem,
};

export default meta;
type Story = StoryObj<typeof CommentItem>;

const currentUser = {
  id: 1,
  name: 'Alice Johnson',
  email: 'alice@example.com',
};

const baseComment = {
  id: 1,
  content: 'This is a comment text.',
  user: {
    id: 1,
    name: 'Alice Johnson',
  },
  articleId: 10,
};

export const OwnerView: Story = {
  args: {
    comment: baseComment,
    currentUser,
    isEditing: false,
    editingContent: '',
    editError: '',
    deletingCommentId: null,
    onStartEdit: () => {},
    onCancelEdit: () => {},
    onChangeEditingContent: () => {},
    onSave: () => {},
    onDelete: () => {},
  },
};

export const NotOwner: Story = {
  args: {
    comment: {
      ...baseComment,
      user: {
        id: 2,
        name: 'Bob Smith',
      },
    },
    currentUser,
    isEditing: false,
    editingContent: '',
    editError: '',
    deletingCommentId: null,
    onStartEdit: () => {},
    onCancelEdit: () => {},
    onChangeEditingContent: () => {},
    onSave: () => {},
    onDelete: () => {},
  },
};

export const Editing: Story = {
  args: {
    comment: baseComment,
    currentUser,
    isEditing: true,
    editingContent: 'Updated comment text',
    editError: '',
    deletingCommentId: null,
    onStartEdit: () => {},
    onCancelEdit: () => {},
    onChangeEditingContent: () => {},
    onSave: () => {},
    onDelete: () => {},
  },
};

export const EditingWithError: Story = {
  args: {
    comment: baseComment,
    currentUser,
    isEditing: true,
    editingContent: '',
    editError: 'Comment is required',
    deletingCommentId: null,
    onStartEdit: () => {},
    onCancelEdit: () => {},
    onChangeEditingContent: () => {},
    onSave: () => {},
    onDelete: () => {},
  },
};
