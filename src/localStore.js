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

/** Sort name tokens so "Kavol Grabowski" and "Grabowski Kavol" dedupe together. */
const nameTokens = (name) =>
  norm(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(' ')
    .filter(Boolean)
    .sort()
    .join(' ');

const staffMergeKey = (p) => `${norm(p.company)}|${nameTokens(p.name)}`;

const isStaffLikeArray = (v) =>
  Array.isArray(v) &&
  v.length > 0 &&
  v.every(
    (x) =>
      x &&
      typeof x === 'object' &&
      typeof x.name === 'string' &&
      x.name.trim().length > 0 &&
      !('date' in x && 'staff_id' in x),
  );

const guessLegacyStaff = () => {
  const candidates = [];
  const preferredKeys = [
    'clocktrack.staff',
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

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || k === STAFF_KEY || k === LOGS_KEY) continue;
      if (/log/i.test(k)) continue;
      pushCandidate(k);
    }
  } catch {
    // ignore
  }

  if (candidates.length === 0) return null;

  const preferredRank = new Map(preferredKeys.map((k, i) => [k, i]));
  candidates.sort((a, b) => {
    if (b.staff.length !== a.staff.length) return b.staff.length - a.staff.length;
    return (preferredRank.get(a.key) ?? 999) - (preferredRank.get(b.key) ?? 999);
  });
  return candidates[0];
};

const staffRecordScore = (p) => {
  let s = 0;
  if (p.pin) s += 10;
  if (/^\d+$/.test(String(p.id || ''))) s += 5;
  if (p.active === true) s += 2;
  return s;
};

/** Dedupe by company + name tokens; keep the best record (pin, numeric id, active). */
export const dedupeStaff = (staff) => {
  const byKey = new Map();
  for (const p of staff) {
    if (!p?.name?.trim()) continue;
    const k = staffMergeKey(p);
    const cur = byKey.get(k);
    if (!cur || staffRecordScore(p) > staffRecordScore(cur)) byKey.set(k, p);
  }
  return Array.from(byKey.values());
};

const LEAVER_NAME_TOKENS = new Set(
  ['Tony Fox', 'Plamen Petrov', 'Franc Pucko', 'Dejan Kozel', 'Lukasz Szulczyk'].map((n) =>
    nameTokens(n),
  ),
);

/** Removed from roster — kept out of Staff and blank signing sheets. */
const REMOVED_STAFF_NAME_TOKENS = new Set(
  [
    'Martin Piotr K',
    'Jason Beggs',
    'Martin Plotnika',
    'Inoccent',
    'Christopher Cole',
    'Thom Mitole',
    'Janis Jursevsris',
    'John Pujins',
    'Callum McDermott',
    'Eric Byrne',
    'Karol G',
    'Gonolagh Damien',
  ].map((n) => nameTokens(n)),
);

/** Typo-only rows (not the full legal name). */
const INOCCENT_TYPO_TOKEN = nameTokens('Inoccent');
const DAMIEN_G_TYPO_TOKEN = nameTokens('Damien G');

const isRemovedStaff = (p) => {
  const t = nameTokens(p?.name);
  if (LEAVER_NAME_TOKENS.has(t) || REMOVED_STAFF_NAME_TOKENS.has(t)) return true;
  if (t === INOCCENT_TYPO_TOKEN || t === DAMIEN_G_TYPO_TOKEN) return true;
  return false;
};

const mergeStaffUnique = (base, incoming) => {
  const byKey = new Map();
  const makeKey = (p) => staffMergeKey(p);

  base.forEach((p) => byKey.set(makeKey(p), p));
  incoming.forEach((p) => {
    const k = makeKey(p);
    if (!byKey.has(k)) {
      byKey.set(k, {
        id: p.id || uid(),
        name: String(p.name || '').trim(),
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

export const localStore = {
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
    const logs = this.getLogs([]).filter((l) => l.staff_id !== staffId);
    this.setLogs(logs);
    return { staff, logs };
  },

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

  ensureSeed({ initialStaff = [], initialLogs = [] } = {}) {
    const hasStaff = Boolean(localStorage.getItem(STAFF_KEY));
    const hasLogs = Boolean(localStorage.getItem(LOGS_KEY));
    if (!hasStaff) this.setStaff(initialStaff);
    if (!hasLogs) this.setLogs(initialLogs);

    try {
      // One-time legacy recovery (never re-merge old keys on every load).
      const LEGACY_DONE = 'clocktrack.legacyStaffMerged.v1';
      if (!localStorage.getItem(LEGACY_DONE)) {
        const current = this.getStaff(initialStaff);
        const legacy = guessLegacyStaff();
        if (legacy?.staff?.length) {
          const merged = mergeStaffUnique(current, legacy.staff);
          if (merged.length > current.length) this.setStaff(merged);
        }
        localStorage.setItem(LEGACY_DONE, '1');
      }

      // One-time: dedupe saved roster & drop known leavers (fixes 115+ duplicate rows).
      const DEDUPED = 'clocktrack.dedupeStaffRoster.v1';
      if (!localStorage.getItem(DEDUPED)) {
        const cur = this.getStaff(initialStaff);
        const deduped = dedupeStaff(cur).filter((p) => !isRemovedStaff(p));
        if (deduped.length !== cur.length) this.setStaff(deduped);
        localStorage.setItem(DEDUPED, '1');
      }

      // One-time: add new companies from built-in seed (DNW, Mor-Air) without full roster re-merge.
      const NEW_COMPANIES_MERGED = 'clocktrack.mergedNewCompanies.v1';
      if (!localStorage.getItem(NEW_COMPANIES_MERGED)) {
        const newCompanyKeys = new Set(['dnw', 'mor-air']);
        const toAdd = initialStaff.filter((p) => newCompanyKeys.has(norm(p.company)));
        if (toAdd.length) {
          const cur = this.getStaff(initialStaff);
          const merged = mergeStaffUnique(cur, toAdd);
          if (merged.length > cur.length) this.setStaff(merged);
        }
        localStorage.setItem(NEW_COMPANIES_MERGED, '1');
      }

      // One-time: apply roster removals + Farley/BIS additions from May 2026 update.
      const ROSTER_UPDATE = 'clocktrack.rosterUpdateMay2026.v1';
      if (!localStorage.getItem(ROSTER_UPDATE)) {
        const cur = this.getStaff(initialStaff).filter((p) => !isRemovedStaff(p));
        const merged = mergeStaffUnique(cur, initialStaff);
        const cleaned = dedupeStaff(merged).filter((p) => !isRemovedStaff(p));
        this.setStaff(cleaned);
        localStorage.setItem(ROSTER_UPDATE, '1');
      }

      const RESTORE_UBIAIA = 'clocktrack.restoreInnoccentUbiaia.v1';
      if (!localStorage.getItem(RESTORE_UBIAIA)) {
        const ubiaia = initialStaff.find((p) => nameTokens(p.name) === nameTokens('Innoccent Ubiaia'));
        if (ubiaia) {
          const cur = this.getStaff(initialStaff);
          const merged = mergeStaffUnique(cur, [ubiaia]);
          if (merged.length > cur.length) this.setStaff(merged);
        }
        localStorage.setItem(RESTORE_UBIAIA, '1');
      }

      // Move Zolthan S (and legacy Zoltan Szucs duplicate) from BSS → Montpro.
      const MOVE_ZOLTHAN = 'clocktrack.moveZolthanToMontpro.v1';
      if (!localStorage.getItem(MOVE_ZOLTHAN)) {
        const zolthanTok = nameTokens('Zolthan S');
        const zoltanTok = nameTokens('Zoltan Szucs');
        const zolthanSeed = initialStaff.find((p) => nameTokens(p.name) === zolthanTok);
        let cur = this.getStaff(initialStaff).filter(
          (p) => nameTokens(p.name) !== zolthanTok && nameTokens(p.name) !== zoltanTok,
        );
        if (zolthanSeed) cur = mergeStaffUnique(cur, [zolthanSeed]);
        this.setStaff(cur);
        localStorage.setItem(MOVE_ZOLTHAN, '1');
      }

      const REMOVE_SHADOW = 'clocktrack.removeEricKarolDamien.v1';
      if (!localStorage.getItem(REMOVE_SHADOW)) {
        const cur = this.getStaff(initialStaff).filter((p) => !isRemovedStaff(p));
        this.setStaff(cur);
        localStorage.setItem(REMOVE_SHADOW, '1');
      }

      const RESTORE_DAMIEN = 'clocktrack.restoreDamienGonolay.v1';
      if (!localStorage.getItem(RESTORE_DAMIEN)) {
        const damien = initialStaff.find((p) => nameTokens(p.name) === nameTokens('Damien Gónolay'));
        if (damien) {
          const cur = this.getStaff(initialStaff);
          const merged = mergeStaffUnique(cur, [damien]);
          if (merged.length > cur.length) this.setStaff(merged);
        }
        localStorage.setItem(RESTORE_DAMIEN, '1');
      }
    } catch {
      // ignore
    }

    return { staff: this.getStaff(initialStaff), logs: this.getLogs(initialLogs) };
  },

  cleanupStaff(staff) {
    return dedupeStaff(staff).filter((p) => !isRemovedStaff(p));
  },

  applyStaffCleanup() {
    const cleaned = this.cleanupStaff(this.getStaff([]));
    this.setStaff(cleaned);
    return cleaned;
  },

  /** Reload saved staff only — does not re-inject the built-in seed list. */
  refreshStaff({ initialStaff = [], initialLogs = [] } = {}) {
    this.ensureSeed({ initialStaff, initialLogs });
    return this.getStaff(initialStaff);
  },

  /** Optional: merge any missing people from the built-in seed (Admin button). */
  mergeSeedStaff(initialStaff = []) {
    const after = this.getStaff(initialStaff);
    const merged = mergeStaffUnique(after, initialStaff);
    if (merged.length > after.length) this.setStaff(merged);
    return this.getStaff(initialStaff);
  },
};
