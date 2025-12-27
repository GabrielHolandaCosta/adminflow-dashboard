import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Task, User } from '@/types';
import { tasksApi, usersApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Select } from '@/components/Select';
import { Modal } from '@/components/Modal';
import './Tarefas.css';

export const Tarefas = () => {
  const { t, i18n } = useTranslation();
  const { user: currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tarefas, setTarefas] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get('status') || 'all'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as 'pending' | 'in_progress' | 'completed',
    userId: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const status = searchParams.get('status');
    if (status) {
      setStatusFilter(status);
    }
  }, [searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, usersData] = await Promise.all([
        tasksApi.getAll(),
        usersApi.getAll(),
      ]);
      setTarefas(tasksData);
      setUsers(usersData);
    } catch (err) {
      setError(t('tasks.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        userId: task.userId,
      });
    } else {
      setEditingTask(null);
      // Se for usuário comum, atribuir automaticamente a ele
      const defaultUserId = currentUser?.role === 'admin' 
        ? (users[0]?.id || '') 
        : (currentUser?.id || '');
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        userId: defaultUserId,
      });
    }
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    // Se for usuário comum, atribuir automaticamente a ele
    const defaultUserId = currentUser?.role === 'admin' 
      ? (users[0]?.id || '') 
      : (currentUser?.id || '');
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      userId: defaultUserId,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.description || !formData.userId) {
      setError(t('tasks.errorFillFields'));
      return;
    }

    try {
      if (editingTask) {
        // Se usuário comum está editando, garantir que não altere o userId
        const updateData = currentUser?.role === 'user' && editingTask.userId === currentUser.id
          ? { ...formData, userId: currentUser.id }
          : formData;
        await tasksApi.update(editingTask.id, updateData);
        setSuccess(t('tasks.successUpdated'));
      } else {
        // Se usuário comum está criando, garantir que seja atribuída a ele
        const createData = currentUser?.role === 'user'
          ? { ...formData, userId: currentUser.id }
          : formData;
        await tasksApi.create(createData);
        setSuccess(t('tasks.successCreated'));
      }
      await loadData();
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    } catch (err: any) {
      setError(err.message || t('tasks.errorSave'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('tasks.confirmDelete'))) {
      return;
    }

    try {
      await tasksApi.delete(id);
      setSuccess(t('tasks.successDeleted'));
      await loadData();
    } catch (err: any) {
      setError(err.message || t('tasks.errorDelete'));
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus =
      task.status === 'completed' ? 'pending' : 'completed';
    try {
      await tasksApi.update(task.id, { status: newStatus });
      await loadData();
    } catch (err: any) {
      setError(err.message || t('tasks.errorUpdateStatus'));
    }
  };

  // Funções de verificação de permissão
  const canEdit = (task: Task): boolean => {
    if (!currentUser) return false;
    // Admin pode editar qualquer tarefa
    if (currentUser.role === 'admin') return true;
    // Usuário comum só pode editar suas próprias tarefas
    return task.userId === currentUser.id;
  };

  const canDelete = (task: Task): boolean => {
    if (!currentUser) return false;
    // Admin pode excluir qualquer tarefa
    if (currentUser.role === 'admin') return true;
    // Usuário comum só pode excluir suas próprias tarefas
    return task.userId === currentUser.id;
  };

  const canToggleStatus = (task: Task): boolean => {
    if (!currentUser) return false;
    // Admin pode marcar qualquer tarefa
    if (currentUser.role === 'admin') return true;
    // Usuário comum pode marcar suas próprias tarefas
    return task.userId === currentUser.id;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: t('tasks.statusPending'),
      in_progress: t('tasks.statusInProgress'),
      completed: t('tasks.statusCompleted'),
    };
    return labels[status] || status;
  };

  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      pending: 'status-pending',
      in_progress: 'status-in-progress',
      completed: 'status-completed',
    };
    return classes[status] || '';
  };

  const filteredTarefas = tarefas.filter((tarefa) => {
    const matchesSearch =
      tarefa.title.toLowerCase().includes(search.toLowerCase()) ||
      tarefa.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tarefa.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="tarefas">
      <div className="tarefas-header">
        <div>
          <h1>{t('tasks.title')}</h1>
          <p>{t('tasks.subtitle')}</p>
        </div>
        <Button onClick={() => handleOpenModal()}>{t('tasks.newTask')}</Button>
      </div>

      <div className="tarefas-toolbar">
        <Input
          type="text"
          placeholder={t('tasks.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            if (e.target.value === 'all') {
              setSearchParams({});
            } else {
              setSearchParams({ status: e.target.value });
            }
          }}
          options={[
            { value: 'all', label: t('tasks.filterAll') },
            { value: 'pending', label: t('tasks.filterPending') },
            { value: 'in_progress', label: t('tasks.filterInProgress') },
            { value: 'completed', label: t('tasks.filterCompleted') },
          ]}
          className="status-filter"
        />
        <span className="tarefas-count">
          {t('tasks.taskCount', { count: filteredTarefas.length })}
        </span>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {filteredTarefas.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
          <p>{t('tasks.noTasksFound')}</p>
        </div>
      ) : (
        <div className="tarefas-list">
          {filteredTarefas.map((tarefa) => (
            <div key={tarefa.id} className="tarefa-card">
              <div className="tarefa-header">
                <div className="tarefa-title-row">
                  <input
                    type="checkbox"
                    checked={tarefa.status === 'completed'}
                    onChange={() => handleToggleStatus(tarefa)}
                    className="tarefa-checkbox"
                    disabled={!canToggleStatus(tarefa)}
                    title={!canToggleStatus(tarefa) ? t('tasks.tooltipToggleOwn') : ''}
                  />
                  <h3 className={tarefa.status === 'completed' ? 'completed' : ''}>
                    {tarefa.title}
                  </h3>
                </div>
                <span className={`tarefa-status ${getStatusClass(tarefa.status)}`}>
                  {getStatusLabel(tarefa.status)}
                </span>
              </div>
              <p className="tarefa-description">{tarefa.description}</p>
              <div className="tarefa-footer">
                <div className="tarefa-meta">
                  <span className="tarefa-user">👤 {tarefa.userName || t('tasks.unknownUser')}</span>
                  <span className="tarefa-date">
                    {new Date(tarefa.createdAt).toLocaleDateString(
                      i18n.language === 'en' ? 'en-US' : i18n.language === 'es' ? 'es-ES' : 'pt-BR'
                    )}
                  </span>
                </div>
                <div className="tarefa-actions">
                  {canEdit(tarefa) ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenModal(tarefa)}
                    >
                      {t('common.edit')}
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled
                      title={t('tasks.tooltipEditOwn')}
                    >
                      {t('common.edit')}
                    </Button>
                  )}
                  {canDelete(tarefa) ? (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(tarefa.id)}
                    >
                      {t('common.delete')}
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      size="sm"
                      disabled
                      title={t('tasks.tooltipDeleteOwn')}
                    >
                      {t('common.delete')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? t('tasks.editTask') : t('tasks.newTask')}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <Input
            label={t('tasks.taskTitle')}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Textarea
            label={t('tasks.description')}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <Select
            label={t('tasks.user')}
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            options={users.map((user) => ({
              value: user.id,
              label: user.name,
            }))}
            required
            disabled={
              currentUser?.role === 'user' // Usuário comum não pode alterar o usuário
            }
          />
          {currentUser?.role === 'user' && (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '-0.75rem', marginBottom: '0' }}>
              ℹ️ {editingTask ? t('tasks.infoOwnTask') : t('tasks.infoAssignedToYou')}
            </p>
          )}
          <Select
            label={t('tasks.status')}
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as 'pending' | 'in_progress' | 'completed',
              })
            }
            options={[
              { value: 'pending', label: t('tasks.statusPending') },
              { value: 'in_progress', label: t('tasks.statusInProgress') },
              { value: 'completed', label: t('tasks.statusCompleted') },
            ]}
          />
          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">{editingTask ? t('common.update') : t('common.create')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

