import { VFC, useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Emoji } from 'emoji-mart';

import { restClient } from '~/utils/rest-client';
import { toastError, toastSuccess } from '~/utils/toastr';

import { EditableInput } from '~/components/Atoms/EditableInput';

import { useDirectoryForSavePage } from '~/stores/modal';
import { usePageListSWR } from '~/stores/page';
import { useSocketId, useUrlFromClipBoard } from '~/stores/contexts';

import { useLocale } from '~/hooks/useLocale';

export const SavePageModal: VFC = () => {
  const { t } = useLocale();

  const [url, setUrl] = useState('');

  const { data: directoryForSavePage, mutate: mutateDirectoryForSavePage } = useDirectoryForSavePage();
  const { data: socketId } = useSocketId();

  const { mutate: pageListMutate } = usePageListSWR();
  const { data: urlFromClipBoard, mutate: mutateUrlFromClipBoard } = useUrlFromClipBoard();

  useEffect(() => {
    if (urlFromClipBoard != null) {
      setUrl(urlFromClipBoard);
    } else {
      setUrl('');
    }
  }, [urlFromClipBoard]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      await restClient.apiPost('/pages', { url, socketId, directoryId: directoryForSavePage?._id });
      toastSuccess(t.toastr_delete_url);
      pageListMutate();
      closeModal();
    } catch (err) {
      toastError(err);
    }
  };

  const closeModal = async () => {
    mutateUrlFromClipBoard(null);
    setUrl('');
    mutateDirectoryForSavePage(null);
  };

  const updateDirectroyName = async () => {
    console.log('hoge');
  };

  return (
    <Modal size="lg" isOpen={directoryForSavePage != null} toggle={closeModal}>
      <ModalHeader className="bg-dark">{t.save_page}</ModalHeader>
      <ModalBody className="bg-dark text-break">
        <div className="row align-items-center">
          <div className="col-12 col-md-3">
            <p className="text-center mb-0">{t.save_to_directory(directoryForSavePage?.name as string)}</p>
          </div>
          <div className="col-12 col-md-9">
            <form className="input-group my-2" onSubmit={handleSubmit}>
              <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="form-control bg-white" placeholder="...url" autoFocus />
              <button className="btn btn-success" type="submit" disabled={url.trim() === ''}>
                {t.save}
              </button>
            </form>
          </div>
        </div>
        <hr className="mt-4" />
        <div className="d-flex gap-1 align-items-center">
          <Emoji emoji="mag" size={18} />
          <EditableInput onSubmit={updateDirectroyName} value="" placeholder="Search..." />
        </div>
      </ModalBody>
    </Modal>
  );
};
