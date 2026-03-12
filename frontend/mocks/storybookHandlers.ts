import { http, HttpResponse } from 'msw';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const storybookHandlers = [
  http.get(`${apiUrl}/comments/article/:articleId`, ({ params }) => {
    const articleId = Number(params.articleId);

    if (articleId === 1) {
      return HttpResponse.json({
        data: [
          {
            id: 3,
            content: 'Newest comment for article 1',
            user: {
              id: 2,
              name: 'Bob Smith',
            },
            articleId: 1,
          },
          {
            id: 2,
            content: 'Second comment for article 1',
            user: {
              id: 1,
              name: 'Alice Johnson',
            },
            articleId: 1,
          },
          {
            id: 1,
            content: 'Oldest comment for article 1',
            user: {
              id: 3,
              name: 'Charlie Brown',
            },
            articleId: 1,
          },
        ],
        count: 3,
        page: 1,
        pageCount: 1,
      });
    }

    if (articleId === 2) {
      return HttpResponse.json({
        data: [],
        count: 0,
        page: 1,
        pageCount: 0,
      });
    }

    return HttpResponse.json({
      data: [
        {
          id: 10,
          content: 'Comment for another article',
          user: {
            id: 4,
            name: 'David Green',
          },
          articleId,
        },
      ],
      count: 1,
      page: 1,
      pageCount: 1,
    });
  }),

  http.post(`${apiUrl}/comments`, async () => {
    return HttpResponse.json(
      {
        id: 999,
        content: 'Mock created comment',
        user: {
          id: 2,
          name: 'Bob Smith',
        },
        articleId: 1,
      },
      { status: 201 },
    );
  }),

  http.patch(`${apiUrl}/comments/:id`, async ({ params }) => {
    return HttpResponse.json({
      id: Number(params.id),
      content: 'Mock updated comment',
      user: {
        id: 2,
        name: 'Bob Smith',
      },
      articleId: 1,
    });
  }),

  http.delete(`${apiUrl}/comments/:id`, async () => {
    return HttpResponse.json({
      deleted: true,
    });
  }),
];
