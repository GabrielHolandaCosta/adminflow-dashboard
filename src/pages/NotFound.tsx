import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button';
import './NotFound.css';

export const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>{t('notFound.title')}</h1>
        <h2>{t('notFound.subtitle')}</h2>
        <p>{t('notFound.message')}</p>
        <Link to="/dashboard">
          <Button>{t('notFound.backToDashboard')}</Button>
        </Link>
      </div>
    </div>
  );
};

