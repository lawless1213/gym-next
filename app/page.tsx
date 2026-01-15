import {useTranslations} from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <div>
      <h1 className="page_title">{t('title')}</h1>
    </div>
  );
}
