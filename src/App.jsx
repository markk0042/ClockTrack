import { useEffect, useMemo, useState } from 'react';

// ─── DEMO DATA ────────────────────────────────────────────────────────────────
const initialStaff = [
  { id: '1', name: 'Alice Murphy', company: 'HQ Dublin', department: 'Sales', email: 'alice@company.com', active: true },
  { id: '2', name: "Brian O'Connor", company: 'HQ Dublin', department: 'Engineering', email: 'brian@company.com', active: true },
  { id: '3', name: 'Claire Walsh', company: 'Branch Cork', department: 'HR', email: 'claire@company.com', active: true },
  { id: '4', name: 'David Byrne', company: 'HQ Dublin', department: 'Finance', email: 'david@company.com', active: true },
  { id: '5', name: 'Emma Gallagher', company: 'Branch Galway', department: 'Marketing', email: 'emma@company.com', active: true },
  { id: '6', name: 'Frank Kelly', company: 'HQ Dublin', department: 'Sales', email: 'frank@company.com', active: true },
  { id: '7', name: 'Grace Doyle', company: 'Branch Cork', department: 'Engineering', email: 'grace@company.com', active: true },
  { id: '8', name: 'Henry Nolan', company: 'HQ Dublin', department: 'Operations', email: 'henry@company.com', active: true },
  { id: '9', name: 'Irene Brennan', company: 'HQ Dublin', department: 'Sales', email: 'irene@company.com', active: true },
  { id: '10', name: 'James Fitzpatrick', company: 'Branch Cork', department: 'Finance', email: 'james@company.com', active: true },
];

const getDateStr = (d) => {
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const dy = String(d.getDate()).padStart(2, '0');
  return `${yr}-${mo}-${dy}`;
};

const now = new Date();
const todayStr = getDateStr(now);
const makeTime = (h, m) => {
  const d = new Date(now);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

const initialLogs = [
  { id: 'l1', staff_id: '1', clock_in: makeTime(8, 52), clock_out: makeTime(17, 5), date: todayStr, notes: '' },
  { id: 'l2', staff_id: '2', clock_in: makeTime(9, 1), clock_out: null, date: todayStr, notes: '' },
  { id: 'l3', staff_id: '3', clock_in: makeTime(8, 30), clock_out: makeTime(16, 30), date: todayStr, notes: '' },
  { id: 'l4', staff_id: '4', clock_in: makeTime(9, 15), clock_out: makeTime(18, 0), date: todayStr, notes: '' },
  { id: 'l5', staff_id: '5', clock_in: makeTime(8, 45), clock_out: makeTime(17, 15), date: todayStr, notes: '' },
  { id: 'l6', staff_id: '6', clock_in: makeTime(9, 0), clock_out: null, date: todayStr, notes: '' },
];

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const fmt = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' });
};

const fmtDate = (str) => {
  const d = new Date(`${str}T00:00:00`);
  return d.toLocaleDateString('en-IE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const minutesBetween = (a, b) => {
  if (!a || !b) return 0;
  return Math.round((new Date(b) - new Date(a)) / 60000);
};

const fmtHours = (mins) => {
  if (mins <= 0) return '0h 0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
};

const getWeekDates = (baseDate) => {
  const d = new Date(baseDate);
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(monday);
    dd.setDate(monday.getDate() + i);
    return getDateStr(dd);
  });
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('kiosk');
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminCreds, setAdminCreds] = useState({ u: '', p: '' });
  const [adminError, setAdminError] = useState('');
  const [staff, setStaff] = useState(initialStaff);
  const [logs, setLogs] = useState(initialLogs);

  const handleAdminLogin = () => {
    if (adminCreds.u === 'admin' && adminCreds.p === 'admin123') {
      setAdminLoggedIn(true);
      setAdminError('');
    } else {
      setAdminError('Invalid credentials. Try admin / admin123');
    }
  };

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        minHeight: '100vh',
        background: '#0f172a',
      }}
    >
      <div
        style={{
          background: '#1e293b',
          borderBottom: '1px solid #334155',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            ⏱
          </div>
          <div>
            <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15 }}>ClockTrack</div>
            <div style={{ color: '#64748b', fontSize: 11 }}>Staff Attendance System</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <NavBtn active={view === 'kiosk'} onClick={() => setView('kiosk')}>
            🏢 Kiosk
          </NavBtn>
          <NavBtn active={view === 'admin'} onClick={() => setView('admin')}>
            ⚙️ Admin
          </NavBtn>
        </div>
      </div>

      {view === 'kiosk' && <KioskView staff={staff} logs={logs} setLogs={setLogs} />}
      {view === 'admin' && !adminLoggedIn && (
        <AdminLogin
          creds={adminCreds}
          setCreds={setAdminCreds}
          onLogin={handleAdminLogin}
          error={adminError}
        />
      )}
      {view === 'admin' && adminLoggedIn && (
        <AdminPanel
          staff={staff}
          setStaff={setStaff}
          logs={logs}
          setLogs={setLogs}
          onLogout={() => {
            setAdminLoggedIn(false);
            setAdminCreds({ u: '', p: '' });
          }}
        />
      )}
    </div>
  );
}

const NavBtn = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? 'linear-gradient(135deg,#3b82f6,#6366f1)' : 'transparent',
      border: active ? 'none' : '1px solid #334155',
      borderRadius: 8,
      color: active ? '#fff' : '#94a3b8',
      padding: '6px 16px',
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: active ? 600 : 400,
    }}
  >
    {children}
  </button>
);

// ─── KIOSK VIEW ───────────────────────────────────────────────────────────────
const KioskView = ({ staff, logs, setLogs }) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState(null);
  const [tick, setTick] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTick(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const todayStr2 = getDateStr(tick);

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    return staff
      .filter((s) => s.active && s.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 8);
  }, [search, staff]);

  const getTodayLog = (sid) => logs.find((l) => l.staff_id === sid && l.date === todayStr2);

  const handleSelect = (person) => {
    setSelected(person);
    setSearch('');
  };

  const handleClock = (type) => {
    const nowIso = new Date().toISOString();
    const existing = getTodayLog(selected.id);
    if (type === 'in' && !existing) {
      setLogs((prev) => [
        ...prev,
        {
          id: `l${Date.now()}`,
          staff_id: selected.id,
          clock_in: nowIso,
          clock_out: null,
          date: todayStr2,
          notes: '',
        },
      ]);
    } else if (type === 'out' && existing && !existing.clock_out) {
      setLogs((prev) => prev.map((l) => (l.id === existing.id ? { ...l, clock_out: nowIso } : l)));
    }
    setStatus({
      type,
      name: selected.name,
      time: new Date().toLocaleTimeString('en-IE', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
    setSelected(null);
    setTimeout(() => setStatus(null), 4000);
  };

  const existingLog = selected ? getTodayLog(selected.id) : null;
  const canClockIn = selected && !existingLog;
  const canClockOut = selected && existingLog && !existingLog.clock_out;

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 61px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'radial-gradient(ellipse at 50% 0%, #1e3a5f 0%, #0f172a 60%)',
      }}
    >
      <div
        style={{
          color: '#60a5fa',
          fontSize: 52,
          fontWeight: 800,
          letterSpacing: -2,
          marginBottom: 4,
        }}
      >
        {tick.toLocaleTimeString('en-IE', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </div>
      <div style={{ color: '#475569', fontSize: 14, marginBottom: 40 }}>
        {tick.toLocaleDateString('en-IE', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </div>

      <div style={{ width: '100%', maxWidth: 500, position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 20,
            }}
          >
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelected(null);
            }}
            placeholder="Search your name to clock in / out..."
            style={{
              width: '100%',
              padding: '18px 18px 18px 52px',
              borderRadius: 14,
              background: '#1e293b',
              border: '2px solid #334155',
              color: '#f1f5f9',
              fontSize: 16,
              outline: 'none',
              boxSizing: 'border-box',
            }}
            autoComplete="off"
          />
        </div>

        {filtered.length > 0 && !selected && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 12,
              overflow: 'hidden',
              zIndex: 10,
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            {filtered.map((p) => {
              const log = getTodayLog(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  style={{
                    padding: '14px 18px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #0f172a',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#263548';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div>
                    <div style={{ color: '#f1f5f9', fontWeight: 600 }}>{p.name}</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>
                      {p.department} · {p.company}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      padding: '3px 10px',
                      borderRadius: 20,
                      background: log
                        ? log.clock_out
                          ? '#1a3a2a'
                          : '#1a2e4a'
                        : '#2a1a1a',
                      color: log
                        ? log.clock_out
                          ? '#4ade80'
                          : '#60a5fa'
                        : '#f87171',
                    }}
                  >
                    {log
                      ? log.clock_out
                        ? `✓ Out ${fmt(log.clock_out)}`
                        : `● In ${fmt(log.clock_in)}`
                      : 'Not clocked in'}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {search.trim() && filtered.length === 0 && !selected && (
          <div
            style={{
              marginTop: 12,
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 12,
              padding: '16px 20px',
              color: '#64748b',
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            No staff found matching &quot;{search}&quot;
          </div>
        )}

        {selected && (
          <div
            style={{
              marginTop: 16,
              background: '#1e293b',
              border: '2px solid #3b82f6',
              borderRadius: 14,
              padding: 28,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
                margin: '0 auto 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: '#fff',
                fontWeight: 700,
              }}
            >
              {selected.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 700 }}>{selected.name}</div>
            <div style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>
              {selected.department} · {selected.company}
            </div>
            {existingLog && (
              <div
                style={{
                  background: '#0f172a',
                  borderRadius: 10,
                  padding: '10px 16px',
                  marginBottom: 16,
                  fontSize: 13,
                  color: '#94a3b8',
                }}
              >
                Clocked in:{' '}
                <span style={{ color: '#60a5fa', fontWeight: 600 }}>
                  {fmt(existingLog.clock_in)}
                </span>
                {existingLog.clock_out && (
                  <>
                    {' '}
                    → Out:{' '}
                    <span style={{ color: '#4ade80', fontWeight: 600 }}>
                      {fmt(existingLog.clock_out)}
                    </span>
                  </>
                )}
              </div>
            )}
            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <ActionBtn disabled={!canClockIn} color="#3b82f6" onClick={() => handleClock('in')}>
                ↓ Clock In
              </ActionBtn>
              <ActionBtn
                disabled={!canClockOut}
                color="#22c55e"
                onClick={() => handleClock('out')}
              >
                ↑ Clock Out
              </ActionBtn>
              <ActionBtn color="#475569" onClick={() => setSelected(null)}>
                Cancel
              </ActionBtn>
            </div>
            {existingLog?.clock_out && (
              <div style={{ color: '#f59e0b', fontSize: 13, marginTop: 14 }}>
                ✓ You have already clocked out today.
              </div>
            )}
            {existingLog && !existingLog.clock_out && (
              <div style={{ color: '#60a5fa', fontSize: 13, marginTop: 14 }}>
                ● You are currently clocked in.
              </div>
            )}
          </div>
        )}
      </div>

      {status && (
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            background: status.type === 'in' ? '#1d4ed8' : '#15803d',
            border: `1px solid ${status.type === 'in' ? '#3b82f6' : '#22c55e'}`,
            borderRadius: 14,
            padding: '16px 32px',
            color: '#fff',
            fontSize: 16,
            fontWeight: 600,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            zIndex: 100,
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          {status.type === 'in' ? '⏱ Clocked In' : '✅ Clocked Out'}
          <br />
          <span style={{ fontWeight: 400, fontSize: 14 }}>
            {status.name} at {status.time}
          </span>
        </div>
      )}
    </div>
  );
};

const ActionBtn = ({ disabled, color, onClick, children }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    style={{
      background: disabled ? '#1e293b' : color,
      border: `1px solid ${disabled ? '#334155' : color}`,
      borderRadius: 10,
      color: disabled ? '#475569' : '#fff',
      padding: '12px 22px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: 14,
      fontWeight: 600,
    }}
  >
    {children}
  </button>
);

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
const AdminLogin = ({ creds, setCreds, onLogin, error }) => (
  <div
    style={{
      minHeight: 'calc(100vh - 61px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f172a',
    }}
  >
    <div
      style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: 20,
        padding: 40,
        width: 360,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
      <div
        style={{
          color: '#f1f5f9',
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        Admin Login
      </div>
      <div style={{ color: '#64748b', fontSize: 13, marginBottom: 28 }}>
        Username:{' '}
        <b style={{ color: '#94a3b8' }}>
          admin
        </b>{' '}
        &nbsp;/&nbsp; Password:{' '}
        <b style={{ color: '#94a3b8' }}>
          admin123
        </b>
      </div>
      <input
        value={creds.u}
        onChange={(e) => setCreds((c) => ({ ...c, u: e.target.value }))}
        placeholder="Username"
        style={{ ...IS, marginBottom: 10, width: '100%', boxSizing: 'border-box' }}
      />
      <input
        value={creds.p}
        onChange={(e) => setCreds((c) => ({ ...c, p: e.target.value }))}
        onKeyDown={(e) => e.key === 'Enter' && onLogin()}
        type="password"
        placeholder="Password"
        style={{ ...IS, width: '100%', boxSizing: 'border-box' }}
      />
      {error && (
        <div style={{ color: '#f87171', fontSize: 13, marginTop: 10 }}>{error}</div>
      )}
      <button
        onClick={onLogin}
        style={{
          marginTop: 20,
          width: '100%',
          background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
          border: 'none',
          borderRadius: 10,
          color: '#fff',
          padding: '13px',
          cursor: 'pointer',
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        Sign In
      </button>
    </div>
  </div>
);

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
const AdminPanel = ({ staff, setStaff, logs, setLogs, onLogout }) => {
  const [tab, setTab] = useState('dashboard');

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 61px)' }}>
      <div
        style={{
          width: 210,
          background: '#1e293b',
          borderRight: '1px solid #334155',
          padding: '16px 12px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {[
          ['dashboard', '📊 Dashboard'],
          ['clock-logs', '🕐 Clock Logs'],
          ['staff', '👥 Staff'],
          ['reports', '📄 Reports'],
        ].map(([t, label]) => (
          <SideBtn key={t} active={tab === t} onClick={() => setTab(t)}>
            {label}
          </SideBtn>
        ))}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: 16,
            borderTop: '1px solid #334155',
          }}
        >
          <SideBtn onClick={onLogout}>🚪 Logout</SideBtn>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          padding: 28,
          overflow: 'auto',
          background: '#0f172a',
        }}
      >
        {tab === 'dashboard' && <Dashboard staff={staff} logs={logs} />}
        {tab === 'clock-logs' && (
          <ClockLogsAdmin staff={staff} logs={logs} setLogs={setLogs} />
        )}
        {tab === 'staff' && <StaffAdmin staff={staff} setStaff={setStaff} />}
        {tab === 'reports' && <Reports staff={staff} logs={logs} />}
      </div>
    </div>
  );
};

const SideBtn = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      textAlign: 'left',
      padding: '10px 12px',
      borderRadius: 9,
      background: active ? '#1e3a5f' : 'transparent',
      border: active ? '1px solid #3b82f640' : '1px solid transparent',
      color: active ? '#93c5fd' : '#94a3b8',
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: active ? 600 : 400,
      marginBottom: 4,
    }}
  >
    {children}
  </button>
);

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ staff, logs }) => {
  const today = getDateStr(new Date());
  const todayLogs = logs.filter((l) => l.date === today);
  const clockedIn = todayLogs.filter((l) => l.clock_in && !l.clock_out).length;
  const clockedOut = todayLogs.filter((l) => l.clock_out).length;
  const weekDates = getWeekDates(new Date());
  const totalNet = logs
    .filter((l) => weekDates.includes(l.date) && l.clock_out)
    .reduce(
      (a, l) => a + Math.max(0, minutesBetween(l.clock_in, l.clock_out) - 30),
      0,
    );
  const currentlyIn = staff.filter(
    (s) =>
      s.active &&
      todayLogs.find((l) => l.staff_id === s.id && l.clock_in && !l.clock_out),
  );

  return (
    <div>
      <PageTitle>Dashboard</PageTitle>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <StatCard
          icon="👥"
          label="Active Staff"
          value={staff.filter((s) => s.active).length}
          color="#3b82f6"
        />
        <StatCard icon="●" label="Currently In" value={clockedIn} color="#22c55e" />
        <StatCard icon="✓" label="Clocked Out" value={clockedOut} color="#60a5fa" />
        <StatCard
          icon="⏱"
          label="Net Hrs This Week"
          value={fmtHours(totalNet)}
          color="#a78bfa"
        />
      </div>
      <div
        style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 14,
          padding: 20,
        }}
      >
        <div
          style={{
            color: '#f1f5f9',
            fontWeight: 600,
            marginBottom: 14,
          }}
        >
          Currently Clocked In Today ({currentlyIn.length})
        </div>
        {currentlyIn.length === 0 ? (
          <div style={{ color: '#475569', fontSize: 13 }}>Nobody currently clocked in.</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {currentlyIn.map((p) => {
              const log = todayLogs.find((l) => l.staff_id === p.id);
              return (
                <div
                  key={p.id}
                  style={{
                    background: '#0f172a',
                    borderRadius: 10,
                    padding: '10px 16px',
                    border: '1px solid #1d4ed8',
                    minWidth: 170,
                  }}
                >
                  <div
                    style={{
                      color: '#f1f5f9',
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    {p.name}
                  </div>
                  <div style={{ color: '#60a5fa', fontSize: 12 }}>
                    In since {fmt(log?.clock_in)}
                  </div>
                  <div style={{ color: '#475569', fontSize: 11 }}>{p.department}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div
    style={{
      background: '#1e293b',
      border: `1px solid ${color}30`,
      borderRadius: 14,
      padding: '18px 20px',
    }}
  >
    <div style={{ color, fontSize: 20, marginBottom: 8 }}>{icon}</div>
    <div style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 800 }}>{value}</div>
    <div style={{ color: '#64748b', fontSize: 12 }}>{label}</div>
  </div>
);

// ─── CLOCK LOGS ADMIN ─────────────────────────────────────────────────────────
const ClockLogsAdmin = ({ staff, logs, setLogs }) => {
  const [dateFilter, setDateFilter] = useState(getDateStr(new Date()));
  const [editLog, setEditLog] = useState(null);
  const [editVals, setEditVals] = useState({
    clock_in: '',
    clock_out: '',
    notes: '',
  });

  const dayLogs = logs.filter((l) => l.date === dateFilter);

  const openEdit = (log) => {
    setEditLog(log);
    setEditVals({
      clock_in: log.clock_in
        ? new Date(log.clock_in).toTimeString().slice(0, 5)
        : '',
      clock_out: log.clock_out
        ? new Date(log.clock_out).toTimeString().slice(0, 5)
        : '',
      notes: log.notes || '',
    });
  };

  const saveEdit = () => {
    const toISO = (t) => {
      if (!t) return null;
      const [h, m] = t.split(':').map(Number);
      const d = new Date(`${editLog.date}T00:00:00`);
      d.setHours(h, m, 0, 0);
      return d.toISOString();
    };

    setLogs((prev) =>
      prev.map((l) =>
        l.id === editLog.id
          ? {
              ...l,
              clock_in: toISO(editVals.clock_in),
              clock_out: toISO(editVals.clock_out) || null,
              notes: editVals.notes,
            }
          : l,
      ),
    );
    setEditLog(null);
  };

  const deleteLog = (log) => {
    // eslint-disable-next-line no-restricted-globals
    if (window.confirm(`Delete record for ${staff.find((s) => s.id === log.staff_id)?.name}?`)) {
      setLogs((prev) => prev.filter((l) => l.id !== log.id));
    }
  };

  return (
    <div>
      <PageTitle>Clock Logs</PageTitle>
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ ...IS, width: 'auto' }}
        />
        <div style={{ color: '#64748b', fontSize: 13 }}>
          {dayLogs.length} record{dayLogs.length !== 1 ? 's' : ''} for{' '}
          {fmtDate(dateFilter)}
        </div>
      </div>
      <div
        style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 14,
          overflow: 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
          <thead>
            <tr style={{ background: '#0f172a' }}>
              {[
                'Staff',
                'Dept',
                'Clock In',
                'Clock Out',
                'Gross',
                'Net (−30m)',
                'Notes',
                'Actions',
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 14px',
                    color: '#64748b',
                    fontSize: 12,
                    fontWeight: 600,
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dayLogs.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: 32,
                    textAlign: 'center',
                    color: '#475569',
                  }}
                >
                  No records for this date
                </td>
              </tr>
            )}
            {dayLogs.map((log) => {
              const person = staff.find((s) => s.id === log.staff_id);
              const gross = log.clock_out
                ? minutesBetween(log.clock_in, log.clock_out)
                : null;
              const net = gross != null ? gross - 30 : null;

              return (
                <tr key={log.id} style={{ borderTop: '1px solid #0f172a' }}>
                  <td style={TD}>
                    <b style={{ color: '#f1f5f9' }}>{person?.name || 'Unknown'}</b>
                  </td>
                  <td style={TD}>
                    <span style={{ color: '#64748b', fontSize: 12 }}>
                      {person?.department}
                    </span>
                  </td>
                  <td style={TD}>
                    <span style={{ color: '#60a5fa' }}>{fmt(log.clock_in)}</span>
                  </td>
                  <td style={TD}>
                    <span style={{ color: '#4ade80' }}>{fmt(log.clock_out)}</span>
                  </td>
                  <td style={TD}>{gross != null ? fmtHours(gross) : '—'}</td>
                  <td style={TD}>
                    <span
                      style={{
                        color: net != null && net > 0 ? '#a78bfa' : '#f87171',
                      }}
                    >
                      {net != null ? fmtHours(Math.max(0, net)) : '—'}
                    </span>
                  </td>
                  <td style={TD}>
                    <span style={{ color: '#475569', fontSize: 12 }}>
                      {log.notes}
                    </span>
                  </td>
                  <td style={TD}>
                    <button
                      type="button"
                      onClick={() => openEdit(log)}
                      style={{ ...SB, background: '#1d4ed8', marginRight: 6 }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteLog(log)}
                      style={{ ...SB, background: '#7f1d1d' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editLog && (
        <Modal title="Edit Clock Record" onClose={() => setEditLog(null)}>
          <div
            style={{
              color: '#94a3b8',
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {staff.find((s) => s.id === editLog.staff_id)?.name} ·{' '}
            {fmtDate(editLog.date)}
          </div>
          <LI
            label="Clock In"
            type="time"
            value={editVals.clock_in}
            onChange={(v) => setEditVals((p) => ({ ...p, clock_in: v }))}
          />
          <LI
            label="Clock Out"
            type="time"
            value={editVals.clock_out}
            onChange={(v) => setEditVals((p) => ({ ...p, clock_out: v }))}
          />
          <LI
            label="Notes"
            value={editVals.notes}
            onChange={(v) => setEditVals((p) => ({ ...p, notes: v }))}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button type="button" onClick={saveEdit} style={PB}>
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditLog(null)}
              style={XB}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── STAFF ADMIN ──────────────────────────────────────────────────────────────
const StaffAdmin = ({ staff, setStaff }) => {
  const [showForm, setShowForm] = useState(false);
  const [editPerson, setEditPerson] = useState(null);
  const [form, setForm] = useState({
    name: '',
    company: '',
    department: '',
    email: '',
    active: true,
  });
  const [search, setSearch] = useState('');

  const filtered = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.department || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.company || '').toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setForm({
      name: '',
      company: '',
      department: '',
      email: '',
      active: true,
    });
    setEditPerson(null);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      company: p.company || '',
      department: p.department || '',
      email: p.email || '',
      active: p.active,
    });
    setEditPerson(p);
    setShowForm(true);
  };

  const save = () => {
    if (!form.name.trim()) return;

    if (editPerson) {
      setStaff((prev) =>
        prev.map((p) => (p.id === editPerson.id ? { ...p, ...form } : p)),
      );
    } else {
      setStaff((prev) => [...prev, { id: `s${Date.now()}`, ...form }]);
    }
    setShowForm(false);
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <PageTitle style={{ margin: 0 }}>
          Staff ({staff.filter((s) => s.active).length} active / {staff.length} total)
        </PageTitle>
        <button type="button" onClick={openAdd} style={PB}>
          + Add Staff Member
        </button>
      </div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, dept, or company..."
        style={{
          ...IS,
          marginBottom: 16,
          width: '100%',
          maxWidth: 380,
          boxSizing: 'border-box',
        }}
      />

      <div
        style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 14,
          overflow: 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr style={{ background: '#0f172a' }}>
              {['Name', 'Company', 'Department', 'Email', 'Status', 'Actions'].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: '12px 14px',
                      color: '#64748b',
                      fontSize: 12,
                      fontWeight: 600,
                      textAlign: 'left',
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                style={{
                  borderTop: '1px solid #0f172a',
                  opacity: p.active ? 1 : 0.5,
                }}
              >
                <td style={TD}>
                  <b style={{ color: '#f1f5f9' }}>{p.name}</b>
                </td>
                <td style={TD}>
                  <span style={{ color: '#94a3b8', fontSize: 13 }}>{p.company}</span>
                </td>
                <td style={TD}>
                  <span style={{ color: '#94a3b8', fontSize: 13 }}>
                    {p.department}
                  </span>
                </td>
                <td style={TD}>
                  <span style={{ color: '#64748b', fontSize: 12 }}>{p.email}</span>
                </td>
                <td style={TD}>
                  <span
                    style={{
                      fontSize: 11,
                      padding: '3px 10px',
                      borderRadius: 20,
                      background: p.active ? '#14532d' : '#1c1917',
                      color: p.active ? '#4ade80' : '#78716c',
                    }}
                  >
                    {p.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={TD}>
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    style={{ ...SB, background: '#1d4ed8', marginRight: 6 }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setStaff((prev) =>
                        prev.map((s) =>
                          s.id === p.id ? { ...s, active: !s.active } : s,
                        ),
                      )
                    }
                    style={{
                      ...SB,
                      background: p.active ? '#7c2d12' : '#14532d',
                    }}
                  >
                    {p.active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <Modal
          title={editPerson ? 'Edit Staff Member' : 'Add New Staff Member'}
          onClose={() => setShowForm(false)}
        >
          <LI
            label="Full Name *"
            value={form.name}
            onChange={(v) => setForm((p) => ({ ...p, name: v }))}
          />
          <LI
            label="Company / Location"
            value={form.company}
            onChange={(v) => setForm((p) => ({ ...p, company: v }))}
          />
          <LI
            label="Department"
            value={form.department}
            onChange={(v) => setForm((p) => ({ ...p, department: v }))}
          />
          <LI
            label="Email"
            value={form.email}
            onChange={(v) => setForm((p) => ({ ...p, email: v }))}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button type="button" onClick={save} style={PB}>
              {editPerson ? 'Save Changes' : 'Add Staff'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={XB}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── REPORTS HELPERS ──────────────────────────────────────────────────────────
const getDatesInRange = (start, end) => {
  const dates = [];
  const cur = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);

  while (cur <= last) {
    dates.push(getDateStr(cur));
    cur.setDate(cur.getDate() + 1);
  }

  return dates;
};

const getWeekRanges = (startDate, endDate) => {
  const weeks = [];
  let cur = new Date(`${startDate}T00:00:00`);
  const last = new Date(`${endDate}T00:00:00`);
  const day = cur.getDay();

  cur.setDate(cur.getDate() - (day === 0 ? 6 : day - 1));

  while (cur <= last) {
    const wStart = getDateStr(cur);
    const wEnd = new Date(cur);
    wEnd.setDate(cur.getDate() + 6);

    weeks.push({ start: wStart, end: getDateStr(wEnd) });
    cur.setDate(cur.getDate() + 7);
  }

  return weeks;
};

// ─── PDF BUILDER ──────────────────────────────────────────────────────────────
const buildPDF = (summary, activeDates, weekRanges, mode, rangeStart, rangeEnd, LUNCH) => {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const PW = 297;
  const PH = 210;
  const ML = 14;
  const MR = 14;
  const usableW = PW - ML - MR;
  const COLS = [
    'Date',
    'Day',
    'Clock In',
    'Clock Out',
    'Gross',
    'Lunch',
    'Net Hours',
    'Notes',
  ];
  const fixedColWidths = [30, 14, 18, 18, 18, 14, 20];
  const totalFixedWidth = fixedColWidths.reduce((a, b) => a + b, 0);
  const notesWidth = usableW - totalFixedWidth - 8; // keep extra right margin, but give notes more space
  const CW = [...fixedColWidths, notesWidth];
  const TABLE_W = usableW; // table stays within margins for equal left/right white space

  let pageNum = 1;

  const addPageNum = () => {
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Page ${pageNum}`, PW - MR, PH - 5, { align: 'right' });
    doc.text(`Generated: ${new Date().toLocaleString('en-IE')}`, ML, PH - 5);
  };

  const rightEdge = ML + usableW - 5; // summary text ends here for cleaner reading

  const drawHeader = (title) => {
    // Light header bar for easier reading
    doc.setFillColor(241, 245, 249); // light slate
    doc.rect(0, 0, PW, 20, 'F');

    doc.setFillColor(148, 163, 184); // subtle accent stripe
    doc.rect(0, 20, PW, 1.5, 'F');

    doc.setTextColor(15, 23, 42); // dark text
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ClockTrack — Attendance Report', ML, 9);

    doc.setTextColor(37, 99, 235); // blue title on the right
    doc.text(title, rightEdge, 9, { align: 'right' });
  };

  const drawTableHeader = (y) => {
    doc.setFillColor(226, 232, 240); // light header band
    doc.rect(ML, y, TABLE_W, 7, 'F');
    doc.setTextColor(71, 85, 105); // darker header text
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');

    let x = ML;
    COLS.forEach((c, i) => {
      doc.text(c, x + 1.5, y + 4.8);
      x += CW[i];
    });

    return y + 7;
  };

  const drawRow = (y, vals, shade, isWeekend) => {
    if (shade) {
      doc.setFillColor(248, 250, 252); // very light alternating row
      doc.rect(ML, y, TABLE_W, 6, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);

    let x = ML;

    vals.forEach((v, i) => {
      const colors = [
        isWeekend ? [71, 85, 105] : [148, 163, 184], // date
        isWeekend ? [71, 85, 105] : [100, 116, 139], // day
        [96, 165, 250], // in
        [74, 222, 128], // out
        [148, 163, 184], // gross
        [248, 113, 113], // lunch
        [167, 139, 250], // net
        [71, 85, 105], // notes
      ];

      doc.setTextColor(...colors[i]);
      doc.text(String(v ?? '—'), x + 1.5, y + 4.2);
      x += CW[i];
    });

    return y + 6;
  };

  const drawStaffHeader = (y, s, totalDays, grossMins, netMins) => {
    doc.setFillColor(219, 234, 254); // soft blue bar
    doc.rect(ML, y, TABLE_W, 8, 'F');
    doc.setFillColor(59, 130, 246); // blue accent strip
    doc.rect(ML, y, 2, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42); // dark name text
    doc.text(s.name, ML + 5, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // softer subtitle
    const nameGap = 10; // space between name and company · department
    doc.text(
      `${s.company || ''}  ·  ${s.department || ''}`,
      ML + 5 + doc.getTextWidth(s.name) + nameGap,
      y + 5.5,
    );

    return y + 10;
  };

  const drawWeekSubHeader = (y, label, wDays, wGross, wNet) => {
    doc.setFillColor(226, 232, 240); // light band
    doc.rect(ML, y, TABLE_W, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(37, 99, 235); // blue label
    doc.text(label, ML + 3, y + 4.2);

    doc.setTextColor(100, 116, 139); // softer summary
    const s2 = `${wDays} day${wDays !== 1 ? 's' : ''}   Gross: ${fmtHours(
      wGross,
    )}   −${wDays * LUNCH}m   Net: ${fmtHours(wNet)}`;
    doc.text(s2, rightEdge, y + 4.2, { align: 'right' });

    return y + 6;
  };

  const checkPageBreak = (y, needed = 20) => {
    if (y + needed > PH - 12) {
      addPageNum();
      doc.addPage();
      pageNum += 1;
      return 26;
    }
    return y;
  };

  const periodLabel =
    mode === 'week'
      ? `Week: ${fmtDate(activeDates[0])} – ${fmtDate(
          activeDates[activeDates.length - 1],
        )}`
      : `Period: ${fmtDate(activeDates[0])} – ${fmtDate(
          activeDates[activeDates.length - 1],
        )}  (${weekRanges.length} week${weekRanges.length !== 1 ? 's' : ''})`;

  const totalAllDays = summary.reduce((a, s) => a + s.days, 0);
  const totalAllNet = summary.reduce((a, s) => a + s.net, 0);

  drawHeader(periodLabel);

  let y = 26;

  summary.forEach((s) => {
    y = checkPageBreak(y, 30);

    y = drawStaffHeader(y, s, s.days, s.gross, s.net);

    if (mode === 'week') {
      y = drawTableHeader(y);
      activeDates.forEach((dateStr, di) => {
        y = checkPageBreak(y, 8);
        const log = s.sLogs.find((l) => l.date === dateStr);
        const gross = log ? minutesBetween(log.clock_in, log.clock_out) : null;
        const net = gross != null ? Math.max(0, gross - LUNCH) : null;
        const dayName = new Date(`${dateStr}T00:00:00`).toLocaleDateString(
          'en-IE',
          { weekday: 'short' },
        );
        const isWknd = di >= 5;

        y = drawRow(
          y,
          [
            fmtDate(dateStr).replace(/^\w+,\s*/, ''),
            dayName,
            fmt(log?.clock_in),
            fmt(log?.clock_out),
            gross != null ? fmtHours(gross) : '—',
            log ? `${LUNCH}m` : '—',
            net != null ? fmtHours(net) : '—',
            log?.notes || '',
          ],
          di % 2 === 1,
          isWknd,
        );
      });
      // Week total: net hours Monday–Sunday
      y = checkPageBreak(y, 8);
      doc.setFillColor(226, 232, 240);
      doc.rect(ML, y, TABLE_W, 6.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(37, 99, 235);
      doc.text(`Net hours (Mon–Sun): ${fmtHours(s.net)}`, ML + 3, y + 4.5);
      y += 8;
    } else {
      s.weekBreakdown
        .filter((w) => w.days > 0)
        .forEach((w, wi) => {
          y = checkPageBreak(y, 20);
          y = drawWeekSubHeader(
            y,
            `Week ${wi + 1}: ${fmtDate(w.start)} – ${fmtDate(w.end)}`,
            w.days,
            w.gross,
            w.net,
          );
          y = drawTableHeader(y);

          w.dates.forEach((dateStr, di) => {
            const isOut = dateStr < rangeStart || dateStr > rangeEnd;
            const log = w.logs.find((l) => l.date === dateStr);

            if (isOut && !log) return;

            y = checkPageBreak(y, 8);
            const gross = log ? minutesBetween(log.clock_in, log.clock_out) : null;
            const net = gross != null ? Math.max(0, gross - LUNCH) : null;
            const dayName = new Date(`${dateStr}T00:00:00`).toLocaleDateString(
              'en-IE',
              { weekday: 'short' },
            );
            y = drawRow(
              y,
              [
                fmtDate(dateStr).replace(/^\w+,\s*/, ''),
                dayName,
                fmt(log?.clock_in),
                fmt(log?.clock_out),
                gross != null ? fmtHours(gross) : '—',
                log ? `${LUNCH}m` : '—',
                net != null ? fmtHours(net) : '—',
                log?.notes || '',
              ],
              di % 2 === 1,
              false,
            );
          });
        });

      y = checkPageBreak(y, 8);
      doc.setFillColor(226, 232, 240); // light total row
      doc.rect(ML, y, usableW, 6.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(37, 99, 235); // blue total text
      doc.text(
        `TOTAL for ${s.name}:  ${s.days} days   Gross ${fmtHours(
          s.gross,
        )}   −${s.days * LUNCH}m   Net ${fmtHours(s.net)}`,
        ML + 3,
        y + 4.5,
      );
      y += 8;
    }

    y += 5;
  });

  addPageNum();

  const safePeriod =
    activeDates.length > 0
      ? `${activeDates[0]}_to_${activeDates[activeDates.length - 1]}`
      : 'report';

  doc.save(`clocktrack_report_${safePeriod}.pdf`);
};

// ─── REPORTS UI ───────────────────────────────────────────────────────────────
const Reports = ({ staff, logs }) => {
  const [mode, setMode] = useState('week');
  const [weekBase, setWeekBase] = useState(getDateStr(new Date()));
  const [rangeStart, setRangeStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 13);
    return getDateStr(d);
  });
  const [rangeEnd, setRangeEnd] = useState(getDateStr(new Date()));
  const [generating, setGenerating] = useState(false);
  const LUNCH = 30;

  const activeDates = useMemo(() => {
    if (mode === 'week') return getWeekDates(new Date(`${weekBase}T12:00:00`));
    if (rangeStart && rangeEnd && rangeStart <= rangeEnd) {
      return getDatesInRange(rangeStart, rangeEnd);
    }
    return [];
  }, [mode, weekBase, rangeStart, rangeEnd]);

  const weekRanges = useMemo(() => {
    if (mode !== 'range' || !rangeStart || !rangeEnd || rangeStart > rangeEnd) {
      return [];
    }
    return getWeekRanges(rangeStart, rangeEnd);
  }, [mode, rangeStart, rangeEnd]);

  const rangeLogs = logs.filter((l) => activeDates.includes(l.date));

  const summary = useMemo(
    () =>
      staff
        .filter((s) => s.active)
        .map((s) => {
          const sLogs = rangeLogs.filter(
            (l) => l.staff_id === s.id && l.clock_out,
          );
          const gross = sLogs.reduce(
            (a, l) => a + minutesBetween(l.clock_in, l.clock_out),
            0,
          );
          const days = sLogs.length;
          const weekBreakdown = weekRanges.map((w) => {
            const wDates = getDatesInRange(w.start, w.end);
            const wLogs = sLogs.filter((l) => wDates.includes(l.date));
            const wGross = wLogs.reduce(
              (a, l) => a + minutesBetween(l.clock_in, l.clock_out),
              0,
            );
            const wDays = wLogs.length;
            return {
              ...w,
              days: wDays,
              gross: wGross,
              net: Math.max(0, wGross - wDays * LUNCH),
              logs: wLogs,
              dates: wDates,
            };
          });

          return {
            ...s,
            days,
            gross,
            net: Math.max(0, gross - days * LUNCH),
            sLogs,
            weekBreakdown,
          };
        })
        .filter((s) => s.days > 0),
    [rangeLogs, staff, weekRanges],
  );

  const totalNet = summary.reduce((a, s) => a + s.net, 0);
  const totalDays = summary.reduce((a, s) => a + s.days, 0);

  const invalidRange = mode === 'range' && rangeStart > rangeEnd;
  const canGenerate =
    !generating && activeDates.length > 0 && !invalidRange && summary.length > 0;

  const handleDownload = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 50));
    try {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        // eslint-disable-next-line no-alert
        alert('PDF library is not available. Please refresh the page and try again.');
        setGenerating(false);
        return;
      }
      buildPDF(summary, activeDates, weekRanges, mode, rangeStart, rangeEnd, LUNCH);
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(`PDF error: ${e.message}`);
    }
    setGenerating(false);
  };

  const periodLabel =
    activeDates.length > 0
      ? mode === 'week'
        ? `${fmtDate(activeDates[0])} – ${fmtDate(activeDates[6])}`
        : `${fmtDate(activeDates[0])} – ${fmtDate(
            activeDates[activeDates.length - 1],
          )}`
      : null;

  return (
    <div style={{ maxWidth: 720 }}>
      <PageTitle>Download Reports</PageTitle>

      {/* Step 1 — Report type */}
      <StepCard num="1" title="Choose report type">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <ReportTypeCard
            active={mode === 'week'}
            onClick={() => setMode('week')}
            icon="📅"
            title="Single Week"
            desc="Mon – Sun for one specific week"
          />
          <ReportTypeCard
            active={mode === 'range'}
            onClick={() => setMode('range')}
            icon="📆"
            title="Date Range"
            desc="Any start & end date, broken down week by week"
          />
        </div>
      </StepCard>

      {/* Step 2 — Date selection */}
      <StepCard num="2" title="Select dates">
        {mode === 'week' && (
          <div
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'flex-end',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div
                style={{
                  color: '#64748b',
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                Pick any date in the week
              </div>
              <input
                type="date"
                value={weekBase}
                onChange={(e) => setWeekBase(e.target.value)}
                style={{ ...IS, width: 'auto' }}
              />
            </div>
            {activeDates.length > 0 && (
              <div
                style={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  padding: '10px 16px',
                  fontSize: 13,
                  color: '#94a3b8',
                }}
              >
                Week:{' '}
                <b style={{ color: '#f1f5f9' }}>{fmtDate(activeDates[0])}</b> →{' '}
                <b style={{ color: '#f1f5f9' }}>{fmtDate(activeDates[6])}</b>
              </div>
            )}
          </div>
        )}

        {mode === 'range' && (
          <div
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'flex-end',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div
                style={{
                  color: '#64748b',
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                From
              </div>
              <input
                type="date"
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
                style={{ ...IS, width: 'auto' }}
              />
            </div>
            <div
              style={{
                color: '#334155',
                fontSize: 22,
                paddingBottom: 4,
              }}
            >
              →
            </div>
            <div>
              <div
                style={{
                  color: '#64748b',
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                To
              </div>
              <input
                type="date"
                value={rangeEnd}
                max={getDateStr(new Date())}
                onChange={(e) => setRangeEnd(e.target.value)}
                style={{ ...IS, width: 'auto' }}
              />
            </div>
            {invalidRange && (
              <div
                style={{
                  color: '#f87171',
                  fontSize: 13,
                  alignSelf: 'center',
                }}
              >
                ⚠ End date must be after start
              </div>
            )}
            {!invalidRange && activeDates.length > 0 && (
              <div
                style={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  padding: '10px 16px',
                  fontSize: 13,
                  color: '#94a3b8',
                }}
              >
                <b style={{ color: '#60a5fa' }}>{activeDates.length}</b> days &nbsp;·&nbsp;{' '}
                <b style={{ color: '#60a5fa' }}>{weekRanges.length}</b> week
                {weekRanges.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}
      </StepCard>

      {/* Step 3 — Preview & download */}
      <StepCard num="3" title="Preview & download">
        {summary.length === 0 &&
          activeDates.length > 0 &&
          !invalidRange && (
            <div
              style={{
                color: '#64748b',
                fontSize: 13,
                padding: '12px 0',
              }}
            >
              No attendance records found for this period. Try a different date
              range.
            </div>
          )}

        {summary.length > 0 && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))',
                gap: 10,
                marginBottom: 20,
              }}
            >
              <MiniStat
                label="Staff with hours"
                value={summary.length}
                color="#3b82f6"
              />
              <MiniStat
                label="Days worked"
                value={totalDays}
                color="#60a5fa"
              />
              <MiniStat
                label="Total net hours"
                value={fmtHours(totalNet)}
                color="#4ade80"
              />
              <MiniStat
                label="Lunch deducted"
                value={`${totalDays * LUNCH}m`}
                color="#f87171"
              />
              {mode === 'range' && (
                <MiniStat label="Weeks" value={weekRanges.length} color="#a78bfa" />
              )}
            </div>

            <div
              style={{
                background: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: 10,
                marginBottom: 20,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '10px 14px',
                  borderBottom: '1px solid #1e293b',
                  color: '#64748b',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                Staff included in report
              </div>
              {summary.map((s, i) => (
                <div
                  key={s.id}
                  style={{
                    padding: '10px 14px',
                    borderTop: i > 0 ? '1px solid #1e293b' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: '#f1f5f9',
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      {s.name}
                    </span>
                    <span
                      style={{
                        color: '#475569',
                        fontSize: 12,
                        marginLeft: 10,
                      }}
                    >
                      {s.department} · {s.company}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: 14,
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: '#64748b' }}>
                      {s.days} day{s.days !== 1 ? 's' : ''}
                    </span>
                    <span style={{ color: '#94a3b8' }}>
                      {fmtHours(s.gross)} gross
                    </span>
                    <span style={{ color: '#f87171' }}>
                      −{s.days * LUNCH}
                      m
                    </span>
                    <span
                      style={{
                        color: '#4ade80',
                        fontWeight: 600,
                      }}
                    >
                      {fmtHours(s.net)} net
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!canGenerate}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: canGenerate
                  ? 'linear-gradient(135deg,#3b82f6,#6366f1)'
                  : '#1e293b',
                border: canGenerate ? 'none' : '1px solid #334155',
                borderRadius: 12,
                color: canGenerate ? '#fff' : '#475569',
                padding: '14px 28px',
                cursor: canGenerate ? 'pointer' : 'not-allowed',
                fontSize: 15,
                fontWeight: 700,
                transition: 'all 0.2s',
              }}
            >
              {generating ? (
                <>
                  <Spinner /> Building PDF…
                </>
              ) : (
                <>
                  ⬇ Download PDF Report{' '}
                  {periodLabel && (
                    <span
                      style={{
                        fontWeight: 400,
                        fontSize: 13,
                        opacity: 0.8,
                      }}
                    >
                      · {periodLabel}
                    </span>
                  )}
                </>
              )}
            </button>
            <div
              style={{
                color: '#475569',
                fontSize: 12,
                marginTop: 10,
              }}
            >
              Landscape A4 · One page per staff member section · 30 min lunch subtracted
              per day worked
            </div>
          </>
        )}

        {activeDates.length === 0 && (
          <div style={{ color: '#475569', fontSize: 13 }}>
            Select dates above to preview the report.
          </div>
        )}
      </StepCard>
    </div>
  );
};

const StepCard = ({ num, title, children }) => (
  <div
    style={{
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: 14,
      padding: 20,
      marginBottom: 16,
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {num}
      </div>
      <div
        style={{
          color: '#f1f5f9',
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        {title}
      </div>
    </div>
    {children}
  </div>
);

const ReportTypeCard = ({ active, onClick, icon, title, desc }) => (
  <div
    onClick={onClick}
    style={{
      flex: 1,
      minWidth: 180,
      background: active ? '#1e3a5f' : '#0f172a',
      border: `2px solid ${active ? '#3b82f6' : '#1e293b'}`,
      borderRadius: 12,
      padding: '16px 18px',
      cursor: 'pointer',
      transition: 'all 0.15s',
    }}
  >
    <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
    <div
      style={{
        color: active ? '#93c5fd' : '#f1f5f9',
        fontWeight: 700,
        fontSize: 14,
        marginBottom: 4,
      }}
    >
      {title}
    </div>
    <div style={{ color: '#64748b', fontSize: 12 }}>{desc}</div>
  </div>
);

const MiniStat = ({ label, value, color }) => (
  <div
    style={{
      background: '#0f172a',
      border: `1px solid ${color}25`,
      borderRadius: 10,
      padding: '12px 16px',
    }}
  >
    <div style={{ color, fontSize: 20, fontWeight: 800 }}>{value}</div>
    <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>{label}</div>
  </div>
);

const Spinner = () => (
  <span
    style={{
      display: 'inline-block',
      width: 14,
      height: 14,
      border: '2px solid #ffffff40',
      borderTopColor: '#fff',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }}
  >
    <style>
      {`@keyframes spin { to { transform: rotate(360deg); } }`}
    </style>
  </span>
);

// ─── SHARED ───────────────────────────────────────────────────────────────────
const PageTitle = ({ children, style = {} }) => (
  <div
    style={{
      color: '#f1f5f9',
      fontSize: 20,
      fontWeight: 700,
      marginBottom: 20,
      ...style,
    }}
  >
    {children}
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.75)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: 16,
        padding: 28,
        width: 420,
        maxWidth: '92vw',
        maxHeight: '90vh',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div
          style={{
            color: '#f1f5f9',
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          {title}
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            fontSize: 22,
          }}
        >
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>
);

const LI = ({ label, value, onChange, type = 'text' }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>{label}</div>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...IS, width: '100%', boxSizing: 'border-box' }}
    />
  </div>
);

const IS = {
  padding: '11px 14px',
  borderRadius: 9,
  background: '#0f172a',
  border: '1px solid #334155',
  color: '#f1f5f9',
  fontSize: 14,
  outline: 'none',
};

const TD = {
  padding: '11px 14px',
  color: '#94a3b8',
  fontSize: 13,
};

const SB = {
  border: 'none',
  borderRadius: 6,
  color: '#fff',
  padding: '5px 12px',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 600,
};

const PB = {
  background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
  border: 'none',
  borderRadius: 10,
  color: '#fff',
  padding: '10px 20px',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 700,
};

const XB = {
  background: '#1e293b',
  border: '1px solid #334155',
  borderRadius: 10,
  color: '#94a3b8',
  padding: '10px 20px',
  cursor: 'pointer',
  fontSize: 14,
};

