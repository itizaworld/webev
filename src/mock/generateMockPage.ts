import { Page } from '~/domains/Page';

export const generateMockPage = (mock: Partial<Page> = {}): Page => {
  return new Page({
    id: mock.id || 'mockId',
    url: mock.url || 'https://example.com',
    image: mock.image || 'https://www.webev.cloud/images/no-image-ogp.png',
    favicon: mock.favicon || 'https://www.webev.cloud/favicons/favicon-32x32.png',
    description: mock.description || 'mockDescription',
    title: mock.title || 'mockTitle',
    body: mock.body || 'mockBody',
    siteName: mock.siteName || 'mockSiteName',
    isDeleted: mock.isDeleted || false,
    createdUser: mock.createdUser || 'mockCreatedUser',
    createdAt: mock.createdAt || new Date('2020-01-01T00:00:00'),
    updatedAt: mock.updatedAt || new Date('2020-01-01T00:00:00'),
    archivedAt: mock.archivedAt || new Date('2020-01-01T00:00:00'),
  });
};
