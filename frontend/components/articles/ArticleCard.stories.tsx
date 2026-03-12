import type { Meta, StoryObj } from '@storybook/react';
import { ArticleCard } from './ArticleCard';
import {storybookHandlers} from '../../mocks/storybookHandlers';

const meta: Meta<typeof ArticleCard> = {
  title: 'Articles/ArticleCard',
  component: ArticleCard,
  parameters:{
    msw:{
      handlers: storybookHandlers
    }
  }
};

export default meta;
type Story = StoryObj<typeof ArticleCard>;

const baseArticle = {
  id: 1,
  title: 'How to build a blog with Next.js',
  content:
    'This is a sample article content. It demonstrates how the article card looks in the default state.',
  previewImage: '/storybook/article.png',
  author: {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
  },
};

const authorizedUser = {
  id: 2,
  name: 'Bob Smith',
  email: 'bob@example.com',
};

export const GuestUser: Story = {
  args: {
    article: baseArticle,
    currentUser: null,
  },
};

export const AuthorizedUser: Story = {
  args: {
    article: baseArticle,
    currentUser: authorizedUser,
  },
};

export const WithoutImage: Story = {
  args: {
    article: {
      ...baseArticle,
      title: 'Article without image',
      previewImage: null,
    },
    currentUser: null,
  },
};

export const LongContent: Story = {
  args: {
    article: {
      ...baseArticle,
      title: 'Very long article content',
      content:
        'This is a very long text. '.repeat(40) +
        '\n\nAnd it also contains line breaks.\nNew paragraph starts here.',
    },
    currentUser: null,
  },
};

export const LongTitle: Story = {
  args: {
    article: {
      ...baseArticle,
      title:
        'This is an extremely long article title to test how the component behaves when titles overflow',
    },
    currentUser: null,
  },
};
