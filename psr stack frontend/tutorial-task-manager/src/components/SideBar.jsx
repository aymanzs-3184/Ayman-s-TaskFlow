import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Board',    icon: '▦', to: '/'      },
  { label: 'My Tasks', icon: '✓', to: '/tasks' },
  { label: 'Team',     icon: '◎', to: '/team'  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 w-64
      bg-gray-900 text-white flex flex-col z-10">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <h1 className="text-lg font-bold text-white">
          Task<span className="text-indigo-400">Flow</span>
        </h1>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-gray-800 text-white w-full'
                : 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition w-full'
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500
            flex items-center justify-center
            text-sm font-semibold text-white flex-shrink-0">
            {user?.name[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name}
            </p>
          </div>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-white text-xs transition"
          >
            ✕
          </button>
        </div>
      </div>

    </aside>
  );
}