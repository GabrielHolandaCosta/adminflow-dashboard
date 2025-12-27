import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import './Login.css';

export const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError(t('login.errorFillFields'));
        setIsLoading(false);
        return;
      }

      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(t('login.errorLogin'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-language-switcher">
        <LanguageSwitcher />
      </div>
      <div className="login-card">
        <div className="login-header">
          <h1>{t('login.title')}</h1>
          <p>{t('login.subtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          <Input
            type="email"
            label={t('common.email')}
            placeholder={t('login.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            autoComplete="email"
          />
          <Input
            type="password"
            label={t('common.password')}
            placeholder={t('login.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
          />
          <Button type="submit" isLoading={isLoading} className="login-button">
            {t('login.submit')}
          </Button>
          <p className="login-hint">
            {t('login.hint')}
          </p>
          <p className="login-hint" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            {t('login.adminHint')}
          </p>
        </form>
      </div>
    </div>
  );
};

