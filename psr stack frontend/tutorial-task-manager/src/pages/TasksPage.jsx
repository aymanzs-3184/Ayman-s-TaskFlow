import { useState, useEffect } from 'react';
import { taskService } from '../api/TaskService';

const statusStripe = {
  todo:       'bg-blue-400',
  inprogress: 'bg-amber-400',
  done:       'bg-green-500',
};

const statusBadge = {
  todo:       'bg-blue-100 text-blue-700',
  inprogress: 'bg-amber-100 text-amber-700',
  done:       'bg-green-100 text-green-700',
};

const statusLabel = {
  todo:       'To Do',
  inprogress: 'In Progress',
  done:       'Done',
};

const priorityBadge = {
  high:   'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low:    'bg-green-100 text-green-700',
};

const FILTERS = [
  { id: 'all',        label: 'All'         },
  { id: 'todo',       label: 'To Do'      },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'done',       label: 'Done'        },
];

export default function TasksPage() {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const data = await taskService.getMyTasks();
        if (!cancelled) { setTasks(data); setLoading(false); }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load your tasks');
          setLoading(false);
        }
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, []);

  // Derived — no useState needed
  const filtered = filter === 'all'
    ? tasks
    : tasks.filter(t => t.status === filter);

  if (loading) return (
    <div className="flex flex-col gap-3">
      {[1,2,3,4].map(i => (
        <div key={i} className="h-16 rounded-xl bg-gray-200 animate-pulse" />
      ))}
    </div>
  );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>

      {/* Page header */}
      <div className="flex items-center justify-between mb-6 mt-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">
            {tasks.length} task{tasks.length !== 1 && 's'} have been currently assigned to you
          </p>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition
              ${filter === f.id
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-400 font-medium">No tasks found</p>
          <p className="text-gray-300 text-sm mt-1">
            {filter === 'all'
              ? 'You have no tasks assigned yet'
              : `No ${statusLabel[filter]} tasks`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition cursor-pointer"
            >
              {/* Status stripe */}
              <div className={`w-1 h-10 rounded-full flex-shrink-0 ${statusStripe[task.status]}`} />

              {/* Title + description */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {task.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {task.description || 'No description'}
                </p>
              </div>

              {/* Priority badge */}
              <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0
                ${priorityBadge[task.priority]}`}>
                {task.priority}
              </span>

              {/* Status badge */}
              <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0
                ${statusBadge[task.status]}`}>
                {statusLabel[task.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
