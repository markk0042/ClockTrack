const STAFF_KEY = 'clocktrack.staff.v1';
const LOGS_KEY = 'clocktrack.logs.v1';

const safeParse = (json, fallback) => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

const uid = () => (globalThis.crypto?.randomUUID ? crypto.randomUUID() : `id_${Date.now()}_${Math.random().toString(16).slice(2)}`);

const norm = (v) => String(v || '').trim().toLowerCase().replace(/\s+/g, ' ');

const isStaffLikeArray = (v) =>
  Array.isArray(v) &&
  v.length > 0 &&
  v.every(
    (x) =>
      x &&
      typeof x === 'object' &&
      typeof x.name === 'string' &&
      x.name.trim().length > 0 &&
      // logs don't have name; but some other arrays might — keep heuristics light
      !('date' in x && 'staff_id' in x),
  );

const guessLegacyStaff = () => {
  const candidates = [];
  const preferredKeys = [
    'clocktrack.staff', // v0 guess
    'clocktrack_staff',
    'clocktrackStaff',
    'staff',
    'staffList',
    'clocktrack.staff.v0',
    'clocktrack.staffNames',
  ];

  const pushCandidate = (key) => {
    if (!key || key === STAFF_KEY) return;
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const parsed = safeParse(raw, null);
    if (!isStaffLikeArray(parsed)) return;
    candidates.push({ key, staff: parsed });
  };

  preferredKeys.forEach(pushCandidate);

  // Fallback: scan all keys for a staff-like array payload.
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || k === STAFF_KEY || k === LOGS_KEY) continue;
      // avoid wasting time on obvious non-staff keys
      if (/log/i.test(k)) continue;
      pushCandidate(k);
    }
  } catch {
    // ignore (private mode / blocked storage, etc.)
  }

  if (candidates.length === 0) return null;

  // Prefer the largest list; ties break toward preferred keys.
  const preferredRank = new Map(preferredKeys.map((k, i) => [k, i]));
  candidates.sort((a, b) => {
    if (b.staff.length !== a.staff.length) return b.staff.length - a.staff.length;
    return (preferredRank.get(a.key) ?? 999) - (preferredRank.get(b.key) ?? 999);
  });
  return candidates[0];
};

const mergeStaffUnique = (base, incoming) => {
  const byKey = new Map();
  const makeKey = (p) => `${norm(p.company)}|${norm(p.name)}`;

  base.forEach((p) => byKey.set(makeKey(p), p));
  incoming.forEach((p) => {
    const k = makeKey(p);
    if (!byKey.has(k)) {
      byKey.set(k, {
        id: p.id || uid(),
        name: p.name,
        company: p.company || '',
        department: p.department || '',
        email: p.email || '',
        active: typeof p.active === 'boolean' ? p.active : true,
        pin: p.pin || '',
      });
    }
  });
  return Array.from(byKey.values());
};

const applyLeaversInactive = (staff, leaverNames) => {
  const set = new Set((leaverNames || []).map(norm).filter(Boolean));
  if (set.size === 0) return staff;
  let changed = false;
  const next = staff.map((p) => {
    if (set.has(norm(p.name)) && p.active !== false) {
      changed = true;
      return { ...p, active: false };
    }
    return p;
  });
  return changed ? next : staff;
};

export const localStore = {
  // ---- Staff ----
  getStaff(fallback = []) {
    const raw = localStorage.getItem(STAFF_KEY);
    if (!raw) return fallback;
    const v = safeParse(raw, fallback);
    return Array.isArray(v) ? v : fallback;
  },
  setStaff(staff) {
    localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
  },
  upsertStaff(person) {
    const staff = this.getStaff([]);
    const idx = staff.findIndex((s) => s.id === person.id);
    if (idx >= 0) staff[idx] = { ...staff[idx], ...person };
    else staff.push({ id: uid(), ...person });
    this.setStaff(staff);
    return staff;
  },
  deleteStaff(staffId) {
    const staff = this.getStaff([]).filter((s) => s.id !== staffId);
    this.setStaff(staff);
    // also delete logs
    const logs = this.getLogs([]).filter((l) => l.staff_id !== staffId);
    this.setLogs(logs);
    return { staff, logs };
  },

  // ---- Logs ----
  getLogs(fallback = []) {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) return fallback;
    const v = safeParse(raw, fallback);
    return Array.isArray(v) ? v : fallback;
  },
  setLogs(logs) {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  },
  upsertLog(log) {
    const logs = this.getLogs([]);
    const idx = logs.findIndex((l) => l.id === log.id);
    if (idx >= 0) logs[idx] = { ...logs[idx], ...log };
    else logs.unshift({ id: uid(), ...log });
    this.setLogs(logs);
    return logs;
  },
  upsertLogByStaffDate({ staff_id, date, clock_in, clock_out, notes }) {
    const logs = this.getLogs([]);
    const idx = logs.findIndex((l) => l.staff_id === staff_id && l.date === date);
    if (idx >= 0) {
      logs[idx] = { ...logs[idx], staff_id, date, clock_in, clock_out, notes: notes || '' };
    } else {
      logs.unshift({ id: uid(), staff_id, date, clock_in, clock_out, notes: notes || '' });
    }
    this.setLogs(logs);
    return logs;
  },
  deleteLog(logId) {
    const logs = this.getLogs([]).filter((l) => l.id !== logId);
    this.setLogs(logs);
    return logs;
  },

  // ---- Init / migrate ----
  ensureSeed({ initialStaff = [], initialLogs = [] } = {}) {
    const hasStaff = Boolean(localStorage.getItem(STAFF_KEY));
    const hasLogs = Boolean(localStorage.getItem(LOGS_KEY));
    if (!hasStaff) this.setStaff(initialStaff);
    if (!hasLogs) this.setLogs(initialLogs);

    // Migrate staff forward if an older key was used previously.
    // This fixes "names added last week not visible this week" after a storage key change.
    try {
      const current = this.getStaff(initialStaff);
      const legacy = guessLegacyStaff();
      if (legacy?.staff?.length) {
        const merged = mergeStaffUnique(current, legacy.staff);
        if (merged.length > current.length) {
          this.setStaff(merged);
        }
      }

      // Ensure default staff are present even if storage already existed.
      // This makes newly-added seeded staff (like new starters) appear for everyone.
      const afterLegacy = this.getStaff(initialStaff);
      const withDefaults = mergeStaffUnique(afterLegacy, initialStaff);
      if (withDefaults.length > afterLegacy.length) {
        this.setStaff(withDefaults);
      }

      // Apply leavers list (keeps old logs intact, removes from active views/sheets).
      const leavers = ['Tony Fox', 'Plamen Petrov', 'Franc Pucko', 'Dejan Kozel', 'Lukasz Szulczyk'];
      const afterDefaults = this.getStaff(initialStaff);
      const withLeaversInactive = applyLeaversInactive(afterDefaults, leavers);
      if (withLeaversInactive !== afterDefaults) {
        this.setStaff(withLeaversInactive);
      }
    } catch {
      // ignore
    }

    return { staff: this.getStaff(initialStaff), logs: this.getLogs(initialLogs) };
  },
};

