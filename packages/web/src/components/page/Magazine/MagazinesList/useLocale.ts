import { useRouter } from 'next/router';

const ja = {
  add: '追加',
  description: '説明',
  edit: 'マガジンを編集する',
  magazine: 'マガジン',
  manage: '操作',
  status: 'ステータス',
  title: 'タイトル',
  update: '更新日',
  watch: 'マガジンをみる',
};

const en = {
  add: 'add',
  description: 'description',
  edit: 'edit magazine',
  magazine: 'magazine',
  manage: 'manage',
  status: 'status',
  title: 'title',
  update: 'update at',
  watch: 'watch magazine',
};

export const useLocale = (): { locale?: string; t: typeof ja } => {
  const { locale } = useRouter();

  const t = locale === 'ja' ? ja : en;

  return { locale, t };
};
