import { FC, useCallback, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Grid, Pagination, Table } from '@nextui-org/react';
import { format } from 'date-fns';
import { useLocale } from './useLocale';
import { WebevOgpHead } from '@webev/web/components/common/WebevOgpHead';

import { LoginRequiredWrapper } from '@webev/web/components/common/Authentication/LoginRequiredWrapper';
import { Text, Tooltip } from '@webev/web/components/uiParts';
import { Icon } from '@webev/web/components/base/atoms/Icon';
import { useModal } from '@webev/web/hooks/useModal';
import { useMagazinePagination } from '@webev/web/stores/Magazine';
import { StatusLabel } from '@webev/web/components/domain/Magazine';
import { Magazine } from '@webev/web/domains/Magazine';
import { URLS } from '@webev/web/libs/constants/urls';

type Props = {};

export const MagazinesList: FC<Props> = () => {
  const { t } = useLocale();
  const router = useRouter();

  const [activePage, setActivePage] = useState(1);
  const {
    data: magazinePagination,
    mutate: mutateMagazinePagination,
    isLoading,
  } = useMagazinePagination({
    activePage: activePage,
    limit: 10,
    sort: '-updatedAt',
    searchKeyword: '',
  });

  const { handleModal } = useModal();

  const handleClickAddMagazineButton = useCallback(() => {
    handleModal({ name: 'EditMagazineModal', args: { onSubmit: () => mutateMagazinePagination() } });
  }, [handleModal, mutateMagazinePagination]);

  const handleMutateActivePage = (page: number) => {
    setActivePage(page);
  };

  const handleClickEditMagazineButton = useCallback(
    (magazine: Magazine) => {
      handleModal({ name: 'EditMagazineModal', args: { magazine: magazine, onSubmit: () => mutateMagazinePagination() } });
    },
    [handleModal, mutateMagazinePagination],
  );

  return (
    <>
      <WebevOgpHead title={`Webev | ${t.magazine}`} />
      <LoginRequiredWrapper>
        <Grid css={{ width: '100%' }}>
          <Grid css={{ display: 'flex', alignItems: 'center', mb: '16px' }}>
            <Text h2 css={{ textTransform: 'capitalize', mb: '$0' }}>
              {t.magazine}
            </Text>
            <Button
              size="sm"
              css={{ fontWeight: 'bold', ml: 'auto', textTransform: 'capitalize' }}
              color="secondary"
              icon={<Icon icon="PLUS_LARGE" />}
              onClick={handleClickAddMagazineButton}
            >
              {t.add}
            </Button>
          </Grid>
          <Table
            color="secondary"
            css={{
              bgColor: '#202020',
              minHeight: 'auto',
              minWidth: '100%',
            }}
          >
            <Table.Header>
              <Table.Column css={{ width: '30%', textTransform: 'uppercase' }}>{t.title}</Table.Column>
              <Table.Column css={{ width: '30%', textTransform: 'uppercase' }}>{t.description}</Table.Column>
              <Table.Column css={{ textTransform: 'uppercase' }}>{t.status}</Table.Column>
              <Table.Column css={{ textTransform: 'uppercase' }}>{t.update}</Table.Column>
              <Table.Column css={{ textTransform: 'uppercase' }}>{t.manage}</Table.Column>
            </Table.Header>
            <Table.Body items={magazinePagination?.docs || []} loadingState={isLoading ? 'loading' : 'idle'}>
              {(magazine) => (
                <Table.Row key={magazine.id}>
                  <Table.Cell css={{ minWidth: '200px' }}>
                    <Text
                      b
                      css={{
                        whiteSpace: 'pre-wrap',
                        color: '$white',
                        display: '-webkit-box',
                        overflow: 'hidden',
                        overflowWrap: 'anywhere',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1,
                      }}
                    >
                      {magazine.name}
                    </Text>
                  </Table.Cell>
                  <Table.Cell css={{ minWidth: '200px' }}>
                    <Text
                      css={{
                        whiteSpace: 'pre-wrap',
                        color: '$white',
                        display: '-webkit-box',
                        overflow: 'hidden',
                        overflowWrap: 'anywhere',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                      }}
                    >
                      {magazine.description}
                    </Text>
                  </Table.Cell>
                  <Table.Cell css={{ minWidth: '100px' }}>
                    <StatusLabel isPublic={magazine.isPublic} />
                  </Table.Cell>
                  <Table.Cell css={{ minWidth: '100px' }}>{format(new Date(magazine.createdAt), 'yyyy/MM/dd')}</Table.Cell>
                  <Table.Cell css={{ minWidth: '100px' }}>
                    <Grid css={{ display: 'flex', gridGap: '16px', alignItems: 'center' }}>
                      <Tooltip content={t.watch}>
                        <Text css={{ cursor: 'pointer', color: '$warning' }} onClick={() => router.push(URLS.MAGAZINE(magazine.id || ''))}>
                          <Icon icon="EYE" width={16} height={16} />
                        </Text>
                      </Tooltip>
                      <Tooltip content={t.edit}>
                        <Text css={{ cursor: 'pointer' }} onClick={() => handleClickEditMagazineButton(magazine)}>
                          <Icon icon="PENCIL" width={16} height={16} />
                        </Text>
                      </Tooltip>
                      {/* TODO: implement */}
                      {/* <Text css={{ cursor: 'pointer', color: '$error' }}>
                        <Icon icon="TRASH" />
                      </Text> */}
                    </Grid>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          <Grid css={{ display: 'flex', justifyContent: 'center', mt: '$10' }}>
            <Pagination
              shadow
              page={activePage}
              initialPage={1}
              color="secondary"
              total={magazinePagination?.totalPages}
              onChange={handleMutateActivePage}
            />
          </Grid>
        </Grid>
      </LoginRequiredWrapper>
    </>
  );
};
