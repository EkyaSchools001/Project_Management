import type { TabConfig } from '@ekya/config';
import { NavLink } from 'react-router-dom';

export function NavBar({ tabs }: { tabs: TabConfig[] }) {
  return (
    <nav className="mb-6 flex flex-wrap gap-3 rounded-2xl bg-white p-4 shadow-sm">
      {tabs.map((tab) => (
        <NavLink
          key={tab.id}
          to={tab.path}
          className={({ isActive }) =>
            `rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
