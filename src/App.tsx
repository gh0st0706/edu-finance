import { useState } from 'react';

type Role = 'SUPREME' | 'FINANCE_ADMIN' | 'DEPT_HEAD' | 'STUDENT';

const ROLE_LABELS: Record<Role, string> = {
  SUPREME: 'Principal / Trustee',
  FINANCE_ADMIN: 'Finance Office',
  DEPT_HEAD: 'Department Head',
  STUDENT: 'Student',
};

const NAV_BY_ROLE: Record<Role, string[]> = {
  SUPREME: ['Overview', 'Analytics', 'Reports', 'Approvals', 'Student Records', 'Staff Records'],
  FINANCE_ADMIN: ['Overview', 'Students', 'Staff', 'Payroll', 'Bills & Fraud', 'Reports', 'GST Filing'],
  DEPT_HEAD: ['Overview', 'Dept. Students', 'Fund Requests', 'Scholarships', 'Fines', 'Notifications'],
  STUDENT: ['My Fees', 'Bills & Uploads', 'Scholarships', 'Notifications', 'Ask EduFin'],
};

const KPIS_BY_ROLE: Record<Role, { label: string; value: string; note?: string }[]> = {
  SUPREME: [
    { label: 'Revenue MTD', value: '₹42.8L', note: '↑ 8% vs last month' },
    { label: 'Flagged Bills', value: '3', note: '₹42,000 saved' },
    { label: 'Fee Defaulters', value: '12', note: 'at risk this term' },
  ],
  FINANCE_ADMIN: [
    { label: 'Collections Today', value: '₹3.1L' },
    { label: 'Pending Approvals', value: '7' },
    { label: 'Bills to Verify', value: '5' },
  ],
  DEPT_HEAD: [
    { label: 'Dept. Dues Outstanding', value: '₹1.4L' },
    { label: 'Fund Requests Pending', value: '2' },
    { label: 'Scholarship Candidates', value: '9' },
  ],
  STUDENT: [
    { label: 'Balance Due', value: '₹18,500', note: 'due in 6 days' },
    { label: 'Payment Punctuality', value: '92%' },
    { label: 'Scholarship Match', value: '1 eligible' },
  ],
};

function Login({ onLogin }: { onLogin: (role: Role) => void }) {
  const [role, setRole] = useState<Role>('FINANCE_ADMIN');

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-1/2 bg-ink text-white flex-col justify-between p-12 ledger-rules">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl tracking-tight">EduFin</span>
            <span className="font-mono text-xs text-white/50 tracking-widest">AI</span>
          </div>
          <p className="mt-1 text-sm text-white/60">Institutional finance, ledgered.</p>
        </div>
        <div className="max-w-sm">
          <p className="font-display text-xl leading-snug">
            Every rupee accounted for, every approval traceable, one system for the whole institution.
          </p>
          <div className="mt-6 flex gap-6 text-xs font-mono text-white/50">
            <span>OCR-VERIFIED</span>
            <span>AUDIT-LOGGED</span>
            <span>ROLE-SCOPED</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-canvas">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl text-ink mb-1">Sign in</h1>
          <p className="text-sm text-muted mb-8">Use your institution-issued credentials.</p>

          <label className="block text-xs font-medium text-muted mb-2 uppercase tracking-wide">Role (demo)</label>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`text-left px-3 py-2 rounded-md border text-sm transition ${
                  role === r
                    ? 'border-accent bg-accent-soft text-ink font-medium'
                    : 'border-line bg-surface text-muted hover:border-accent/50'
                }`}
              >
                {ROLE_LABELS[r]}
              </button>
            ))}
          </div>

          <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-wide">Email</label>
          <input
            className="w-full mb-4 px-3 py-2 rounded-md border border-line bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            placeholder="you@institution.edu"
          />

          <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-wide">Password</label>
          <input
            type="password"
            className="w-full mb-6 px-3 py-2 rounded-md border border-line bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            placeholder="••••••••"
          />

          <button
            onClick={() => onLogin(role)}
            className="w-full py-2.5 rounded-md bg-ink text-white text-sm font-medium hover:bg-ink-soft transition"
          >
            Sign in as {ROLE_LABELS[role]}
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ role, onLogout }: { role: Role; onLogout: () => void }) {
  const nav = NAV_BY_ROLE[role];
  const kpis = KPIS_BY_ROLE[role];
  const [active, setActive] = useState(nav[0]);

  return (
    <div className="min-h-screen flex bg-canvas">
      <aside className="w-60 bg-ink text-white flex flex-col ledger-rules">
        <div className="px-6 py-5 border-b border-white/10">
          <span className="font-display text-xl">EduFin</span>
          <span className="ml-1 font-mono text-[10px] text-white/50 align-top">AI</span>
        </div>
        <nav className="flex-1 py-4">
          {nav.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`w-full text-left px-6 py-2.5 text-sm transition ${
                active === item
                  ? 'bg-white/10 text-white font-medium border-l-2 border-accent'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-white/10 text-xs text-white/50">
          {ROLE_LABELS[role]}
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-surface border-b border-line flex items-center justify-between px-8">
          <div>
            <span className="text-xs uppercase tracking-wide text-muted">{ROLE_LABELS[role]}</span>
            <h2 className="font-display text-lg text-ink leading-tight">{active}</h2>
          </div>
          <button onClick={onLogout} className="text-sm text-muted hover:text-ink transition">
            Log out
          </button>
        </header>

        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {kpis.map((k) => (
              <div key={k.label} className="bg-surface border border-line rounded-lg p-5">
                <div className="text-xs uppercase tracking-wide text-muted mb-2">{k.label}</div>
                <div className="font-mono text-2xl text-ink">{k.value}</div>
                {k.note && <div className="text-xs text-accent mt-1">{k.note}</div>}
              </div>
            ))}
          </div>

          <div className="bg-surface border border-line rounded-lg p-8 text-center text-muted text-sm">
            {active} module — wire real data here once the API is connected.
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState<Role | null>(null);
  return role ? <Dashboard role={role} onLogout={() => setRole(null)} /> : <Login onLogin={setRole} />;
}