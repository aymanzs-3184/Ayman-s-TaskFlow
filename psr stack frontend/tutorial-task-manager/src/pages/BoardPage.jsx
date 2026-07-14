import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { taskService } from '../api/taskService';
import TaskCard from '../components/TaskCard';
import AddTaskModal from '../components/AddTaskModal';

const COLUMNS = [
  { id: 'todo',       label: 'To Do'       },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'done',       label: 'Done'        },
];

// ── Draggable card wrapper ──────────────────────────────────
function DraggableCard({ task }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <TaskCard {...task} />
    </div>
  );
}

// ── Droppable column wrapper ────────────────────────────────
function DroppableColumn({ col, tasks, onAddTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-3 rounded-xl p-4 min-h-64 transition-colors
        ${isOver
          ? 'bg-indigo-50 outline outline-2 outline-indigo-300'
          : 'bg-gray-100'}`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {col.label}
        </h2>
        <span className="text-xs bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-medium">
          {tasks.length}
        </span>
      </div>

      {/* Tasks or empty state */}
      {tasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-8">
          <p className="text-sm font-medium text-gray-400">No tasks</p>
          <p className="text-xs text-gray-300 mt-1">Drop tasks here</p>
        </div>
      ) : (
        tasks.map(task => <DraggableCard key={task.id} task={task} />)
      )}

      {/* Add task button */}
      <button
        onClick={() => onAddTask(col.id)}
        className="mt-auto w-full text-sm text-gray-400 border-2 border-dashed border-gray-300 rounded-lg py-2 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 transition duration-150"
      >
        + Add task
      </button>
    </div>
  );
}

// ── Board page ──────────────────────────────────────────────
export default function BoardPage() {
  const [tasks, setTasks]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [showModal, setShowModal]   = useState(false);
  const [openColumn, setOpenColumn] = useState(null);

  // PointerSensor with activation constraint — prevents accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // must move 8px to start drag
    })
  );

  useEffect(() => {
    let cancelled = false;
    const fetchTasks = async () => {
      try {
        const data = await taskService.getAll();
        if (!cancelled) { setTasks(data.content); setLoading(false); }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Failed to load tasks');
          setLoading(false);
        }
      }
    };
    fetchTasks();
    return () => { cancelled = true; };
  }, []);

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find(t => t.id === active.id) || null);
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;

    const taskId    = active.id;
    const newStatus = over.id;
    const task      = tasks.find(t => t.id === taskId);

    if (!task || task.status === newStatus) return;

    // Optimistic update
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    ));

    try {
      await taskService.updateStatus(taskId, newStatus);
    } catch {
      // Roll back on failure
      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, status: task.status } : t
      ));
    }
  };

  const handleAddTask     = (colId) => { setOpenColumn(colId); setShowModal(true); };
  const handleTaskCreated = (newTask) => { setTasks(prev => [...prev, newTask]); setShowModal(false); };

  if (loading) return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[1,2,3].map(i => (
        <div key={i} className="flex flex-col gap-3">
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          {[1,2].map(j => <div key={j} className="h-24 rounded-lg bg-gray-200 animate-pulse" />)}
        </div>
      ))}
    </div>
  );

  if (error) return (
    <div className="text-center py-12">
      <p className="text-red-500 font-medium">{error}</p>
      <button onClick={() => window.location.reload()} className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline">Try again</button>
    </div>
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {COLUMNS.map(col => (
          <DroppableColumn
            key={col.id}
            col={col}
            tasks={tasks.filter(t => t.status === col.id)}
            onAddTask={handleAddTask}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && <TaskCard {...activeTask} />}
      </DragOverlay>

      {showModal && (
        <AddTaskModal
          defaultStatus={openColumn}
          onCreated={handleTaskCreated}
          onClose={() => setShowModal(false)}
        />
      )}
    </DndContext>
  );
}