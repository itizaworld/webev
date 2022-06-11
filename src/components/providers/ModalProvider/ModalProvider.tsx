import React, { useState, createContext, ReactNode, useContext, useCallback, FC } from 'react';

import { DeletePageModal } from '~/components/domain/Page';
import { TutorialDetectorModal } from '~/components/domain/Tutorial/TutorialDetectorModal';

type DeletePageModalType = {
  name: 'deletePageModal';
  args: { targetPageId: string };
};

type TutorialDetectorModalType = {
  name: 'tutorialDetectorModal';
  args: {};
};

type ModalProps = DeletePageModalType | TutorialDetectorModalType | undefined | null;

const DURATION = 195; // モーダルの開閉のアニメーション時間

export const ModalContext = createContext<{
  modal: ModalProps;
  open: boolean;
  handleModal: (props: ModalProps) => void;
}>({ modal: undefined, open: false, handleModal: () => void 0 });

export const ModalProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [modal, setModal] = useState<ModalProps>();
  const [open, setOpen] = useState(false);

  const handleModal = useCallback((args: ModalProps) => {
    if (!args) {
      // モーダルを閉じるときは先にopenをfalsyにして閉じるアニメーションを実行する
      setOpen(false);
      // アニメーションが終了したらmodalをnullにしてコンポーネントを破棄する
      setTimeout(() => setModal(null), DURATION);
    } else {
      setModal(args);
      setOpen(true);
    }
  }, []);

  return (
    <ModalContext.Provider value={{ modal, open, handleModal }}>
      <Modal />
      {children}
    </ModalContext.Provider>
  );
};

const Modal = () => {
  const { modal, open, handleModal } = useContext(ModalContext);
  const handleCancel = useCallback(() => handleModal(null), [handleModal]);

  if (!modal) return null;

  switch (modal.name) {
    case 'deletePageModal': {
      return <DeletePageModal open={open} onClose={handleCancel} pageId={modal.args.targetPageId} />;
    }
    case 'tutorialDetectorModal': {
      return <TutorialDetectorModal open={open} onClose={handleCancel} />;
    }
  }
};
