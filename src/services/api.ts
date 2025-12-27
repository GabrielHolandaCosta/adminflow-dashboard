import { User, Task } from '@/types';

// Simula delay de API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Armazenamento local (simula banco de dados)
let users: User[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@adminflow.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@example.com',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Maria Santos',
    email: 'maria@example.com',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
];

let tasks: Task[] = [
  {
    id: '1',
    title: 'Configurar sistema',
    description: 'Configurar ambiente de desenvolvimento',
    status: 'completed',
    userId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Revisar código',
    description: 'Revisar código do projeto AdminFlow',
    status: 'in_progress',
    userId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Testar funcionalidades',
    description: 'Testar todas as funcionalidades do sistema',
    status: 'pending',
    userId: '3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Usuário admin padrão (sempre deve existir)
const DEFAULT_ADMIN: User = {
  id: '1',
  name: 'Admin',
  email: 'admin@adminflow.com',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

// Carregar do localStorage se existir
const loadFromStorage = () => {
  const storedUsers = localStorage.getItem('adminflow_users');
  const storedTasks = localStorage.getItem('adminflow_tasks');
  
  if (storedUsers) {
    const parsedUsers = JSON.parse(storedUsers);
    // Garantir que sempre existe pelo menos um admin
    const hasAdmin = parsedUsers.some((u: User) => u.role === 'admin');
    if (!hasAdmin) {
      // Se não tem admin, adicionar o admin padrão
      parsedUsers.unshift(DEFAULT_ADMIN);
    }
    users = parsedUsers;
  } else {
    // Se não tem dados salvos, inicializar com admin padrão
    users = [DEFAULT_ADMIN];
  }
  
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
};

// Salvar no localStorage
const saveToStorage = () => {
  // Garantir que sempre existe pelo menos um admin antes de salvar
  const hasAdmin = users.some(u => u.role === 'admin');
  if (!hasAdmin) {
    // Se não tem admin, adicionar o admin padrão
    const adminExists = users.some(u => u.id === DEFAULT_ADMIN.id);
    if (!adminExists) {
      users.unshift(DEFAULT_ADMIN);
    } else {
      // Se o admin padrão existe mas não é admin, corrigir
      const adminIndex = users.findIndex(u => u.id === DEFAULT_ADMIN.id);
      if (adminIndex !== -1) {
        users[adminIndex] = { ...users[adminIndex], role: 'admin' };
      }
    }
  }
  localStorage.setItem('adminflow_users', JSON.stringify(users));
  localStorage.setItem('adminflow_tasks', JSON.stringify(tasks));
};

// Inicializar
loadFromStorage();

// Função para garantir que sempre existe um admin (chamada após operações críticas)
const ensureAdminExists = () => {
  const hasAdmin = users.some(u => u.role === 'admin');
  if (!hasAdmin) {
    const adminExists = users.some(u => u.id === DEFAULT_ADMIN.id);
    if (!adminExists) {
      users.unshift(DEFAULT_ADMIN);
    } else {
      const adminIndex = users.findIndex(u => u.id === DEFAULT_ADMIN.id);
      if (adminIndex !== -1) {
        users[adminIndex] = { ...users[adminIndex], role: 'admin' };
      }
    }
    saveToStorage();
  }
};

// Garantir admin na inicialização
ensureAdminExists();

// API de Autenticação
export const authApi = {
  login: async (email: string, _password: string): Promise<{ user: User; token: string }> => {
    await delay(800);
    
    // Garantir que sempre existe pelo menos um admin
    const hasAdmin = users.some(u => u.role === 'admin');
    if (!hasAdmin) {
      const adminExists = users.some(u => u.id === DEFAULT_ADMIN.id);
      if (!adminExists) {
        users.unshift(DEFAULT_ADMIN);
      } else {
        const adminIndex = users.findIndex(u => u.id === DEFAULT_ADMIN.id);
        if (adminIndex !== -1) {
          users[adminIndex] = { ...users[adminIndex], role: 'admin' };
        }
      }
    }
    
    // Se for o email do admin padrão, garantir que é admin
    if (email === DEFAULT_ADMIN.email) {
      let adminUser = users.find(u => u.email === email);
      if (!adminUser) {
        users.unshift(DEFAULT_ADMIN);
        adminUser = DEFAULT_ADMIN;
      } else if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
      }
      saveToStorage();
      return {
        user: adminUser,
        token: `fake-token-${adminUser.id}`,
      };
    }
    
    // Login fake - aceita qualquer email e senha
    const user = users.find(u => u.email === email) || {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      role: 'user' as const,
      createdAt: new Date().toISOString(),
    };
    
    if (!users.find(u => u.email === email)) {
      users.push(user);
      saveToStorage();
    }
    
    return {
      user,
      token: `fake-token-${user.id}`,
    };
  },
};

// Função auxiliar para obter usuário logado
const getCurrentUser = (): AuthUser | null => {
  const savedUser = localStorage.getItem('adminflow_user');
  if (!savedUser) return null;
  try {
    return JSON.parse(savedUser);
  } catch {
    return null;
  }
};

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// API de Usuários
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    await delay(500);
    return [...users];
  },
  
  getById: async (id: string): Promise<User | null> => {
    await delay(300);
    return users.find(u => u.id === id) || null;
  },
  
  create: async (data: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    await delay(600);
    const currentUser = getCurrentUser();
    
    // Usuários comuns não podem criar admins
    if (currentUser && currentUser.role === 'user' && data.role === 'admin') {
      throw new Error('Usuários comuns não podem criar administradores');
    }
    
    const newUser: User = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveToStorage();
    return newUser;
  },
  
  update: async (id: string, data: Partial<User>): Promise<User> => {
    await delay(600);
    const currentUser = getCurrentUser();
    const targetUser = users.find(u => u.id === id);
    
    if (!targetUser) {
      throw new Error('Usuário não encontrado');
    }
    
    // Usuário comum não pode editar admin
    if (currentUser && currentUser.role === 'user' && targetUser.role === 'admin') {
      throw new Error('Usuários comuns não podem editar administradores');
    }
    
    // Usuário comum não pode alterar permissões (role)
    if (currentUser && currentUser.role === 'user' && data.role && data.role !== targetUser.role) {
      throw new Error('Usuários comuns não podem alterar permissões');
    }
    
    // Admin não pode se editar (opcional - pode permitir editar nome/email, mas não role)
    if (currentUser && currentUser.id === id && data.role && data.role !== targetUser.role) {
      throw new Error('Você não pode alterar sua própria permissão');
    }
    
    const index = users.findIndex(u => u.id === id);
    users[index] = { ...users[index], ...data };
    saveToStorage();
    return users[index];
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(400);
    const currentUser = getCurrentUser();
    const targetUser = users.find(u => u.id === id);
    
    if (!targetUser) {
      throw new Error('Usuário não encontrado');
    }
    
    // Não pode excluir o admin padrão
    if (targetUser.id === DEFAULT_ADMIN.id) {
      throw new Error('Não é possível excluir o administrador padrão do sistema');
    }
    
    // Usuário comum não pode excluir admin
    if (currentUser && currentUser.role === 'user' && targetUser.role === 'admin') {
      throw new Error('Usuários comuns não podem excluir administradores');
    }
    
    // Admin não pode se excluir
    if (currentUser && currentUser.id === id) {
      throw new Error('Você não pode excluir sua própria conta');
    }
    
    // Não pode remover o último admin
    const adminCount = users.filter(u => u.role === 'admin').length;
    if (targetUser.role === 'admin' && adminCount === 1) {
      throw new Error('Não é possível remover o último administrador do sistema');
    }
    
    users = users.filter(u => u.id !== id);
    // Remover tarefas do usuário
    tasks = tasks.filter(t => t.userId !== id);
    saveToStorage();
  },
};

// API de Tarefas
export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    await delay(500);
    return tasks.map(task => ({
      ...task,
      userName: users.find(u => u.id === task.userId)?.name || 'Desconhecido',
    }));
  },
  
  getById: async (id: string): Promise<Task | null> => {
    await delay(300);
    const task = tasks.find(t => t.id === id);
    if (!task) return null;
    return {
      ...task,
      userName: users.find(u => u.id === task.userId)?.name || 'Desconhecido',
    };
  },
  
  create: async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    await delay(600);
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }
    
    const newTask: Task = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userName: users.find(u => u.id === data.userId)?.name || 'Desconhecido',
    };
    tasks.push(newTask);
    saveToStorage();
    return newTask;
  },
  
  update: async (id: string, data: Partial<Task>): Promise<Task> => {
    await delay(600);
    const currentUser = getCurrentUser();
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
      throw new Error('Tarefa não encontrada');
    }
    
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }
    
    // Usuário comum só pode editar suas próprias tarefas
    if (currentUser.role === 'user' && task.userId !== currentUser.id) {
      throw new Error('Você só pode editar suas próprias tarefas');
    }
    
    // Admin pode editar qualquer tarefa
    const index = tasks.findIndex(t => t.id === id);
    tasks[index] = {
      ...tasks[index],
      ...data,
      updatedAt: new Date().toISOString(),
      userName: users.find(u => u.id === tasks[index].userId)?.name || 'Desconhecido',
    };
    saveToStorage();
    return tasks[index];
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(400);
    const currentUser = getCurrentUser();
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
      throw new Error('Tarefa não encontrada');
    }
    
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }
    
    // Usuário comum só pode excluir suas próprias tarefas
    if (currentUser.role === 'user' && task.userId !== currentUser.id) {
      throw new Error('Você só pode excluir suas próprias tarefas');
    }
    
    // Admin pode excluir qualquer tarefa
    tasks = tasks.filter(t => t.id !== id);
    saveToStorage();
  },
};

