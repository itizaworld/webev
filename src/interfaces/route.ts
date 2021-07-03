export const PathNames = {
  ROOT: '/',
  NOT_FOUND: '/404',
  LOGIN: '/login',
  TERM: '/term',
  HOME: '/home',
  USER: '/user',
  READ: '/read',
  DIRECTORY: '/directory',
  DIRECTORY_ID: '/directory/[id]',
  NEWS: '/news',
  NEWS_ID: '/news/[id]',
  ARTICLE_NEW: '/article/new',
} as const;
export type PathNames = typeof PathNames[keyof typeof PathNames];

export const LayoutNames = {
  DEFAULT: 'default',
  DASHBOARD: 'dashboard',
} as const;
export type LayoutName = typeof LayoutNames[keyof typeof LayoutNames];

export const PathConfigs = {
  [PathNames.ROOT]: {
    layout: LayoutNames.DEFAULT,
  },
  [PathNames.NOT_FOUND]: {
    layout: LayoutNames.DEFAULT,
  },
  [PathNames.LOGIN]: {
    layout: LayoutNames.DEFAULT,
  },
  [PathNames.TERM]: {
    layout: LayoutNames.DEFAULT,
  },
  [PathNames.HOME]: {
    layout: LayoutNames.DASHBOARD,
  },
  [PathNames.USER]: {
    layout: LayoutNames.DASHBOARD,
  },
  [PathNames.READ]: {
    layout: LayoutNames.DASHBOARD,
  },
  [PathNames.DIRECTORY]: {
    layout: LayoutNames.DASHBOARD,
  },
  [PathNames.DIRECTORY_ID]: {
    layout: LayoutNames.DASHBOARD,
  },
  [PathNames.NEWS]: {
    layout: LayoutNames.DEFAULT,
  },
  [PathNames.NEWS_ID]: {
    layout: LayoutNames.DEFAULT,
  },
  [PathNames.ARTICLE_NEW]: {
    layout: LayoutNames.DEFAULT,
  },
};
