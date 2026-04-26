import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { localStore } from './localStore';

// ─── DEFAULT DATA (seeded into local storage on first run) ────────────────────
const initialStaff = [
  // Imported staff list (company → surname → name)
  { id: '11', name: 'Blaz Maratovic', company: 'Farley', department: '', email: '', active: true, pin: '1011' },
  { id: '12', name: 'Stjepan Maratovic', company: 'Farley', department: '', email: '', active: true, pin: '1012' },
  { id: '13', name: "Paddy O'Connor", company: 'Farley', department: '', email: '', active: true, pin: '1013' },
  { id: '14', name: "Mick O'Brien", company: 'Farley', department: '', email: '', active: true, pin: '1014' },
  { id: '15', name: 'Eddie Guidera', company: 'Farley', department: '', email: '', active: true, pin: '1015' },
  { id: '16', name: "Paul O'Brien", company: 'Farley', department: '', email: '', active: true, pin: '1016' },
  { id: '17', name: 'Daniel Dobrogorski', company: 'Farley', department: '', email: '', active: true, pin: '1017' },
  { id: '18', name: 'Vitali Majura', company: 'Farley', department: '', email: '', active: true, pin: '1018' },
  { id: '19', name: 'Jason Beggs', company: 'Farley', department: '', email: '', active: true, pin: '1019' },
  { id: '20', name: 'Dalibor Barasic', company: 'Farley', department: '', email: '', active: true, pin: '1020' },
  { id: '21', name: 'Mark Lodge', company: 'Farley', department: '', email: '', active: true, pin: '1021' },
  { id: '22', name: 'Martynaz Vitkauskas', company: 'Farley', department: '', email: '', active: true, pin: '1022' },

  { id: '23', name: 'Aljaz Prosenc', company: 'Montpro', department: '', email: '', active: true, pin: '1023' },
  { id: '24', name: 'Sadik Asani', company: 'Montpro', department: '', email: '', active: true, pin: '1024' },
  { id: '25', name: 'Redzep Asani', company: 'Montpro', department: '', email: '', active: true, pin: '1025' },
  { id: '26', name: 'Andrej Benulic', company: 'Montpro', department: '', email: '', active: true, pin: '1026' },
  { id: '27', name: 'Matjaz Koritnik', company: 'Montpro', department: '', email: '', active: true, pin: '1027' },
  { id: '28', name: 'Franc Marvin', company: 'Montpro', department: '', email: '', active: true, pin: '1028' },
  { id: '29', name: 'Borut Siraj', company: 'Montpro', department: '', email: '', active: true, pin: '1029' },
  { id: '30', name: 'Boris Debevec', company: 'Montpro', department: '', email: '', active: true, pin: '1030' },
  { id: '31', name: 'Matjaz Kokot', company: 'Montpro', department: '', email: '', active: true, pin: '1031' },
  { id: '99', name: 'Zoltan Szucs', company: 'Montpro', department: '', email: '', active: true, pin: '' },
  // (leavers removed) Plamen Petrov
  // (leavers removed) Franc Pucko
  { id: '34', name: 'Mario Krizanac', company: 'Montpro', department: '', email: '', active: true, pin: '1034' },
  // (leavers removed) Dejan Kozel
  { id: '36', name: 'Tomislav Radovan', company: 'Montpro', department: '', email: '', active: true, pin: '1036' },
  { id: '37', name: 'Denis Doaga', company: 'Montpro', department: '', email: '', active: true, pin: '1037' },

  { id: '38', name: 'Karl Sheldreck', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1038' },
  { id: '39', name: 'Tony Stephens', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1039' },
  { id: '40', name: 'Karl Lawless', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1040' },
  { id: '41', name: 'Arkadiusz Tolak', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1041' },
  { id: '42', name: 'Piotr Kozlowski', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1042' },
  { id: '43', name: 'Thomas Dowdall', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1043' },
  { id: '44', name: 'Jamie Lawless', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1044' },
  { id: '45', name: 'Keith Gaynor', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1045' },
  { id: '46', name: 'Adrian Walaszewski', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1046' },
  { id: '47', name: 'Wojciech Grabowski', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1047' },
  { id: '48', name: 'Przemyslaw Szymanczak', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1048' },
  { id: '100', name: 'Kavol Grabowski', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '' },
  { id: '101', name: 'Damien Gónolay', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '' },
  { id: '102', name: 'Luke Barrett', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '' },
  { id: '49', name: 'Seamus Dowdall', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1049' },
  { id: '50', name: 'Colin Bolton', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1050' },
  { id: '51', name: 'Keith Core', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1051' },
  { id: '52', name: 'Eric Byrne', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1052' },
  { id: '53', name: 'Alan Clarke', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1053' },
  { id: '54', name: 'Neil Murphy', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1054' },
  { id: '55', name: 'Robert Celinski', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1055' },
  { id: '56', name: 'Brian Dobbyn', company: 'Shadow HVAC', department: '', email: '', active: true, pin: '1056' },

  { id: '57', name: "Jordan O'Neil", company: 'BIS', department: '', email: '', active: true, pin: '1057' },
  { id: '58', name: 'Jaimie Smith', company: 'BIS', department: '', email: '', active: true, pin: '1058' },
  { id: '59', name: 'Callum McDermott', company: 'BIS', department: '', email: '', active: true, pin: '1059' },

  { id: '60', name: 'Patryk Myklasz', company: 'BSS', department: '', email: '', active: true, pin: '1060' },
  { id: '61', name: 'J.P Farrell', company: 'BSS', department: '', email: '', active: true, pin: '1061' },
  { id: '62', name: 'Andriy Degtyar', company: 'BSS', department: '', email: '', active: true, pin: '1062' },
  // (leavers removed) Lukasz Szulczyk
  { id: '64', name: 'Giorgi Tchigitashvli', company: 'BSS', department: '', email: '', active: true, pin: '1064' },
  { id: '65', name: 'Shota Marukashvli', company: 'BSS', department: '', email: '', active: true, pin: '1065' },
  { id: '66', name: 'Artur Palonek', company: 'BSS', department: '', email: '', active: true, pin: '1066' },
  { id: '67', name: 'Andesar Kurti', company: 'BSS', department: '', email: '', active: true, pin: '1067' },
  { id: '68', name: 'Mohammed Sabir', company: 'BSS', department: '', email: '', active: true, pin: '1068' },
  { id: '69', name: 'John Pujins', company: 'BSS', department: '', email: '', active: true, pin: '1069' },
  // (leavers removed) Tony Fox
  { id: '71', name: 'Daniel Bronowicki', company: 'BSS', department: '', email: '', active: true, pin: '1071' },
  { id: '72', name: 'Janis Jursevsris', company: 'BSS', department: '', email: '', active: true, pin: '1072' },
  { id: '73', name: 'Joseph Carribine', company: 'BSS', department: '', email: '', active: true, pin: '1073' },
  { id: '74', name: 'Stephen Nolan', company: 'BSS', department: '', email: '', active: true, pin: '1074' },
  { id: '75', name: 'Hubert Kostecki', company: 'BSS', department: '', email: '', active: true, pin: '1075' },
  { id: '76', name: 'Pawel Burzynski', company: 'BSS', department: '', email: '', active: true, pin: '1076' },
  { id: '77', name: 'Irina Ciobanu', company: 'BSS', department: '', email: '', active: true, pin: '1077' },
  { id: '78', name: 'Anton Kostychencko', company: 'BSS', department: '', email: '', active: true, pin: '1078' },
  { id: '79', name: 'Mark Kelly', company: 'BSS', department: '', email: '', active: true, pin: '1079' },
  { id: '80', name: 'Pavol Brezina', company: 'BSS', department: '', email: '', active: true, pin: '1080' },
  { id: '98', name: 'Levi Kochadze', company: 'BSS', department: '', email: '', active: true, pin: '' },

  { id: '81', name: 'Rafal Gajda', company: 'Troisy', department: '', email: '', active: true, pin: '1081' },
  { id: '82', name: 'Dominik Lagosz', company: 'Troisy', department: '', email: '', active: true, pin: '1082' },
  { id: '83', name: 'Damian Lagosz', company: 'Troisy', department: '', email: '', active: true, pin: '1083' },
  { id: '84', name: 'Piotr Malkowski', company: 'Troisy', department: '', email: '', active: true, pin: '1084' },
  { id: '85', name: 'Adam Jankowski', company: 'Troisy', department: '', email: '', active: true, pin: '1085' },
  { id: '86', name: 'Krzysztof Huc', company: 'Troisy', department: '', email: '', active: true, pin: '1086' },
  { id: '87', name: 'Sebastian Nowak', company: 'Troisy', department: '', email: '', active: true, pin: '1087' },
  { id: '88', name: 'Tomasz Kalinowski', company: 'Troisy', department: '', email: '', active: true, pin: '1088' },
  { id: '89', name: 'Mateusz Grzeskiewicz', company: 'Troisy', department: '', email: '', active: true, pin: '1089' },

  { id: '90', name: 'Adam Menzel', company: 'EMS', department: '', email: '', active: true, pin: '1090' },

  { id: '91', name: 'Ernest Mukula', company: 'C.Real', department: '', email: '', active: true, pin: '1091' },
  { id: '92', name: 'Serge Katandza', company: 'C.Real', department: '', email: '', active: true, pin: '1092' },
  { id: '93', name: 'Christopher Cole', company: 'C.Real', department: '', email: '', active: true, pin: '1093' },
  { id: '94', name: 'Andrew Phiri', company: 'C.Real', department: '', email: '', active: true, pin: '1094' },
  { id: '95', name: 'Ciril Royiz', company: 'C.Real', department: '', email: '', active: true, pin: '1095' },
  { id: '96', name: 'Taiye Ajenipu', company: 'C.Real', department: '', email: '', active: true, pin: '1096' },
  { id: '97', name: 'Thom Mitole', company: 'C.Real', department: '', email: '', active: true, pin: '1097' },
  { id: '103', name: 'Frank Jeffrey', company: 'C.Real', department: '', email: '', active: true, pin: '' },
  { id: '104', name: 'Innoccent Ubiaia', company: 'C.Real', department: '', email: '', active: true, pin: '' },
  { id: '105', name: 'Kieran Conlan', company: 'C.Real', department: '', email: '', active: true, pin: '' },
];

const getDateStr = (d) => {
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const dy = String(d.getDate()).padStart(2, '0');
  return `${yr}-${mo}-${dy}`;
};

const addDaysToDateStr = (dateStr, days) => {
  const d = new Date(`${dateStr}T12:00:00`);
  d.setDate(d.getDate() + days);
  return getDateStr(d);
};

// Ireland bank holiday (Mon 6th Apr 2026) — used for one-off payroll highlight.
const BANK_HOLIDAY_DATE = '2026-04-06';
const BANK_HOLIDAY_NONWORK_MINS = 8 * 60;

const initialLogs = [
  // (demo logs removed)
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
  const seeded = useMemo(
    () =>
      localStore.ensureSeed({
        initialStaff,
        initialLogs,
      }),
    [],
  );
  const [staff, setStaff] = useState(seeded.staff);
  const [logs, setLogs] = useState(seeded.logs);
  const didLoadRef = useRef(false);

  useEffect(() => {
    // React StrictMode runs effects twice in dev; avoid duplicate Supabase calls.
    if (didLoadRef.current) return;
    didLoadRef.current = true;
  }, []);

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

      <div
        style={{
          background: '#0f172a',
          borderBottom: '1px solid #1e293b',
          color: '#94a3b8',
          padding: '8px 24px',
          fontSize: 12,
        }}
      >
        <b style={{ color: '#e2e8f0' }}>Local mode</b> — staff and clock logs are saved on this
        device/browser only.
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
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
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
    setPin('');
    setPinError('');
    setSearch('');
  };

  const handleClock = async (type) => {
    if (!selected) return;
    if (!pin || pin.length !== 4) {
      setPinError('Enter 4-digit PIN.');
      return;
    }
    if (selected.pin && pin !== selected.pin) {
      setPinError('Incorrect PIN.');
      return;
    }

    const nowIso = new Date().toISOString();
    const existing = getTodayLog(selected.id);
    if (type === 'in' && !existing) {
      const nextLogs = localStore.upsertLogByStaffDate({
        staff_id: selected.id,
        date: todayStr2,
        clock_in: nowIso,
        clock_out: null,
        notes: '',
      });
      setLogs(nextLogs);
    } else if (type === 'out' && existing && !existing.clock_out) {
      const nextLogs = localStore.upsertLog({
        ...existing,
        clock_out: nowIso,
      });
      setLogs(nextLogs);
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
    setPin('');
    setPinError('');
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
            <div style={{ marginTop: 12 }}>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setPin(v);
                  setPinError('');
                }}
                placeholder="Enter 4-digit PIN"
                style={{
                  ...IS,
                  textAlign: 'center',
                  letterSpacing: 4,
                  fontSize: 18,
                  maxWidth: 220,
                  margin: '0 auto',
                }}
              />
              {pinError && (
                <div style={{ color: '#f97373', fontSize: 12, marginTop: 6 }}>{pinError}</div>
              )}
            </div>
            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: 16,
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
  const [backupMsg, setBackupMsg] = useState('');
  const [importErr, setImportErr] = useState('');

  const exportBackup = () => {
    const payload = {
      version: 1,
      exported_at: new Date().toISOString(),
      staff,
      logs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeDate = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `clocktrack_backup_${safeDate}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setImportErr('');
    setBackupMsg('Backup downloaded.');
    setTimeout(() => setBackupMsg(''), 2500);
  };

  const importBackupFromFile = async (file) => {
    setBackupMsg('');
    setImportErr('');
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const nextStaff = Array.isArray(parsed?.staff) ? parsed.staff : null;
      const nextLogs = Array.isArray(parsed?.logs) ? parsed.logs : null;
      if (!nextStaff || !nextLogs) {
        throw new Error('Invalid backup format. Expected { staff: [], logs: [] }.');
      }
      localStore.setStaff(nextStaff);
      localStore.setLogs(nextLogs);
      setStaff(nextStaff);
      setLogs(nextLogs);
      setBackupMsg('Backup imported.');
      setTimeout(() => setBackupMsg(''), 2500);
    } catch (e) {
      setImportErr(e?.message || String(e));
    }
  };

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
          ['blank-sheets', '📝 Blank signing sheets'],
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 14,
          }}
        >
          <div style={{ color: '#475569', fontSize: 12 }}>
            Backups are saved as a <b>.json</b> file on your Mac.
            {backupMsg && (
              <span style={{ marginLeft: 10, color: '#4ade80', fontWeight: 700 }}>
                {backupMsg}
              </span>
            )}
            {importErr && (
              <span style={{ marginLeft: 10, color: '#f87171', fontWeight: 700 }}>
                {importErr}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="button" onClick={exportBackup} style={PB}>
              ⬇ Export Backup
            </button>
            <label style={{ ...PB, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              ⬆ Import Backup
              <input
                type="file"
                accept="application/json"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  // allow importing same file twice in a row
                  e.target.value = '';
                  if (!f) return;
                  importBackupFromFile(f);
                }}
              />
            </label>
          </div>
        </div>

        {tab === 'dashboard' && <Dashboard staff={staff} logs={logs} />}
        {tab === 'clock-logs' && (
          <ClockLogsAdmin staff={staff} logs={logs} setLogs={setLogs} />
        )}
        {tab === 'staff' && <StaffAdmin staff={staff} setStaff={setStaff} logs={logs} setLogs={setLogs} />}
        {tab === 'blank-sheets' && <BlankSigningSheets staff={staff} />}
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
  const [showAdd, setShowAdd] = useState(false);
  const [showWeek, setShowWeek] = useState(false);
  const [addVals, setAddVals] = useState({
    staff_id: '',
    work_date: getDateStr(new Date()),
    clock_in: '',
    clock_out: '',
    notes: '',
  });
  const [addError, setAddError] = useState('');
  const [weekBase, setWeekBase] = useState(getDateStr(new Date()));
  const [weekStaffId, setWeekStaffId] = useState('');
  const [weekRows, setWeekRows] = useState(() =>
    getWeekDates(new Date()).map((d) => ({ date: d, clock_in: '', clock_out: '', notes: '' })),
  );
  const [weekError, setWeekError] = useState('');
  const [expandedWeeklyStaffId, setExpandedWeeklyStaffId] = useState('');

  const dayLogs = logs.filter((l) => l.date === dateFilter);
  const weekDatesForFilter = useMemo(
    () => getWeekDates(new Date(`${dateFilter}T12:00:00`)),
    [dateFilter],
  );

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

  const toISO = (dateStr, t) => {
    if (!t) return null;
    const [h, m] = t.split(':').map(Number);
    const d = new Date(`${dateStr}T00:00:00`);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };

  const saveEdit = async () => {
    const next = {
      clock_in: toISO(editLog.date, editVals.clock_in),
      clock_out: toISO(editLog.date, editVals.clock_out) || null,
      notes: editVals.notes,
    };

    const nextLogs = localStore.upsertLog({
      ...editLog,
      clock_in: next.clock_in,
      clock_out: next.clock_out,
      notes: next.notes,
    });
    setLogs(nextLogs);
    setEditLog(null);
  };

  const deleteLog = async (log) => {
    if (window.confirm(`Delete record for ${staff.find((s) => s.id === log.staff_id)?.name}?`)) {
      const nextLogs = localStore.deleteLog(log.id);
      setLogs(nextLogs);
    }
  };

  const openAdd = () => {
    setAddError('');
    setAddVals({
      staff_id: '',
      work_date: dateFilter || getDateStr(new Date()),
      clock_in: '',
      clock_out: '',
      notes: '',
    });
    setShowAdd(true);
  };

  const openWeek = () => {
    setWeekError('');
    const base = dateFilter || getDateStr(new Date());
    setWeekBase(base);
    const dates = getWeekDates(new Date(`${base}T12:00:00`));
    setWeekRows(dates.map((d) => ({ date: d, clock_in: '', clock_out: '', notes: '' })));
    setWeekStaffId('');
    setShowWeek(true);
  };

  /** Active staff grouped by company (for dropdowns + Save & Next order) */
  const activeStaffByCompany = useMemo(() => {
    const by = new Map();
    staff
      .filter((s) => s.active)
      .forEach((s) => {
        const c = (s.company || 'Other').trim() || 'Other';
        if (!by.has(c)) by.set(c, []);
        by.get(c).push(s);
      });
    return [...by.keys()]
      .sort((a, b) => a.localeCompare(b))
      .map((company) => ({
        company,
        staff: by.get(company).sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [staff]);

  const activeStaffSorted = useMemo(
    () => activeStaffByCompany.flatMap((g) => g.staff),
    [activeStaffByCompany],
  );

  const loadWeekForStaff = (sid, baseDateStr) => {
    const dates = getWeekDates(new Date(`${baseDateStr}T12:00:00`));
    const rows = dates.map((d) => {
      const existing = logs.find((l) => l.staff_id === sid && l.date === d);
      return {
        date: d,
        clock_in: existing?.clock_in ? new Date(existing.clock_in).toTimeString().slice(0, 5) : '',
        clock_out: existing?.clock_out ? new Date(existing.clock_out).toTimeString().slice(0, 5) : '',
        notes: existing?.notes || '',
      };
    });
    setWeekRows(rows);
  };

  const saveWeek = (mode = 'stay') => {
    setWeekError('');
    if (!weekStaffId) {
      setWeekError('Choose a staff member.');
      return;
    }

    const dates = getWeekDates(new Date(`${weekBase}T12:00:00`));
    const rows = weekRows.map((r, i) => ({ ...r, date: dates[i] || r.date }));

    // Validate and persist each day where at least IN or OUT is present
    let nextLogs = logs;
    for (const r of rows) {
      const hasAny = Boolean(r.clock_in || r.clock_out || r.notes);
      if (!hasAny) continue;
      if (!r.clock_in) {
        setWeekError(`Clock-in required for ${fmtDate(r.date)} if you enter anything that day.`);
        return;
      }
      const clock_in = toISO(r.date, r.clock_in);
      const clock_out = toISO(r.date, r.clock_out) || null;
      if (clock_out && clock_out < clock_in) {
        setWeekError(`Clock-out must be after clock-in for ${fmtDate(r.date)}.`);
        return;
      }
      nextLogs = localStore.upsertLogByStaffDate({
        staff_id: weekStaffId,
        date: r.date,
        clock_in,
        clock_out,
        notes: r.notes || '',
      });
    }

    setLogs(nextLogs);
    setExpandedWeeklyStaffId(weekStaffId);

    if (mode === 'next') {
      const idx = activeStaffSorted.findIndex((s) => s.id === weekStaffId);
      const next = activeStaffSorted[idx + 1] || activeStaffSorted[0];
      if (next) {
        setWeekStaffId(next.id);
        loadWeekForStaff(next.id, weekBase);
        setExpandedWeeklyStaffId(next.id);
      }
      return;
    }

    setShowWeek(false);
  };

  const saveAdd = () => {
    setAddError('');
    if (!addVals.staff_id) {
      setAddError('Choose a staff member.');
      return;
    }
    if (!addVals.work_date) {
      setAddError('Choose a work date.');
      return;
    }
    if (!addVals.clock_in) {
      setAddError('Clock-in time is required.');
      return;
    }

    const clock_in = toISO(addVals.work_date, addVals.clock_in);
    const clock_out = toISO(addVals.work_date, addVals.clock_out) || null;

    if (clock_out && clock_out < clock_in) {
      setAddError('Clock-out time must be after clock-in time.');
      return;
    }

    const nextLogs = localStore.upsertLogByStaffDate({
      staff_id: addVals.staff_id,
      date: addVals.work_date,
      clock_in,
      clock_out,
      notes: addVals.notes || '',
    });
    setLogs(nextLogs);
    setExpandedWeeklyStaffId(addVals.staff_id);
    setShowAdd(false);
  };

  /** All active saved staff for this week, plus any orphan log-only staff IDs */
  const weeklyByStaff = useMemo(() => {
    const staffById = new Map(staff.map((s) => [s.id, s]));
    const inWeek = logs.filter((l) => weekDatesForFilter.includes(l.date));
    const by = new Map();
    inWeek.forEach((l) => {
      if (!by.has(l.staff_id)) by.set(l.staff_id, []);
      by.get(l.staff_id).push(l);
    });

    const activeIds = new Set(staff.filter((s) => s.active).map((s) => s.id));
    const allIds = new Set([...activeIds, ...by.keys()]);
    const bhApplies = weekDatesForFilter[0] === BANK_HOLIDAY_DATE;

    const items = [...allIds].map((staff_id) => {
      const sLogs = by.get(staff_id) || [];
      const person = staffById.get(staff_id);
      const gross = sLogs.reduce(
        (a, l) => a + (l.clock_out ? minutesBetween(l.clock_in, l.clock_out) : 0),
        0,
      );
      const days = sLogs.filter((l) => l.clock_out).length;
      const net = Math.max(0, gross - days * 30);
      const toFillDays = weekDatesForFilter.filter(
        (d) => !sLogs.some((l) => l.date === d),
      ).length;
      const bhLog = bhApplies ? sLogs.find((l) => l.date === BANK_HOLIDAY_DATE) : null;
      const bhWorkedMins =
        bhLog?.clock_out ? minutesBetween(bhLog.clock_in, bhLog.clock_out) : 0;
      const bankHolidayPayMins = bhApplies
        ? bhWorkedMins > 0
          ? bhWorkedMins // double pay => additional hours equal to hours worked
          : days > 0
            ? BANK_HOLIDAY_NONWORK_MINS // not worked => 8h pay (only if they worked some other day this week)
            : null
        : null;

      return {
        staff_id,
        person,
        sLogs,
        gross,
        net,
        days,
        toFillDays,
        bankHolidayPayMins,
        bhWorkedMins,
      };
    });

    items.sort((a, b) => {
      if (b.toFillDays !== a.toFillDays) return b.toFillDays - a.toFillDays;
      return (a.person?.name || '').localeCompare(b.person?.name || '');
    });

    return items;
  }, [logs, staff, weekDatesForFilter]);

  const weeklyByCompany = useMemo(() => {
    const companyKey = (it) => {
      if (it.person?.company) return (it.person.company || '').trim() || 'Other';
      return 'Other';
    };
    const groups = new Map();
    weeklyByStaff.forEach((it) => {
      const k = companyKey(it);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(it);
    });
    return [...groups.keys()]
      .sort((a, b) => a.localeCompare(b))
      .map((company) => ({ company, items: groups.get(company) }));
  }, [weeklyByStaff]);

  const dayLogsByCompany = useMemo(() => {
    const groups = new Map();
    dayLogs.forEach((log) => {
      const p = staff.find((s) => s.id === log.staff_id);
      const c = (p?.company || 'Other').trim() || 'Other';
      if (!groups.has(c)) groups.set(c, []);
      groups.get(c).push(log);
    });
    return [...groups.keys()]
      .sort((a, b) => a.localeCompare(b))
      .map((company) => ({
        company,
        logs: groups.get(company).sort((a, b) => {
          const na = staff.find((s) => s.id === a.staff_id)?.name || '';
          const nb = staff.find((s) => s.id === b.staff_id)?.name || '';
          return na.localeCompare(nb);
        }),
      }));
  }, [dayLogs, staff]);

  const openAddForDay = (staffId, workDate) => {
    setAddError('');
    setAddVals({
      staff_id: staffId,
      work_date: workDate,
      clock_in: '',
      clock_out: '',
      notes: '',
    });
    setShowAdd(true);
  };

  const openWeekForPerson = (staffId) => {
    setWeekError('');
    const base = dateFilter || getDateStr(new Date());
    setWeekBase(base);
    setWeekStaffId(staffId);
    loadWeekForStaff(staffId, base);
    setShowWeek(true);
  };

  const WeeklyRow = ({ staffId }) => {
    const person = staff.find((s) => s.id === staffId);
    const rows = weekDatesForFilter.map((d) => {
      const l = logs.find((x) => x.staff_id === staffId && x.date === d);
      const gross = l?.clock_out ? minutesBetween(l.clock_in, l.clock_out) : 0;
      const net = l?.clock_out ? Math.max(0, gross - 30) : 0;
      return { date: d, log: l, gross, net };
    });
    const weekGross = rows.reduce((a, r) => a + r.gross, 0);
    const weekDays = rows.filter((r) => r.log?.clock_out).length;
    const weekNet = Math.max(0, weekGross - weekDays * 30);
    const bhApplies = weekDatesForFilter[0] === BANK_HOLIDAY_DATE;
    const bhRow = bhApplies ? rows.find((r) => r.date === BANK_HOLIDAY_DATE) : null;
    const bhWorkedMins = bhRow?.log?.clock_out ? bhRow.gross : 0;
    const bankHolidayPayMins = bhApplies
      ? bhWorkedMins > 0
        ? bhWorkedMins
        : weekDays > 0
          ? BANK_HOLIDAY_NONWORK_MINS
          : null
      : null;

    return (
      <div style={{ padding: 14, borderTop: '1px solid #0f172a' }}>
        <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 10 }}>
          Week totals: <b style={{ color: '#e2e8f0' }}>{fmtHours(weekGross)}</b> gross ·{' '}
          <b style={{ color: '#f87171' }}>{weekDays * 30}m</b> lunch ·{' '}
          <b style={{ color: '#a78bfa' }}>{fmtHours(weekNet)}</b> net
          {bankHolidayPayMins != null && (
            <>
              {' '}
              · <b style={{ color: '#ef4444' }}>Bank Holiday</b>{' '}
              <b style={{ color: '#fecaca' }}>{fmtHours(bankHolidayPayMins)}</b>
            </>
          )}
        </div>
        <div style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr style={{ background: '#0b1220' }}>
                {['Day', 'Date', 'In', 'Out', 'Gross', 'Lunch', 'Net', 'Notes', 'Actions'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 12px',
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
              {rows.map((r) => {
                const dayName = new Date(`${r.date}T00:00:00`).toLocaleDateString('en-IE', {
                  weekday: 'short',
                });
                const hasOut = Boolean(r.log?.clock_out);
                const needsFill = !r.log;
                return (
                  <tr
                    key={r.date}
                    style={{
                      borderTop: '1px solid #111827',
                      background: needsFill ? 'rgba(251, 191, 36, 0.06)' : 'transparent',
                    }}
                  >
                    <td style={TD}>{dayName}</td>
                    <td style={TD}>{fmtDate(r.date)}</td>
                    <td style={TD}>
                      {needsFill ? (
                        <span style={{ color: '#fbbf24', fontSize: 12 }}>To fill</span>
                      ) : (
                        <span style={{ color: '#60a5fa' }}>{fmt(r.log?.clock_in)}</span>
                      )}
                    </td>
                    <td style={TD}>
                      {needsFill ? (
                        <span style={{ color: '#fbbf24', fontSize: 12 }}>—</span>
                      ) : (
                        <span style={{ color: '#4ade80' }}>{fmt(r.log?.clock_out)}</span>
                      )}
                    </td>
                    <td style={TD}>{hasOut ? fmtHours(r.gross) : '—'}</td>
                    <td style={TD}>{hasOut ? '30m' : '—'}</td>
                    <td style={TD}>
                      <span style={{ color: '#a78bfa' }}>{hasOut ? fmtHours(r.net) : '—'}</span>
                    </td>
                    <td style={TD}>
                      <span style={{ color: '#475569', fontSize: 12 }}>{r.log?.notes || ''}</span>
                    </td>
                    <td style={TD}>
                      {r.log ? (
                        <button
                          type="button"
                          onClick={() => openEdit(r.log)}
                          style={{ ...SB, background: '#1d4ed8' }}
                        >
                          Edit
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openAddForDay(staffId, r.date)}
                          style={{ ...SB, background: '#854d0e' }}
                        >
                          Fill
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!person && (
          <div style={{ color: '#f59e0b', fontSize: 12, marginTop: 10 }}>
            This staff member no longer exists, but logs remain.
          </div>
        )}
      </div>
    );
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
        <button
          type="button"
          onClick={() => setDateFilter(getDateStr(new Date()))}
          style={{ ...SB, background: '#0f172a', border: '1px solid #334155' }}
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => setDateFilter((cur) => addDaysToDateStr(cur, -7))}
          style={{ ...SB, background: '#0f172a', border: '1px solid #334155' }}
        >
          ◀ Prev week
        </button>
        <button
          type="button"
          onClick={() => setDateFilter((cur) => addDaysToDateStr(cur, 7))}
          style={{ ...SB, background: '#0f172a', border: '1px solid #334155' }}
        >
          Next week ▶
        </button>
        <button type="button" onClick={openAdd} style={{ ...PB, padding: '9px 14px' }}>
          + Manual Entry
        </button>
        <button type="button" onClick={openWeek} style={{ ...PB, padding: '9px 14px' }}>
          + Week Entry
        </button>
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
            {dayLogsByCompany.map(({ company, logs: groupLogs }) => (
              <Fragment key={company}>
                <tr style={{ background: '#0f172a' }}>
                  <td
                    colSpan={8}
                    style={{
                      padding: '8px 14px',
                      color: '#93c5fd',
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 0.3,
                      borderTop: '1px solid #1e293b',
                    }}
                  >
                    {company}
                  </td>
                </tr>
                {groupLogs.map((log) => {
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
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: 16,
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 14,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '12px 14px',
            background: '#0f172a',
            borderBottom: '1px solid #334155',
            color: '#e2e8f0',
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          Weekly logs (Mon–Sun) for {fmtDate(weekDatesForFilter[0])} → {fmtDate(weekDatesForFilter[6])}
        </div>
        {weeklyByStaff.length === 0 ? (
          <div style={{ padding: 14, color: '#64748b', fontSize: 13 }}>
            Add staff in the Staff tab to see everyone here for the selected week.
          </div>
        ) : (
          weeklyByCompany.map(({ company, items }) => (
            <div key={company}>
              <div
                style={{
                  padding: '10px 14px',
                  background: '#0f172a',
                  borderTop: '1px solid #1e293b',
                  borderBottom: '1px solid #1e293b',
                  color: '#93c5fd',
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 0.4,
                }}
              >
                {company}
              </div>
              {items.map((it) => {
                const open = expandedWeeklyStaffId === it.staff_id;
                return (
                  <div key={it.staff_id} style={{ borderTop: '1px solid #0f172a' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        flexWrap: 'wrap',
                        padding: '8px 14px 0',
                      }}
                    >
                      {it.toFillDays > 0 && (
                        <span
                          style={{
                            fontSize: 11,
                            padding: '2px 8px',
                            borderRadius: 999,
                            background: 'rgba(251, 191, 36, 0.15)',
                            color: '#fbbf24',
                            border: '1px solid rgba(251, 191, 36, 0.35)',
                          }}
                        >
                          {it.toFillDays} day{it.toFillDays !== 1 ? 's' : ''} to fill
                        </span>
                      )}
                      {it.person && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openWeekForPerson(it.staff_id);
                          }}
                          style={{ ...SB, background: '#334155', fontSize: 11 }}
                        >
                          Fill week
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedWeeklyStaffId((cur) => (cur === it.staff_id ? '' : it.staff_id))
                      }
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'transparent',
                        border: 'none',
                        padding: '12px 14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ color: '#93c5fd', fontWeight: 700 }}>
                          {open ? '▾' : '▸'} {it.person?.name || 'Unknown Staff'}
                        </span>
                        <span style={{ color: '#475569', fontSize: 12 }}>
                          {it.person?.department ? it.person.department : ''}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 12, whiteSpace: 'nowrap', alignItems: 'center' }}>
                        <span style={{ color: '#64748b' }}>{it.days} day{it.days !== 1 ? 's' : ''}</span>
                        <span style={{ color: '#94a3b8' }}>{fmtHours(it.gross)} gross</span>
                        <span style={{ color: '#a78bfa', fontWeight: 700 }}>{fmtHours(it.net)} net</span>
                        {it.bankHolidayPayMins != null && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 8,
                              padding: '4px 10px',
                              borderRadius: 999,
                              background: 'rgba(239, 68, 68, 0.12)',
                              border: '1px solid rgba(239, 68, 68, 0.35)',
                              color: '#fecaca',
                              fontWeight: 700,
                            }}
                            title={
                              it.bhWorkedMins > 0
                                ? 'Worked on bank holiday: additional pay equals hours worked'
                                : 'Not worked on bank holiday: 8 hours pay'
                            }
                          >
                            <span style={{ color: '#ef4444', fontWeight: 800 }}>Bank Holiday</span>
                            <span>{fmtHours(it.bankHolidayPayMins)}</span>
                          </span>
                        )}
                      </div>
                    </button>
                    {open && <WeeklyRow staffId={it.staff_id} />}
                  </div>
                );
              })}
            </div>
          ))
        )}
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

      {showAdd && (
        <Modal title="Add Manual Clock Entry" onClose={() => setShowAdd(false)}>
          <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 14 }}>
            Use this for staff who forgot to clock in/out.
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>
              Staff Member *
            </div>
            <select
              value={addVals.staff_id}
              onChange={(e) => setAddVals((p) => ({ ...p, staff_id: e.target.value }))}
              style={{ ...IS, width: '100%', boxSizing: 'border-box' }}
            >
              <option value="">Select staff…</option>
              {activeStaffByCompany.map(({ company, staff: list }) => (
                <optgroup key={company} label={company}>
                  {list.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                      {s.department ? ` · ${s.department}` : ''}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <LI
            label="Work Date *"
            type="date"
            value={addVals.work_date}
            onChange={(v) => setAddVals((p) => ({ ...p, work_date: v }))}
          />
          <LI
            label="Clock In (start) *"
            type="time"
            value={addVals.clock_in}
            onChange={(v) => setAddVals((p) => ({ ...p, clock_in: v }))}
          />
          <LI
            label="Clock Out (finish)"
            type="time"
            value={addVals.clock_out}
            onChange={(v) => setAddVals((p) => ({ ...p, clock_out: v }))}
          />
          <LI
            label="Notes"
            value={addVals.notes}
            onChange={(v) => setAddVals((p) => ({ ...p, notes: v }))}
          />
          {addError && <div style={{ color: '#f87171', fontSize: 13 }}>{addError}</div>}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button type="button" onClick={saveAdd} style={PB}>
              Save Entry
            </button>
            <button type="button" onClick={() => setShowAdd(false)} style={XB}>
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {showWeek && (
        <Modal title="Add Week (Mon–Sun) for Staff" onClose={() => setShowWeek(false)}>
          <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 14 }}>
            Enter a full week for one person, then use <b>Save &amp; Next</b> to move through staff.
          </div>

          <LI
            label="Pick any date in the week"
            type="date"
            value={weekBase}
            onChange={(v) => {
              setWeekBase(v);
              if (weekStaffId) loadWeekForStaff(weekStaffId, v);
              else {
                const dates = getWeekDates(new Date(`${v}T12:00:00`));
                setWeekRows(dates.map((d) => ({ date: d, clock_in: '', clock_out: '', notes: '' })));
              }
            }}
          />

          <div style={{ marginBottom: 14 }}>
            <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>
              Staff Member *
            </div>
            <select
              value={weekStaffId}
              onChange={(e) => {
                const sid = e.target.value;
                setWeekStaffId(sid);
                if (sid) loadWeekForStaff(sid, weekBase);
              }}
              style={{ ...IS, width: '100%', boxSizing: 'border-box' }}
            >
              <option value="">Select staff…</option>
              {activeStaffByCompany.map(({ company, staff: list }) => (
                <optgroup key={company} label={company}>
                  {list.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                      {s.department ? ` · ${s.department}` : ''}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: 10,
              overflow: 'auto',
              marginBottom: 10,
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
              <thead>
                <tr style={{ background: '#0b1220' }}>
                  {['Day', 'Date', 'In', 'Out', 'Notes'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 12px',
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
                {weekRows.map((r, i) => {
                  const dayName = new Date(`${r.date}T00:00:00`).toLocaleDateString('en-IE', {
                    weekday: 'short',
                  });
                  return (
                    <tr key={r.date} style={{ borderTop: '1px solid #111827' }}>
                      <td style={TD}>{dayName}</td>
                      <td style={TD}>{fmtDate(r.date)}</td>
                      <td style={TD}>
                        <input
                          type="time"
                          value={r.clock_in}
                          onChange={(e) =>
                            setWeekRows((prev) =>
                              prev.map((x, xi) => (xi === i ? { ...x, clock_in: e.target.value } : x)),
                            )
                          }
                          style={{ ...IS, padding: '7px 10px', fontSize: 13, width: 110 }}
                        />
                      </td>
                      <td style={TD}>
                        <input
                          type="time"
                          value={r.clock_out}
                          onChange={(e) =>
                            setWeekRows((prev) =>
                              prev.map((x, xi) => (xi === i ? { ...x, clock_out: e.target.value } : x)),
                            )
                          }
                          style={{ ...IS, padding: '7px 10px', fontSize: 13, width: 110 }}
                        />
                      </td>
                      <td style={TD}>
                        <input
                          value={r.notes}
                          onChange={(e) =>
                            setWeekRows((prev) =>
                              prev.map((x, xi) => (xi === i ? { ...x, notes: e.target.value } : x)),
                            )
                          }
                          placeholder="Optional…"
                          style={{ ...IS, padding: '7px 10px', fontSize: 13, width: '100%' }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {weekError && <div style={{ color: '#f87171', fontSize: 13 }}>{weekError}</div>}

          <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <button type="button" onClick={() => saveWeek('stay')} style={PB}>
              Save Week
            </button>
            <button type="button" onClick={() => saveWeek('next')} style={PB}>
              Save &amp; Next
            </button>
            <button type="button" onClick={() => setShowWeek(false)} style={XB}>
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── STAFF ADMIN ──────────────────────────────────────────────────────────────
const StaffAdmin = ({ staff, setStaff, setLogs }) => {
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
      const nextStaff = staff.map((p) => (p.id === editPerson.id ? { ...p, ...form } : p));
      localStore.setStaff(nextStaff);
      setStaff(nextStaff);
    } else {
      const nextStaff = [...staff, { id: `s${Date.now()}`, ...form, pin: '' }];
      localStore.setStaff(nextStaff);
      setStaff(nextStaff);
    }
    setShowForm(false);
  };

  const deleteStaff = (p) => {
    const msg = `Delete ${p.name}?\n\nThis will also delete all of their clock logs. This cannot be undone.`;
    if (!window.confirm(msg)) return;

    const { staff: nextStaff, logs: nextLogs } = localStore.deleteStaff(p.id);
    setStaff(nextStaff);
    setLogs(nextLogs);
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
                  <button
                    type="button"
                    onClick={() => deleteStaff(p)}
                    style={{ ...SB, background: '#7f1d1d', marginLeft: 6 }}
                  >
                    Delete
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
  const ROSTER_W = 56;
  const ROSTER_GAP = 6;
  const CONTENT_X = ML + ROSTER_W + ROSTER_GAP;
  const CONTENT_W = usableW - ROSTER_W - ROSTER_GAP;
  const fixedColWidths = [30, 14, 18, 18, 18, 14, 20];
  const totalFixedWidth = fixedColWidths.reduce((a, b) => a + b, 0);
  const notesWidth = CONTENT_W - totalFixedWidth - 8; // keep extra right margin, but give notes more space
  const CW = [...fixedColWidths, notesWidth];
  const TABLE_W = CONTENT_W; // table stays within margins for equal left/right white space

  let pageNum = 1;

  const addPageNum = () => {
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Page ${pageNum}`, PW - MR, PH - 5, { align: 'right' });
    doc.text(`Generated: ${new Date().toLocaleString('en-IE')}`, ML, PH - 5);
  };

  const rightEdge = CONTENT_X + CONTENT_W - 5; // summary text ends here for cleaner reading

  const drawRoster = (activeIndex = -1) => {
    const top = 26;
    const bottom = PH - 14;

    // Sidebar background
    doc.setFillColor(15, 23, 42);
    doc.rect(ML, top, ROSTER_W, bottom - top, 'F');

    // Sidebar header
    doc.setFillColor(30, 41, 59);
    doc.rect(ML, top, ROSTER_W, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(226, 232, 240);
    doc.text('Staff', ML + 3, top + 5.5);

    // Names
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const listStartY = top + 12;
    const lineH = 5.2;
    const maxLines = Math.floor((bottom - listStartY) / lineH);

    summary.slice(0, maxLines).forEach((s, i) => {
      const y = listStartY + i * lineH;
      const isActive = i === activeIndex;

      if (isActive) {
        doc.setFillColor(30, 58, 95);
        doc.rect(ML + 1.5, y - 3.6, ROSTER_W - 3, 4.6, 'F');
      }

      doc.setTextColor(isActive ? 147 : 148, isActive ? 197 : 163, isActive ? 253 : 184);
      const label = `${i + 1}. ${s.name}`;
      doc.text(label.length > 26 ? `${label.slice(0, 26)}…` : label, ML + 3, y);
    });
  };

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

  const drawWeeklySheet = (title) => {
    // Layout tuned to match the uploaded "Weekly Sign In Sheet" style:
    // rows = staff, columns = company/surname/name + daily IN/OUT + totals.
    const x0 = ML;
    const y0 = 26;
    const bottom = PH - 14;
    const bhApplies = activeDates[0] === BANK_HOLIDAY_DATE;

    const staffCols = [
      { key: 'company', label: 'COMPANY', w: 22 },
      { key: 'surname', label: 'SURNAME', w: 26 },
      { key: 'name', label: 'NAME', w: 22 },
    ];
    const dayBlockW = 16; // IN + OUT (8mm each)
    const inW = 8;
    const outW = 8;
    const totalsCols = [
      { key: 'gross', label: 'Gross', w: 14 },
      { key: 'lunch', label: 'Lunch', w: 10 },
      { key: 'net', label: 'Net Hours', w: 14 },
      { key: 'notes', label: 'Notes', w: 33 },
      ...(bhApplies ? [{ key: 'bankHoliday', label: 'Bank Holiday', w: 16 }] : []),
    ];

    const sheetW =
      staffCols.reduce((a, c) => a + c.w, 0) +
      activeDates.length * dayBlockW +
      totalsCols.reduce((a, c) => a + c.w, 0);

    // Subtle outer border
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.2);
    doc.rect(x0, y0, sheetW, bottom - y0);

    const headerH1 = 10; // top header row (days)
    const headerH2 = 6; // sub header row (in/out)
    const rowH = 6;

    const ordinal = (n) => {
      const j = n % 10;
      const k = n % 100;
      if (j === 1 && k !== 11) return `${n}st`;
      if (j === 2 && k !== 12) return `${n}nd`;
      if (j === 3 && k !== 13) return `${n}rd`;
      return `${n}th`;
    };
    const fmtDayMonth = (dateStr) => {
      const d = new Date(`${dateStr}T00:00:00`);
      const day = ordinal(d.getDate());
      const month = d.toLocaleDateString('en-IE', { month: 'long' });
      return [day, month];
    };
    const getSurname = (fullName) => {
      const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
      return parts.length > 1 ? parts[parts.length - 1] : parts[0] || '';
    };
    const getFirstName = (fullName) => {
      const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
      return parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0] || '';
    };

    const drawGridHeader = (topY) => {
      // Background band
      doc.setFillColor(226, 232, 240);
      doc.rect(x0, topY, sheetW, headerH1 + headerH2, 'F');

      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);

      let x = x0;
      // Fixed columns
      staffCols.forEach((c) => {
        doc.rect(x, topY, c.w, headerH1 + headerH2);
        doc.text(c.label, x + 1.2, topY + 8.2);
        x += c.w;
      });

      // Day blocks
      activeDates.forEach((ds) => {
        doc.rect(x, topY, dayBlockW, headerH1);
        doc.setFontSize(7.5);
        doc.text(fmtDayMonth(ds), x + dayBlockW / 2, topY + 4.2, { align: 'center' });
        doc.setFontSize(7);
        doc.rect(x, topY + headerH1, inW, headerH2);
        doc.rect(x + inW, topY + headerH1, outW, headerH2);
        doc.setFontSize(6.5);
        doc.text('IN', x + 2.2, topY + headerH1 + 4.2);
        doc.text('OUT', x + inW + 1.6, topY + headerH1 + 4.2);
        doc.setFontSize(7);
        x += dayBlockW;
      });

      // Totals columns
      totalsCols.forEach((c) => {
        if (c.key === 'bankHoliday') {
          doc.setFillColor(254, 226, 226); // red-100
          doc.rect(x, topY, c.w, headerH1 + headerH2, 'F');
          doc.rect(x, topY, c.w, headerH1 + headerH2);
          doc.setTextColor(185, 28, 28); // red-700
          doc.text(c.label, x + 1.2, topY + 8.2);
          doc.setTextColor(30, 41, 59);
        } else {
          doc.rect(x, topY, c.w, headerH1 + headerH2);
          doc.text(c.label, x + 1.2, topY + 8.2);
        }
        x += c.w;
      });

      // Grid lines are already drawn via rects; restore text defaults
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      return topY + headerH1 + headerH2;
    };

    let y = y0;
    y = drawGridHeader(y);

    const maxY = bottom - 2;

    const startNewPage = () => {
      addPageNum();
      doc.addPage();
      pageNum += 1;
      drawHeader(title);
      y = y0;
      y = drawGridHeader(y);
    };

    const rows = [...summary].sort((a, b) => {
      const ac = (a.company || '').localeCompare(b.company || '');
      if (ac !== 0) return ac;
      return (a.name || '').localeCompare(b.name || '');
    });

    const companyColor = (companyName) => {
      const key = String(companyName || '').trim().toLowerCase();
      const preset = {
        farley: [254, 243, 199], // amber-100
        montpro: [219, 234, 254], // blue-100
        'shadow hvac': [220, 252, 231], // green-100
        bis: [237, 233, 254], // violet-100
        bss: [255, 228, 230], // rose-100
        troisy: [207, 250, 254], // cyan-100
        ems: [240, 253, 250], // teal-50/100
        'c.real': [255, 237, 213], // orange-100
      };
      if (preset[key]) return preset[key];

      // Deterministic pastel from string hash
      let h = 0;
      for (let i = 0; i < key.length; i += 1) h = (h * 31 + key.charCodeAt(i)) >>> 0;
      const r = 210 + (h % 36);
      const g = 210 + ((h >> 8) % 36);
      const b = 210 + ((h >> 16) % 36);
      return [r, g, b];
    };

    rows.forEach((s) => {
      if (y + rowH > maxY) startNewPage();

      let x = x0;
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.15);

      // Fixed staff columns
      const company = s.company || '';
      const surname = getSurname(s.name);
      const firstname = getFirstName(s.name);

      const staffVals = [company, surname, firstname];
      staffCols.forEach((c, i) => {
        if (i === 0) {
          const [r, g, b] = companyColor(company);
          doc.setFillColor(r, g, b);
          doc.rect(x, y, c.w, rowH, 'F');
        }
        doc.rect(x, y, c.w, rowH);
        doc.setTextColor(30, 41, 59);
        doc.text(String(staffVals[i] || ''), x + 1.2, y + 4.2);
        x += c.w;
      });

      // Day cells (IN/OUT)
      const logsByDate = new Map((s.sLogs || []).map((l) => [l.date, l]));
      let weekGrossMins = 0;
      let weekDays = 0;
      const weekNotes = [];

      activeDates.forEach((ds) => {
        const log = logsByDate.get(ds);
        const hasOut = Boolean(log?.clock_out);
        const gross = hasOut ? minutesBetween(log.clock_in, log.clock_out) : 0;
        if (hasOut) {
          weekGrossMins += gross;
          weekDays += 1;
        }
        if (log?.notes) weekNotes.push(log.notes);

        // IN
        doc.rect(x, y, inW, rowH);
        doc.setTextColor(96, 165, 250);
        doc.text(fmt(log?.clock_in), x + 1.0, y + 4.2);
        // OUT
        doc.rect(x + inW, y, outW, rowH);
        doc.setTextColor(74, 222, 128);
        doc.text(fmt(log?.clock_out), x + inW + 1.0, y + 4.2);

        x += dayBlockW;
      });

      // Totals
      const weekLunch = weekDays * LUNCH;
      const weekNet = Math.max(0, weekGrossMins - weekLunch);
      const notes = Array.from(new Set(weekNotes))
        .join(' / ')
        .slice(0, 70);

      const bhLog = bhApplies ? logsByDate.get(BANK_HOLIDAY_DATE) : null;
      const bhWorkedMins = bhLog?.clock_out ? minutesBetween(bhLog.clock_in, bhLog.clock_out) : 0;
      const bankHolidayPayMins = bhApplies
        ? bhWorkedMins > 0
          ? bhWorkedMins
          : weekDays > 0
            ? BANK_HOLIDAY_NONWORK_MINS
            : null
        : null;

      const totalsVals = [
        fmtHours(weekGrossMins),
        `${weekLunch}m`,
        fmtHours(weekNet),
        notes,
        ...(bhApplies ? [bankHolidayPayMins != null ? fmtHours(bankHolidayPayMins) : ''] : []),
      ];
      totalsCols.forEach((c, i) => {
        doc.rect(x, y, c.w, rowH);
        const isBH = c.key === 'bankHoliday';
        if (isBH) {
          doc.setFillColor(254, 226, 226);
          doc.rect(x, y, c.w, rowH, 'F');
          doc.rect(x, y, c.w, rowH);
          doc.setTextColor(185, 28, 28);
        } else {
          const colorMap = [
            [148, 163, 184], // gross
            [248, 113, 113], // lunch
            [167, 139, 250], // net
            [71, 85, 105], // notes
          ];
          doc.setTextColor(...colorMap[i]);
        }
        doc.text(String(totalsVals[i] || ''), x + 1.2, y + 4.2);
        x += c.w;
      });

      y += rowH;
    });

    addPageNum();
  };

  const drawTableHeader = (y) => {
    doc.setFillColor(226, 232, 240); // light header band
    doc.rect(CONTENT_X, y, TABLE_W, 7, 'F');
    doc.setTextColor(71, 85, 105); // darker header text
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');

    let x = CONTENT_X;
    COLS.forEach((c, i) => {
      doc.text(c, x + 1.5, y + 4.8);
      x += CW[i];
    });

    return y + 7;
  };

  const drawRow = (y, vals, shade, isWeekend) => {
    if (shade) {
      doc.setFillColor(248, 250, 252); // very light alternating row
      doc.rect(CONTENT_X, y, TABLE_W, 6, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);

    let x = CONTENT_X;

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

  const drawStaffHeader = (y, s) => {
    doc.setFillColor(219, 234, 254); // soft blue bar
    doc.rect(CONTENT_X, y, TABLE_W, 8, 'F');
    doc.setFillColor(59, 130, 246); // blue accent strip
    doc.rect(CONTENT_X, y, 2, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42); // dark name text
    doc.text(s.name, CONTENT_X + 5, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // softer subtitle
    const nameGap = 10; // space between name and company · department
    doc.text(
      `${s.company || ''}  ·  ${s.department || ''}`,
      CONTENT_X + 5 + doc.getTextWidth(s.name) + nameGap,
      y + 5.5,
    );

    return y + 10;
  };

  const drawWeekSubHeader = (y, label, wDays, wGross, wNet) => {
    doc.setFillColor(226, 232, 240); // light band
    doc.rect(CONTENT_X, y, TABLE_W, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(37, 99, 235); // blue label
    doc.text(label, CONTENT_X + 3, y + 4.2);

    doc.setTextColor(100, 116, 139); // softer summary
    const s2 = `${wDays} day${wDays !== 1 ? 's' : ''}   Gross: ${fmtHours(
      wGross,
    )}   −${wDays * LUNCH}m   Net: ${fmtHours(wNet)}`;
    doc.text(s2, rightEdge, y + 4.2, { align: 'right' });

    return y + 6;
  };

  const checkPageBreak = (y, needed = 20, rosterIndex = -1, headerTitle = '') => {
    if (y + needed > PH - 12) {
      addPageNum();
      doc.addPage();
      pageNum += 1;
      if (headerTitle) drawHeader(headerTitle);
      drawRoster(rosterIndex);
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

  // Weekly reports use a sign-in sheet layout (all staff on one grid).
  if (mode === 'week') {
    drawHeader(periodLabel);
    drawWeeklySheet(periodLabel);
    const safePeriod =
      activeDates.length > 0
        ? `${activeDates[0]}_to_${activeDates[activeDates.length - 1]}`
        : 'report';
    doc.save(`clocktrack_report_${safePeriod}.pdf`);
    return;
  }

  drawHeader(periodLabel);
  drawRoster(-1);

  let y = 26;

  summary.forEach((s, si) => {
    y = checkPageBreak(y, 30, si, periodLabel);
    drawRoster(si);

    y = drawStaffHeader(y, s);

    if (mode === 'week') {
      y = drawTableHeader(y);
      activeDates.forEach((dateStr, di) => {
        y = checkPageBreak(y, 8, si, periodLabel);
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
      y = checkPageBreak(y, 8, si, periodLabel);
      doc.setFillColor(226, 232, 240);
      doc.rect(CONTENT_X, y, TABLE_W, 6.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(37, 99, 235);
      doc.text(`Net hours (Mon–Sun): ${fmtHours(s.net)}`, CONTENT_X + 3, y + 4.5);
      y += 8;
    } else {
      s.weekBreakdown
        .filter((w) => w.days > 0)
        .forEach((w, wi) => {
          y = checkPageBreak(y, 20, si, periodLabel);
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

            y = checkPageBreak(y, 8, si, periodLabel);
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

      y = checkPageBreak(y, 8, si, periodLabel);
      doc.setFillColor(226, 232, 240); // light total row
      doc.rect(CONTENT_X, y, TABLE_W, 6.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(37, 99, 235); // blue total text
      doc.text(
        `TOTAL for ${s.name}:  ${s.days} days   Gross ${fmtHours(
          s.gross,
        )}   −${s.days * LUNCH}m   Net ${fmtHours(s.net)}`,
        CONTENT_X + 3,
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

// ─── BLANK SIGN-IN SHEETS (one PDF per company) ────────────────────────────────
const companyColor = (company) => {
  const palette = [
    [37, 99, 235], // blue
    [79, 70, 229], // indigo
    [5, 150, 105], // emerald
    [13, 148, 136], // teal
    [147, 51, 234], // purple
    [194, 65, 12], // orange
    [190, 18, 60], // rose
    [2, 132, 199], // sky
  ];
  const s = String(company || '');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
};

const buildBlankSigningSheetPDF = ({ company, people, weekDates }) => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const PW = 297;
  const PH = 210;
  // Tight margins so the grid fills the page.
  const ML = 6;
  const MR = 6;
  const MT = 6;
  const MB = 8;

  const [cr, cg, cb] = companyColor(company);

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const x0 = ML;
  const headerTop = MT;
  const y0 = 38; // table start; leaves room for big centered headings
  const bottom = PH - MB;

  // Bigger, more writable cells.
  const headerH1 = 12; // day/date
  const headerH2 = 8; // IN/OUT labels

  // Compute widths to fill page content width.
  const contentW = PW - ML - MR;
  const nameW = 70;
  // Each day has IN, OUT, and Initials boxes.
  const dayBlockW = (contentW - nameW) / Math.max(1, weekDates.length);
  const inW = dayBlockW / 3;
  const outW = dayBlockW / 3;
  const initW = dayBlockW / 3;
  const tableW = contentW;

  const usableGridH = bottom - y0 - (headerH1 + headerH2);
  const baseRowH = 8;
  const minRowH = 3.5; // smallest that remains writable/printable
  const rowH =
    people.length > 0
      ? Math.max(minRowH, Math.min(baseRowH, usableGridH / people.length))
      : baseRowH;

  const fmtDayMonth = (dateStr) => {
    const d = new Date(`${dateStr}T00:00:00`);
    const day = d.getDate();
    const month = d.toLocaleDateString('en-IE', { month: 'short' });
    return `${day} ${month}`;
  };

  const drawPageHeader = (pageNum) => {
    // Company bar
    doc.setFillColor(cr, cg, cb);
    doc.rect(0, 0, PW, 22, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text(String(company || 'Company').toUpperCase(), PW / 2, 14, { align: 'center' });

    // Title
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('SIGN IN / SIGN OUT SHEET', PW / 2, 33, { align: 'center' });

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(10);
    doc.text(`Page ${pageNum}`, PW - MR, PH - 5, { align: 'right' });
    doc.text(`Generated: ${new Date().toLocaleString('en-IE')}`, ML, PH - 5);
  };

  const drawGridHeader = (topY) => {
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.2);

    // Header band
    doc.setFillColor(241, 245, 249);
    doc.rect(x0, topY, tableW, headerH1 + headerH2, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);

    let x = x0;

    // Name column
    doc.rect(x, topY, nameW, headerH1 + headerH2);
    doc.text('NAME', x + 2.5, topY + 12);
    x += nameW;

    // Days
    weekDates.forEach((ds, i) => {
      doc.rect(x, topY, dayBlockW, headerH1);
      doc.setFontSize(11);
      doc.text([dayNames[i] || '', fmtDayMonth(ds)], x + dayBlockW / 2, topY + 6.0, {
        align: 'center',
      });
      doc.setFontSize(11);
      doc.rect(x, topY + headerH1, inW, headerH2);
      doc.rect(x + inW, topY + headerH1, outW, headerH2);
      doc.rect(x + inW + outW, topY + headerH1, initW, headerH2);
      doc.setFontSize(10.5);
      doc.text('IN', x + 2.4, topY + headerH1 + 6.7);
      doc.text('OUT', x + inW + 2.0, topY + headerH1 + 6.7);
      doc.text('INIT', x + inW + outW + 2.0, topY + headerH1 + 6.7);
      x += dayBlockW;
    });
  };

  const maxRowsPerPage = Math.max(1, Math.floor((bottom - y0 - (headerH1 + headerH2)) / rowH));

  const drawRows = (startIdx, pageNum) => {
    drawPageHeader(pageNum);
    drawGridHeader(y0);

    let y = y0 + headerH1 + headerH2;
    doc.setFont('helvetica', 'normal');
    const baseFont = 14; // larger names for print visibility
    const minFont = 10;
    // scale text slightly when rows are compressed
    const fontSize =
      rowH >= 7.5 ? baseFont : Math.max(minFont, baseFont * (rowH / baseRowH));
    doc.setFontSize(fontSize);
    doc.setTextColor(30, 41, 59);
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.15);

    const slice = people.slice(startIdx, startIdx + maxRowsPerPage);

    slice.forEach((p, ri) => {
      const isAlt = ri % 2 === 1;
      if (isAlt) {
        doc.setFillColor(248, 250, 252);
        doc.rect(x0, y, tableW, rowH, 'F');
      }

      let x = x0;
      // Name cell
      doc.rect(x, y, nameW, rowH);
      doc.text(String(p.name || ''), x + 2, y + rowH * 0.7);
      x += nameW;

      // Day cells (IN/OUT boxes)
      weekDates.forEach(() => {
        doc.rect(x, y, inW, rowH);
        doc.rect(x + inW, y, outW, rowH);
        doc.rect(x + inW + outW, y, initW, rowH);
        x += dayBlockW;
      });
      y += rowH;
    });

    // Outer border
    doc.setLineWidth(0.2);
    doc.rect(x0, y0, tableW, headerH1 + headerH2 + slice.length * rowH);
  };

  // Try to keep each company to a single page if it fits.
  // If it doesn't, fall back to multi-page rather than making it unreadable.
  const totalPages =
    people.length <= maxRowsPerPage ? 1 : Math.ceil(Math.max(1, people.length) / maxRowsPerPage);
  const safeCompany = String(company || 'company')
    .trim()
    .replace(/[^\w]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60);

  for (let p = 0; p < totalPages; p++) {
    if (p > 0) doc.addPage();
    drawRows(p * maxRowsPerPage, p + 1);
  }

  const safePeriod =
    weekDates.length > 0 ? `${weekDates[0]}_to_${weekDates[weekDates.length - 1]}` : 'week';
  doc.save(`clocktrack_blank_signing_sheet_${safeCompany}_${safePeriod}.pdf`);
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
        }),
    [rangeLogs, staff, weekRanges],
  );

  const totalNet = summary.reduce((a, s) => a + s.net, 0);
  const totalDays = summary.reduce((a, s) => a + s.days, 0);

  const invalidRange = mode === 'range' && rangeStart > rangeEnd;
  const canGenerate =
    !generating &&
    activeDates.length > 0 &&
    !invalidRange &&
    staff.some((s) => s.active);

  const handleDownload = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 50));
    try {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        alert('PDF library is not available. Please refresh the page and try again.');
        setGenerating(false);
        return;
      }
      buildPDF(summary, activeDates, weekRanges, mode, rangeStart, rangeEnd, LUNCH);
    } catch (e) {
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
        {activeDates.length > 0 && !invalidRange && summary.length > 0 && totalDays === 0 && (
          <div
            style={{
              color: '#64748b',
              fontSize: 13,
              padding: '12px 0',
            }}
          >
            No attendance records found for this period. You can still download a report with the
            staff list.
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

// ─── A1 WALL POSTER (all companies) ───────────────────────────────────────────
const buildA1WallSigningSheetPDF = ({ companies, peopleByCompany, weekDates }) => {
  const { jsPDF } = window.jspdf;
  // A1 landscape in mm (width x height).
  const PW = 841;
  const PH = 594;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [PW, PH] });

  const ML = 12;
  const MR = 12;
  const MT = 12;
  const MB = 12;

  const contentW = PW - ML - MR;
  const contentH = PH - MT - MB;

  const headerBarH = 20;
  const titleH = 18;
  const topH = headerBarH + titleH;

  const nameW = 120;
  const dayBlockW = (contentW - nameW) / Math.max(1, weekDates.length);
  const inW = dayBlockW / 3;
  const outW = dayBlockW / 3;
  const initW = dayBlockW / 3;

  const headerH1 = 16;
  const headerH2 = 10;
  const sectionTitleH = 12;
  const rowH = 10;
  const gapH = 10;

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fmtDayMonth = (dateStr) => {
    const d = new Date(`${dateStr}T00:00:00`);
    const day = d.getDate();
    const month = d.toLocaleDateString('en-IE', { month: 'short' });
    return `${day} ${month}`;
  };

  let pageNum = 1;
  const drawPageHeader = () => {
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, PW, headerBarH, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(241, 245, 249);
    doc.text('SIGN IN / SIGN OUT SHEET — ALL TRADES', PW / 2, 13.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(15);
    doc.setTextColor(100, 116, 139);
    doc.text(`Week: ${fmtDate(weekDates[0])} → ${fmtDate(weekDates[6])}`, PW / 2, 31, {
      align: 'center',
    });

    doc.setFontSize(12);
    doc.text(`Page ${pageNum}`, PW - MR, PH - 6, { align: 'right' });
  };

  const drawGridHeader = (x0, topY) => {
    const tableW = nameW + weekDates.length * dayBlockW;
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.3);
    doc.setFillColor(241, 245, 249);
    doc.rect(x0, topY, tableW, headerH1 + headerH2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);

    let x = x0;
    doc.rect(x, topY, nameW, headerH1 + headerH2);
    doc.text('NAME', x + 4, topY + 12.8);
    x += nameW;

    weekDates.forEach((ds, i) => {
      doc.rect(x, topY, dayBlockW, headerH1);
      doc.setFontSize(13);
      doc.text([dayNames[i] || '', fmtDayMonth(ds)], x + dayBlockW / 2, topY + 7.0, {
        align: 'center',
      });
      doc.setFontSize(13);
      doc.rect(x, topY + headerH1, inW, headerH2);
      doc.rect(x + inW, topY + headerH1, outW, headerH2);
      doc.rect(x + inW + outW, topY + headerH1, initW, headerH2);
      doc.setFontSize(12);
      doc.text('IN', x + 4, topY + headerH1 + 7.5);
      doc.text('OUT', x + inW + 3.2, topY + headerH1 + 7.5);
      doc.text('INIT', x + inW + outW + 3.2, topY + headerH1 + 7.5);
      x += dayBlockW;
    });
  };

  const newPage = () => {
    if (pageNum > 1) doc.addPage();
    drawPageHeader();
    return MT + topH;
  };

  let y = newPage();
  const x0 = ML;

  for (const company of companies) {
    const people = peopleByCompany.get(company) || [];
    if (people.length === 0) continue;

    const sectionH = sectionTitleH + (headerH1 + headerH2) + people.length * rowH + gapH;
    if (y + sectionH > PH - MB) {
      pageNum += 1;
      y = newPage();
    }

    const [cr, cg, cb] = companyColor(company);
    doc.setFillColor(cr, cg, cb);
    doc.rect(x0, y, contentW, sectionTitleH, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text(String(company || '').toUpperCase(), x0 + 4, y + 8.5);
    doc.setTextColor(226, 232, 240);
    doc.setFontSize(14);
    doc.text(`${people.length} staff`, x0 + contentW - 4, y + 8.5, { align: 'right' });

    y += sectionTitleH;

    drawGridHeader(x0, y);
    y += headerH1 + headerH2;

    // rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16); // larger names for wall visibility
    doc.setTextColor(30, 41, 59);
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.2);

    people.forEach((p, idx) => {
      const isAlt = idx % 2 === 1;
      if (isAlt) {
        doc.setFillColor(248, 250, 252);
        doc.rect(x0, y, contentW, rowH, 'F');
      }

      let x = x0;
      doc.rect(x, y, nameW, rowH);
      doc.text(String(p.name || ''), x + 3, y + rowH * 0.7);
      x += nameW;

      weekDates.forEach(() => {
        doc.rect(x, y, inW, rowH);
        doc.rect(x + inW, y, outW, rowH);
        doc.rect(x + inW + outW, y, initW, rowH);
        x += dayBlockW;
      });

      y += rowH;
    });

    y += gapH;
  }

  doc.save(`clocktrack_a1_wall_signing_sheet_${weekDates[0]}_to_${weekDates[6]}.pdf`);
};

// ─── BLANK SIGNING SHEETS UI ──────────────────────────────────────────────────
const BlankSigningSheets = ({ staff }) => {
  const [weekBase, setWeekBase] = useState(getDateStr(new Date()));
  const [downloading, setDownloading] = useState(false);

  const weekDates = useMemo(() => getWeekDates(new Date(`${weekBase}T12:00:00`)), [weekBase]);

  const companies = useMemo(() => {
    const set = new Set(
      staff
        .filter((s) => s.active)
        .map((s) => String(s.company || '').trim())
        .filter(Boolean),
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [staff]);

  const peopleByCompany = useMemo(() => {
    const by = new Map();
    staff
      .filter((s) => s.active)
      .forEach((s) => {
        const c = String(s.company || '').trim();
        if (!c) return;
        if (!by.has(c)) by.set(c, []);
        by.get(c).push(s);
      });
    for (const [c, arr] of by.entries()) {
      arr.sort((a, b) =>
        String(a.name || '').toLowerCase().localeCompare(String(b.name || '').toLowerCase()),
      );
      by.set(c, arr);
    }
    return by;
  }, [staff]);

  const downloadCompany = async (company) => {
    setDownloading(true);
    await new Promise((r) => setTimeout(r, 50));
    try {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        alert('PDF library is not available. Please refresh the page and try again.');
        setDownloading(false);
        return;
      }
      const people = peopleByCompany.get(company) || [];
      buildBlankSigningSheetPDF({ company, people, weekDates });
    } catch (e) {
      alert(`PDF error: ${e.message}`);
    }
    setDownloading(false);
  };

  const downloadAll = async () => {
    if (companies.length === 0) return;
    setDownloading(true);
    await new Promise((r) => setTimeout(r, 50));
    try {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        alert('PDF library is not available. Please refresh the page and try again.');
        setDownloading(false);
        return;
      }
      for (const company of companies) {
        const people = peopleByCompany.get(company) || [];
        buildBlankSigningSheetPDF({ company, people, weekDates });
        // allow browser a tick between downloads
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 150));
      }
    } catch (e) {
      alert(`PDF error: ${e.message}`);
    }
    setDownloading(false);
  };

  const downloadA1Wall = async () => {
    if (companies.length === 0) return;
    setDownloading(true);
    await new Promise((r) => setTimeout(r, 50));
    try {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        alert('PDF library is not available. Please refresh the page and try again.');
        setDownloading(false);
        return;
      }
      buildA1WallSigningSheetPDF({ companies, peopleByCompany, weekDates });
    } catch (e) {
      alert(`PDF error: ${e.message}`);
    }
    setDownloading(false);
  };

  return (
    <div style={{ maxWidth: 820 }}>
      <PageTitle>Blank signing sheets</PageTitle>
      <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 14 }}>
        Generates a blank Monday–Sunday sign in/out sheet (one PDF per company) for staff to sign
        physically.
      </div>

      <StepCard num="1" title="Pick the week">
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: '#64748b', fontSize: 12, marginBottom: 6 }}>
              Pick any date in the week
            </div>
            <input
              type="date"
              value={weekBase}
              onChange={(e) => setWeekBase(e.target.value)}
              style={{ ...IS, width: 'auto' }}
            />
          </div>
          {weekDates.length > 0 && (
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
              <b style={{ color: '#f1f5f9' }}>{fmtDate(weekDates[0])}</b> →{' '}
              <b style={{ color: '#f1f5f9' }}>{fmtDate(weekDates[6])}</b>
            </div>
          )}
        </div>
      </StepCard>

      <StepCard
        num="2"
        title={`Download PDFs (${companies.length} compan${companies.length === 1 ? 'y' : 'ies'})`}
      >
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
          <button type="button" onClick={downloadAll} style={PB} disabled={downloading}>
            ⬇ Download all companies
          </button>
          <button type="button" onClick={downloadA1Wall} style={PB} disabled={downloading}>
            🧾 Download A1 wall sheet (all trades)
          </button>
          {downloading && (
            <span style={{ color: '#94a3b8', fontSize: 13, alignSelf: 'center' }}>
              Generating PDFs…
            </span>
          )}
        </div>

        {companies.length === 0 ? (
          <div style={{ color: '#94a3b8', fontSize: 13 }}>
            No active staff with a company set. Add a company value in Admin → Staff.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 12,
            }}
          >
            {companies.map((c) => {
              const [r, g, b] = companyColor(c);
              const count = (peopleByCompany.get(c) || []).length;
              return (
                <div
                  key={c}
                  style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: 14,
                    padding: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                        background: `rgb(${r},${g},${b})`,
                      }}
                    />
                    <div style={{ color: '#f1f5f9', fontWeight: 800 }}>{c}</div>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 6 }}>
                    {count} active staff
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <button
                      type="button"
                      onClick={() => downloadCompany(c)}
                      style={PB}
                      disabled={downloading}
                    >
                      ⬇ Download PDF
                    </button>
                  </div>
                </div>
              );
            })}
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

