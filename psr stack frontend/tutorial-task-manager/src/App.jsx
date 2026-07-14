import { Routes, Route } from 'react-router-dom';
import LoginPage       from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProtectedLayout from './components/ProtectedLayout';
import BoardPage       from './pages/BoardPage';
import TasksPage       from './pages/TasksPage';
import TeamPage        from './pages/TeamPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/"      element={<BoardPage />}  />
        <Route path="/tasks" element={<TasksPage />}  />
        <Route path="/team"  element={<TeamPage />}   />
      </Route>
    </Routes>
  );
}