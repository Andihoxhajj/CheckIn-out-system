import { NavLink, Outlet } from 'react-router-dom';
import { CalendarCheck2, Home, Settings } from 'lucide-react';
import type { PropsWithChildren } from 'react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/history', label: 'History', icon: CalendarCheck2 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export const Layout = ({ children }: PropsWithChildren) => (
  <div className="flex min-h-screen bg-slate-950 text-slate-50">
    <aside className="w-60 border-r border-slate-800 bg-slate-900/60 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Villa Manager</h1>
      <p className="mt-1 text-sm text-slate-400">Check-in / Check-out</p>
      <nav className="mt-8 flex flex-col gap-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? 'bg-brand/20 text-brand-light' : 'text-slate-300 hover:bg-slate-800/60'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
    <main className="flex-1 p-8">
      {children ?? <Outlet />}
    </main>
  </div>
);

