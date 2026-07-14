import { useState, useEffect } from 'react';
import { userService } from '../api/userService';

const avatarColors = [
  'bg-indigo-500', 'bg-pink-500', 'bg-amber-500',
  'bg-green-500',  'bg-blue-500',  'bg-purple-500',
];

export default function TeamPage() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    userService.getAll()
      .then(data => { if (!cancelled) { setUsers(data); setLoading(false); }})
      .catch(() => { if (!cancelled) { setError('Failed to load team'); setLoading(false); }});
    return () => { cancelled = true; };
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1,2,3].map(i => (
        <div key={i} className="h-40 rounded-xl bg-gray-200 animate-pulse" />
      ))}
    </div>
  );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="mb-6 mt-2">
        <h1 className="text-xl font-bold text-gray-900">Current Team</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {users.length} member{users.length !== 1 && 's'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition"
          >
            {/* Avatar */}
            <div className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold text-white ${avatarColors[index % avatarColors.length]}`}>
              {user.name[0].toUpperCase()}
            </div>

            <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
            <p className="text-xs text-gray-400 mt-0.5 mb-4 truncate">{user.email}</p>

            {/* Task stats */}
            <div className="flex justify-center gap-2">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                {user.todoCount} todo
              </span>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                {user.inProgressCount} active
              </span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                {user.doneCount} done
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
