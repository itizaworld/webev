import { useRouter } from 'next/router';
import { ReactNode } from 'react';

import { Button, Grid, Loading, Text } from '@nextui-org/react';
import Link from 'next/link';
import { usePageByPageId } from '~/stores/Page';
import { WebevNextPage } from '~/libs/interfaces/webevNextPage';
import { useLocale } from '~/hooks/useLocale';
import { URLS } from '~/libs/constants/urls';

import { WebevOgpHead } from '~/components/common/WebevOgpHead';
import { DashBoardLayout } from '~/components/common/Layout/DashBoardLayout';
import { PageManageDropdown } from '~/components/domain/Page/PageManageDropdown';

const Page: WebevNextPage = () => {
  const router = useRouter();

  const { id } = router.query;

  const { t } = useLocale();
  const { data: page, isLoading: isLoadingPage } = usePageByPageId({ pageId: id as string });

  if (isLoadingPage) {
    return (
      <Grid css={{ width: '100%', py: '$8', display: 'flex', justifyContent: 'center' }}>
        <Loading size="xl" color="secondary" />
      </Grid>
    );
  }

  if (!page) {
    return (
      <Grid css={{ textAlign: 'center', width: '100%' }}>
        <Text h3>{t.data_not_found}</Text>
        <Link href={URLS.HOME_URL}>
          <a>
            <Button color="secondary" css={{ mx: 'auto', mt: '24px' }}>
              {t.return_button}
            </Button>
          </a>
        </Link>
      </Grid>
    );
  }

  return (
    <>
      <WebevOgpHead title={`Webev | ${page.title}`} />

      <Grid css={{ maxWidth: '800px', width: '100%' }}>
        <Grid css={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: '16px', gap: '8px' }}>
          <Text h2 css={{ textAlign: 'center', mb: '$0', mx: 'auto', '@smMax': { fontSize: '$lg', textAlign: 'left' } }}>
            {page.title}
          </Text>
          <PageManageDropdown page={page} />
        </Grid>
      </Grid>
    </>
  );
};

const getLayout = (page: ReactNode) => <DashBoardLayout>{page}</DashBoardLayout>;

Page.getLayout = getLayout;
export default Page;
