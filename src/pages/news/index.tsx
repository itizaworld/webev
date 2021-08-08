import Link from 'next/link';
import { VFC } from 'react';

import styled from 'styled-components';

import { useLocale } from '~/hooks/useLocale';
import { News } from '~/interfaces/news';
import { WebevOgpHead } from '~/components/common/WebevOgpHead';
import { microCMSClient } from '~/utils/microCMSClient';

type Props = {
  contents: News[];
};

const Index: VFC<Props> = ({ contents }) => {
  const { t } = useLocale();

  return (
    <>
      <WebevOgpHead title={`Webev | ${t.news}`} />
      <div className="p-2">
        <h1 className="text-center my-3">{t.news}</h1>
        {contents.length === 0 && <span>No News</span>}
        <StyledDiv className="mx-auto">
          <ul>
            {contents.map((v) => {
              return (
                <li key={v.id} role="button">
                  <Link href={`/news/${v.id}`}>
                    <a className="text-white fw-bold webev-anchor">{v.title}</a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </StyledDiv>
      </div>
    </>
  );
};

const StyledDiv = styled.div`
  max-width: 800px;
`;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getStaticProps = async () => {
  try {
    const response = await microCMSClient.client.get<{ contents: News[] }>({
      endpoint: 'news',
      useGlobalDraftKey: false, // This is an option if your have set the globalDraftKey. Default value true.
    });

    return {
      props: {
        contents: response.contents as News[],
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        contents: [],
      },
    };
  }
};

export default Index;
