import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { usersApi, tasksApi } from '@/services/api';
import './Dashboard.css';

export const Dashboard = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [users, tasks] = await Promise.all([
        usersApi.getAll(),
        tasksApi.getAll(),
      ]);

      // Se for usuário comum, filtrar apenas suas tarefas
      const userTasks = currentUser?.role === 'admin' 
        ? tasks 
        : tasks.filter(t => t.userId === currentUser?.id);

      setStats({
        totalUsers: currentUser?.role === 'admin' ? users.length : 0,
        totalTasks: userTasks.length,
        completedTasks: userTasks.filter((t) => t.status === 'completed').length,
        pendingTasks: userTasks.filter((t) => t.status === 'pending').length,
      });
    } catch (error) {
      console.error(t('dashboard.errorLoading'), error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{t('dashboard.title')}</h1>
        <p>{t('dashboard.welcome')}</p>
      </div>

      <div className="stats-grid">
        {currentUser?.role === 'admin' && (
          <div className="stat-card">
            <div className="stat-icon stat-icon-users">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h3>{t('dashboard.users')}</h3>
              <p className="stat-value">{stats.totalUsers}</p>
              <Link to="/usuarios" className="stat-link">
                {t('dashboard.viewAll')}
              </Link>
            </div>
          </div>
        )}

        <div className="stat-card">
          <div className="stat-icon stat-icon-tasks">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{t('dashboard.totalTasks')}</h3>
            <p className="stat-value">{stats.totalTasks}</p>
            <Link to="/tarefas" className="stat-link">
              {t('dashboard.viewAll')}
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-completed">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{t('dashboard.completedTasks')}</h3>
            <p className="stat-value">{stats.completedTasks}</p>
            <Link to="/tarefas?status=completed" className="stat-link">
              {t('dashboard.viewCompleted')}
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-pending">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{t('dashboard.pendingTasks')}</h3>
            <p className="stat-value">{stats.pendingTasks}</p>
            <Link to="/tarefas?status=pending" className="stat-link">
              {t('dashboard.viewPending')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

