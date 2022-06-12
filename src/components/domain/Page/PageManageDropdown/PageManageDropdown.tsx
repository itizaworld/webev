import { Button, Dropdown } from '@nextui-org/react';
import { FC, Key, useCallback, useMemo } from 'react';
import { Icon } from '~/components/base/atoms/Icon';

import { Page } from '~/domains/Page';
import { useClipboard } from '~/hooks/shared';
import { useLocale } from '~/hooks/useLocale';
import { useModal } from '~/hooks/useModal';
import { toastSuccess } from '~/utils/toastr';

type Props = {
  page: Page;
};

export const PageManageDropdown: FC<Props> = ({ page }) => {
  const { t } = useLocale();
  const { handleCopy } = useClipboard();

  const { handleModal } = useModal();

  /**
   * Twitter の共有
   */
  const sharePage = useCallback(async () => {
    if (window != null) {
      const twitterUrl = new URL(`https://twitter.com/intent/tweet?url=${encodeURIComponent(page.url)}&hashtags=${page.siteName}`);
      window.open(twitterUrl.toString(), '_blank');
    }
  }, [page.siteName, page.url]);

  /**
   * Web share api を使った共有
   */
  const sharePageByNavigator = useCallback(() => {
    navigator.share({
      title: page.title,
      text: page.description,
      url: page.url,
    });
  }, [page.description, page.title, page.url]);

  /**
   * Web share api が使えるかどうか(MobileかSafariだと使用可能)
   * @returns {boolean}
   */
  const canShareByNavigator = useMemo(() => {
    return !!navigator?.share;
  }, []);

  const handleAction = useCallback(
    (key: Key) => {
      switch (key) {
        case 'copy': {
          handleCopy(page.url);
          toastSuccess(t.toastr_success_copy_url);
          break;
        }
        case 'share': {
          if (canShareByNavigator) {
            sharePageByNavigator();
          } else {
            sharePage();
          }
          break;
        }
        case 'delete': {
          handleModal({
            name: 'deletePageModal',
            args: {
              page: page,
            },
          });
          break;
        }
      }
    },
    [canShareByNavigator, handleCopy, handleModal, page, sharePage, sharePageByNavigator, t.toastr_success_copy_url],
  );

  return (
    <Dropdown placement="bottom-right">
      <Dropdown.Trigger>
        <Button auto css={{ padding: '0px 11px' }} light>
          <Icon width={18} height={18} icon="THREE_DOTS_VERTICAL" />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Menu aria-label="Static Actions" onAction={handleAction}>
        <Dropdown.Item key="copy" icon={<Icon icon="CLIP_BOARD_PLUS" />}>
          {t.copy_url}
        </Dropdown.Item>
        <Dropdown.Item key="share" icon={<Icon icon={canShareByNavigator ? 'SHARE' : 'TWITTER'} />}>
          {t.share}
        </Dropdown.Item>
        <Dropdown.Item key="delete" icon={<Icon icon="TRASH" />}>
          {t.delete}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  //       {/* TODO: implement */}
  //       {/* <DropdownItem tag="button" onClick={onClickFetchButton}>
  //         <Icon icon="ARROW_CLOCKWISE"  />
  //         <span className="ms-2">{t.fetch}</span>
  //       </DropdownItem> */}
  //     </DropdownMenu>
};
