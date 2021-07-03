import { useCallback, useState, VFC } from 'react';
import { Collapse, UncontrolledTooltip } from 'reactstrap';

import styled from 'styled-components';

import { Emoji } from 'emoji-mart';
import { restClient } from '~/utils/rest-client';
import { toastError, toastSuccess } from '~/utils/toastr';

import { IconButton } from '~/components/Icons/IconButton';
import { useLocale } from '~/hooks/useLocale';
import { Directory } from '~/domains/Directory';
import { BootstrapBreakpoints, BootstrapColor, BootstrapIcon } from '~/interfaces/variables';
import { useAllDirectories, useDirectoryChildren } from '~/stores/directory';

type Props = {
  directory?: Directory;
  activeDirectoryId: string;
  onClickDirectory?: (directoryId: string) => void;
};

export const DirectoryItem: VFC<Props> = ({ directory, onClickDirectory, activeDirectoryId }) => {
  const { t } = useLocale();

  const { data: childrenDirectortTrees, mutate: mutateChildrenDirectortTrees } = useDirectoryChildren(directory?._id);
  const { mutate: mutateAllDirectories } = useAllDirectories();

  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingNewDirectory, setIsCreatingNewDirectory] = useState(false);
  const [name, setName] = useState('');

  const isActive = directory?._id === activeDirectoryId;

  const handleToggleCollapse = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isOpen) {
      setIsCreatingNewDirectory(false);
    }
    setIsOpen((prevState) => !prevState);
  };

  const handleClickPencilIcon = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen(true);
    setIsCreatingNewDirectory(true);
  };

  const handleSubmitCreateDirectory = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (name.trim() === '') {
      return setIsCreatingNewDirectory(false);
    }

    try {
      await restClient.apiPost('/directories', { name, parentDirectoryId: directory?._id });
      toastSuccess(t.toastr_save_directory);
      setName('');
      mutateChildrenDirectortTrees();
      mutateAllDirectories();
      setIsCreatingNewDirectory(false);
    } catch (err) {
      toastError(err);
    }
  };

  const handleClickDirectory = useCallback(() => {
    if (onClickDirectory != null) {
      onClickDirectory(directory?._id as string);
    }
  }, [directory?._id]);

  return (
    <>
      <StyledDiv className="text-white text-left rounded d-flex" role="button" onClick={handleClickDirectory} isActive={isActive}>
        {isOpen ? (
          <IconButton
            width={18}
            height={18}
            isActive={isActive}
            icon={BootstrapIcon.CARET_DOWN}
            color={BootstrapColor.SECONDARY}
            activeColor={BootstrapColor.WHITE}
            onClickButton={handleToggleCollapse}
            isRemovePadding
          />
        ) : (
          <IconButton
            width={18}
            height={18}
            isActive={isActive}
            icon={BootstrapIcon.CARET_RIGHT}
            color={BootstrapColor.SECONDARY}
            activeColor={BootstrapColor.WHITE}
            onClickButton={handleToggleCollapse}
            isRemovePadding
          />
        )}
        {directory && (
          <div className="text-truncate">
            <span className="me-2 align-middle">
              <Emoji emoji={directory.emojiId} size={20} />
            </span>
            <span className="align-middle">{directory?.name}</span>
          </div>
        )}
        <div className="ms-auto create-directory-button" id={`create-directory-icon-on-${directory?._id}`}>
          <IconButton
            width={18}
            height={18}
            isActive={isActive}
            icon={BootstrapIcon.ADD_TO_DIRECTORY}
            color={BootstrapColor.WHITE}
            activeColor={BootstrapColor.WHITE}
            onClickButton={handleClickPencilIcon}
            isRemovePadding
          />
        </div>
        <UncontrolledTooltip fade={false} placement="top" target={`create-directory-icon-on-${directory?._id}`}>
          {t.create_directory}
        </UncontrolledTooltip>
      </StyledDiv>
      <Collapse isOpen={isOpen}>
        <div className="ps-3 pt-1">
          {isCreatingNewDirectory && (
            <form className="input-group my-2 ps-3" onSubmit={handleSubmitCreateDirectory}>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control bg-white" placeholder="...name" autoFocus />
            </form>
          )}
          {childrenDirectortTrees?.map((childrenDirectortTree) => {
            return (
              <DirectoryItem
                key={childrenDirectortTree._id}
                directory={childrenDirectortTree.descendant as Directory}
                onClickDirectory={onClickDirectory}
                activeDirectoryId={activeDirectoryId}
              />
            );
          })}
          {childrenDirectortTrees?.length === 0 && <div className="ps-3 my-1">No Directory</div>}
        </div>
      </Collapse>
    </>
  );
};

const StyledDiv = styled.div<{ isActive?: boolean }>`
  .create-directory-button {
    height: 24px;
    @media (min-width: ${BootstrapBreakpoints.md}px) {
      display: none;
    }
  }

  &:hover {
    .create-directory-button {
      display: block;
    }
  }
  ${({ isActive }) =>
    isActive
      ? `
    background-color: #6f42c1;
    box-shadow: 0 12px 20px -10px rgba(0, 172, 193, 0.28), 0 4px 20px 0 rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(0, 172, 193, 0.2);
  `
      : `:hover {
    background-color: rgba(200, 200, 200, 0.2);
    transition: all 300ms linear;
  }`}
`;
