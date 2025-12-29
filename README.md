# 🧭 AdminFlow - Administrative Dashboard

🔗 **Live Demo:** https://adminflow-dashboard-ofjq.vercel.app  
🔗 **Repository:** adminflow-dashboard

## 🚀 Quick Highlights
- Fully responsive Admin Dashboard
- Authentication + session persistence (localStorage)
- Role-based access control (Admin/User)
- Complete CRUD for Users and Tasks with business rules
- Internationalization (pt-BR, en, es) with language persistence
- Protected and admin-only routes
- Tooltips and UI blocking for unauthorized actions
- Built with React, TypeScript, Vite, Tailwind
- Clean architecture and reusable components

A front-end administrative dashboard with permission control, well-defined business rules, and focus on user experience. Developed with React, TypeScript, and Vite to demonstrate modern front-end development skills.

![AdminFlow](https://img.shields.io/badge/AdminFlow-Dashboard-blue)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?logo=vite)
![i18n](https://img.shields.io/badge/i18n-react--i18next-green)

## 📋 About the Project

**AdminFlow** is a complete administrative dashboard that allows managing system users and tasks. It was developed as a portfolio project to demonstrate technical skills in modern front-end development, focusing on **business logic**, **permission control**, and **user experience**.

> **Project focused on demonstrating Front-End decision-making, business rules, and permission control, simulating real administrative system scenarios.**

### 🎯 Objective

Create a functional administrative system that demonstrates:
- Authentication and session control
- Permission control by profile (Admin/User)
- Well-defined business rules
- Intuitive and responsive interface
- Best practices in React/TypeScript development

## ✨ Features

### 🌍 1. Internationalization (i18n)

**Multi-language Support:**
- **Portuguese (pt-BR)** - Default language
- **English (en)** - Full translation
- **Spanish (es)** - Full translation

**Features:**
- Language switcher in the top right corner of all pages
- Available on login page and all authenticated pages
- Language preference saved in localStorage
- All UI elements translated (buttons, labels, messages, tooltips)
- Date formatting according to selected language
- Smooth language switching without page reload

**Language Switcher:**
- Beautiful dropdown component with country flags
- Shows current language with flag and code
- Positioned in the top right corner
- Fully responsive for mobile devices

👉 **This demonstrates modern i18n implementation with react-i18next.**

### 🔐 2. Authentication (Login)

- **Login Screen** with basic validation
- **Fields**: Email and Password
- **Validation**: Email and password cannot be empty
- **Session**: Stored in localStorage
- **Profiles**: Automatically defines if user is Admin or Regular User
- **Login**: Simulated system for authentication flow demonstration

### 👥 3. Profile Control (Admin vs User)

The system always knows:
- **Who is logged in**
- **What profile** (Admin or Regular User)
- **What they can or cannot do**

👉 **This is the heart of the project.**

### 📊 4. Dashboard

**For Admin:**
- Sees total number of users
- Sees all system tasks
- Sees completed and pending tasks (global)

**For Regular User:**
- Does not see user count
- Sees only their own tasks
- Sees their completed and pending tasks

### 👑 5. Users (ADMIN ONLY)

**Access:**
- ❌ Regular user **DOES NOT** see this screen
- ✅ Only Admin can access

**Features:**
- List all users
- Create new users
- Edit existing users
- Delete users

**Important Rules:**
- Admin cannot delete themselves
- Admin cannot remove the last admin from the system
- Regular users cannot edit/delete administrators
- Regular users cannot change permissions (roles)
- Admin can create regular users and other admins

👉 **This shows security awareness and business rules.**

### ✅ 6. Tasks (CORE OF THE SYSTEM)

**Access:**
- **Admin**: Sees and manages all tasks
- **Regular User**: Sees and manages only their own tasks

#### ✍️ Create Task

**Regular User:**
- Creates task automatically linked to them
- Cannot choose assignee (already assigned)
- User field disabled

**Admin:**
- Can create task for any user
- Can choose the assignee
- User field enabled

#### ✏️ Edit Task

**Regular User:**
- ✅ Edits only their own tasks
- ❌ Cannot edit other users' tasks
- ❌ Cannot edit Admin tasks
- Cannot change the assigned user

**Admin:**
- ✅ Edits any task
- Can change the assigned user
- Can change status, title, and description

#### 🗑️ Delete Task

**Same rule as editing:**
- **Regular User**: Can only delete their own tasks
- **Admin**: Can delete any task

#### 📌 Task Status

**Possible statuses:**
- Pending
- In Progress
- Completed

**Who can change:**
- **Regular User**: Only their own tasks
- **Admin**: Any task

**Additional features:**
- Status filters
- Task search
- Quick marking via checkbox

### 🚫 7. UI Blocking (VERY IMPORTANT)

Even being Front-End only, the system implements:

**Hide buttons:**
- Regular user does not see "Users" button in menu
- Edit/delete buttons disabled when no permission

**Disable actions:**
- Buttons deactivated when:
  - No permission
  - Not the task owner
  - Trying to delete themselves (admin)

**Clear messages:**
- Tooltips explaining why actions are disabled
- Specific error messages
- Success feedback

👉 **This shows security awareness, even without backend.**

### 🎨 8. User Experience (UX)

**Small details that matter a lot:**
- ✅ Clear feedback messages
- ✅ Confirmation when deleting
- ✅ Consistent layout
- ✅ Empty state (no tasks/users)
- ✅ Loading states
- ✅ Error handling
- ✅ Modals for forms
- ✅ Responsive design

### 🚫 9. 404 Page

- Handling of not found routes
- Navigation back to dashboard

## 🛠️ Technologies Used

- **React 18.2.0** - JavaScript library for building interfaces
- **TypeScript 5.2.2** - JavaScript superset with static typing
- **Vite 5.0.0** - Modern and fast build tool
- **React Router DOM 6.20.0** - Routing for React applications
- **react-i18next** - Internationalization framework for React
- **i18next** - Internationalization framework
- **Context API** - Global state management (authentication)
- **CSS3** - Custom styling with CSS variables

## 📦 Installation

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Steps

1. Clone the repository:
```bash
git clone https://github.com/your-username/adminflow.git
cd adminflow
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Access in browser:
```
http://localhost:5173
```

## 🚀 Available Scripts

- `npm run dev` - Starts development server
- `npm run build` - Creates production build
- `npm run preview` - Preview production build
- `npm run lint` - Runs linter

## 🔑 How to Use

### Login

You can login with **any email and password**. The system will automatically create a user if it doesn't exist.

**Example:**
- Email: `admin@adminflow.com`
- Password: `any-password`

**To test as Admin:**
- Use an email that already exists as admin (e.g., `admin@adminflow.com`)
- Or create a new user and then edit to Admin (if there's already an admin in the system)

**To test as Regular User:**
- Use any new email
- System will automatically create as regular user

### Language Selection

**Available Languages:**
- 🇧🇷 **Portuguese (pt-BR)** - Default
- 🇺🇸 **English (en)** - Full translation
- 🇪🇸 **Spanish (es)** - Full translation

**How to change language:**
1. Click on the language switcher in the top right corner
2. Select your preferred language
3. The entire interface will update immediately
4. Your preference is saved automatically

**Language switcher location:**
- Available on login page (top right)
- Available on all authenticated pages (top right)
- Fully responsive for mobile devices

### User Management (Admin Only)

1. Access the **Users** page from the side menu (only Admin sees this link)
2. Click **New User** to create a user
3. Use search to filter users
4. Click **Edit** to modify a user
5. Click **Delete** to remove a user

**Rules:**
- Admin cannot delete themselves
- Cannot remove the last admin
- Regular users cannot edit/delete admins

### Task Management

**As Admin:**
1. Access the **Tasks** page from the side menu
2. Click **New Task** to create a task
3. Choose the assigned user
4. Use filters to view tasks by status
5. Check checkbox to complete/uncomplete tasks
6. Edit or delete any task

**As Regular User:**
1. Access the **Tasks** page from the side menu
2. Click **New Task** (will be automatically assigned to you)
3. See only your own tasks
4. Edit or delete only your own tasks
5. Mark as completed only your own tasks

### Dashboard

**Admin sees:**
- Total users
- Total tasks (all)
- Completed tasks (all)
- Pending tasks (all)

**Regular User sees:**
- Total tasks (only theirs)
- Completed tasks (only theirs)
- Pending tasks (only theirs)

## 📋 Business Rules

### Permission Control

#### 👑 Admin

**Users:**
- ✅ Can access users page
- ✅ Can create users (regular and admins)
- ✅ Can edit regular users
- ✅ Can delete regular users
- ❌ Cannot delete themselves
- ❌ Cannot remove the last admin

**Tasks:**
- ✅ Can create tasks for any user
- ✅ Can edit any task
- ✅ Can delete any task
- ✅ Can mark any task as completed
- ✅ Can change task assignee

**Dashboard:**
- ✅ Sees global data (all users and tasks)

#### 👤 Regular User

**Users:**
- ❌ Cannot access users page (link hidden)
- ❌ Cannot see user list
- ❌ Cannot create/edit/delete users

**Tasks:**
- ✅ Can create tasks (automatically assigned to them)
- ✅ Can edit only their own tasks
- ✅ Can delete only their own tasks
- ✅ Can mark as completed only their own tasks
- ❌ Cannot edit other users' tasks
- ❌ Cannot change task assignee

**Dashboard:**
- ✅ Sees only their own data

## 💾 Data Storage

Data is stored in the browser's **localStorage**. This means:
- Data persists between sessions
- Each browser has its own data
- Data is lost when clearing browser cache

> **Note**: This project is front-end only, using localStorage to simulate data persistence. In production, integration with a real backend API would be necessary.

## 🎨 Design Features

- **Colors**: Modern palette with gradients
- **Typography**: Native system font system
- **Spacing**: Consistent spacing system
- **Shadows**: Subtle depth effects
- **Animations**: Smooth transitions
- **Responsiveness**: Layout adaptable for all devices

## 📱 Responsiveness

The project is fully responsive and works perfectly on:
- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)

## 🔒 Protected Routes

- **Public Routes**: `/login`
- **Protected Routes**: All other routes require authentication
- **Admin Routes**: `/usuarios` - Only Admin can access

Unauthenticated users are automatically redirected to the login page.

## 📁 Project Structure

```
adminflow/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Layout.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── AdminRoute.tsx
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx
│   ├── i18n/                # Internationalization
│   │   ├── config.ts
│   │   └── locales/
│   │       ├── pt-BR.json
│   │       ├── en.json
│   │       └── es.json
│   ├── pages/               # Application pages
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Usuarios.tsx
│   │   ├── Tarefas.tsx
│   │   └── NotFound.tsx
│   ├── services/            # Services and APIs
│   │   └── api.ts
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx              # Main component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static files
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## ⚠️ Important Note

This is a **Front-End project** focused on demonstrating:
- Well-defined **business rules**
- **Permission control** by profile
- **User experience** (UX)
- Professional **system logic**
- **Code organization** and best practices

**Technologies and Concepts Demonstrated:**
- State management (Context API)
- Protected routing
- Validations and business rules
- Responsive interface
- Modern TypeScript and React
- Authentication and session control
- Complete CRUD with permissions
- Internationalization (i18n) with react-i18next

> **Technical Note**: The project uses localStorage for data persistence, simulating a backend API. In a production environment, integration with a real backend would be necessary.

## 🚧 Future Improvements

**Technical Priority:**
- [ ] Automated tests (Jest, React Testing Library)
- [ ] Integration with real API (backend)
- [ ] Result pagination
- [ ] More robust form validation

**Features:**
- [ ] Data export (CSV, PDF)
- [ ] Advanced charts and visualizations
- [ ] Real-time notifications
- [ ] Dark mode
- [x] Internationalization (i18n) ✅

## 📄 License

This project is open source and available under the MIT license.

## 👨‍💻 Author

Project developed as part of my professional portfolio, focusing on modern Front-End and real business rules. Demonstrates skills in React, TypeScript, permission control, and user experience.

## 🙏 Acknowledgments

This project was developed following React and TypeScript best practices, focusing on clean code, organization, and user experience.

---

**Developed with ❤️ using React, TypeScript, Vite, and react-i18next**
