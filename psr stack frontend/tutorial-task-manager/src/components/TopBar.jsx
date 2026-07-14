import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/':      'My Board',
  '/tasks': 'My Tasks',
  '/team':  'Team',
};

export default function Topbar() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || 'TaskFlow';

  return (
    <header className="fixed top-0 right-0 left-64 h-16
      bg-white border-b border-gray-200
      flex items-center justify-between
      px-8 z-10">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
    </header>
  );
}