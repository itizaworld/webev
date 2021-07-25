import Link from 'next/link';
import { useState, useEffect, VFC } from 'react';

import Loader from 'react-loader-spinner';
import { useRouter } from 'next/router';
import { Emoji, EmojiData, emojiIndex } from 'emoji-mart';
import { format } from 'date-fns';

import { openFileFolderEmoji } from '~/const/emoji';
import { useLocale } from '~/hooks/useLocale';

import { WebevOgpHead } from '~/components/common/WebevOgpHead';
import { UserIcon } from '~/components/domain/User/atoms/UserIcon';

import { useScrapById } from '~/stores/scrap';
import { useUserById } from '~/stores/user';
import { PagePreviewCard } from '~/components/domain/Page/molecules/PagePreviewCard';

const emojiSize = 40;

const Index: VFC = () => {
  const { t } = useLocale();
  const router = useRouter();
  const { id: scrapId } = router.query;

  const { data: scrap } = useScrapById({ scrapId: scrapId as string });
  const { data: createdUser } = useUserById({ userId: scrap?.createdUser });

  const [emoji, setEmoji] = useState<EmojiData>(openFileFolderEmoji);

  useEffect(() => {
    if (scrap != null) {
      const result = emojiIndex.search(scrap.emojiId);
      if (result != null) {
        setEmoji(result[0]);
      }
    }
  }, [scrap]);

  if (scrap == null) {
    return (
      <div className="text-center pt-5">
        <Loader type="Triangle" color="#00BFFF" height={100} width={100} />
      </div>
    );
  }
  console.log(scrap);

  return (
    <>
      <WebevOgpHead title={`Webev | New ${t.scrap}`} />
      <div className="d-flex">
        <div className="col-md-8 col-12 px-2">
          <h2 className="my-3">Page</h2>
          {scrap.pages.map((page) => {
            return (
              <div key={page._id} className="mb-3">
                <PagePreviewCard page={page} onClickCard={() => window.open(page.url, '_blank')} />
              </div>
            );
          })}
        </div>
        <div className="col-md-4 col-12 px-2">
          {createdUser != null && (
            <>
              <div className="text-center py-3">
                <Link href={`/user/${createdUser._id}`}>
                  <a className="text-white webev-anchor d-flex align-items-center">
                    <UserIcon image={createdUser.image} size={36} isCircle />
                    <span className="ms-3 text-truncate">{createdUser.name}</span>
                  </a>
                </Link>
              </div>
              <hr />
            </>
          )}
          <div className="p-3 text-center">
            <Emoji emoji={emoji} size={emojiSize} />
          </div>
          <h1 className="webev-limit-2lines">{scrap.title}</h1>
          <p>
            {t.created_at} : {format(new Date(scrap.createdAt), 'yyyy/MM/dd')}
          </p>
          <p>{scrap.body}</p>
        </div>
      </div>
    </>
  );
};

export default Index;
