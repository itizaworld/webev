import React, { useState, createContext, ReactNode, SetStateAction, Dispatch, FC } from 'react';
import useSWR, { KeyedMutator } from 'swr';
import { Page } from '~/domains/Page';
import { PaginationResult } from '~/libs/interfaces/paginationResult';
import { joinUrl } from '~/utils/joinUrl';
import { restClient } from '~/utils/rest-client';

export const PagePaginationContext = createContext<{
  setSearchKeyword?: Dispatch<SetStateAction<string>>;
  activePage: number;
  setActivePage?: Dispatch<SetStateAction<number>>;
  isSortUpdatedAt: boolean;
  setIsSortUpdatedAt?: Dispatch<SetStateAction<boolean>>;
  setIsArchived?: Dispatch<SetStateAction<boolean>>;
  paginationPage?: PaginationResult<Page>;
  mutatePagePagination?: KeyedMutator<PaginationResult<Page>>;
}>({
  setSearchKeyword: undefined,
  activePage: 1,
  setActivePage: undefined,
  isSortUpdatedAt: false,
  setIsSortUpdatedAt: undefined,
  setIsArchived: undefined,
  paginationPage: undefined,
  mutatePagePagination: undefined,
});

export const PagePaginationProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activePage, setActivePage] = useState(1);
  const [limit] = useState(9);
  const [isSortUpdatedAt, setIsSortUpdatedAt] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  const sort = isSortUpdatedAt ? 'updatedAt' : '-updatedAt';

  const params = [`page=${activePage}`, `limit=${limit}`, `sort=${sort}`, `isArchived=${isArchived}`];
  if (searchKeyword) params.push(`&q=${searchKeyword}`);

  const endpoint = joinUrl('/pages/list', params);

  const { data: paginationPage, mutate: mutatePagePagination } = useSWR<PaginationResult<Page>>(endpoint, (endpoint: string) =>
    restClient.apiGet<{ paginationPage: PaginationResult<Page> }>(endpoint).then((result) => result.data.paginationPage),
  );

  return (
    <PagePaginationContext.Provider
      value={{
        setSearchKeyword,
        activePage,
        setActivePage,
        isSortUpdatedAt,
        setIsSortUpdatedAt,
        setIsArchived,
        paginationPage,
        mutatePagePagination,
      }}
    >
      {children}
    </PagePaginationContext.Provider>
  );
};
