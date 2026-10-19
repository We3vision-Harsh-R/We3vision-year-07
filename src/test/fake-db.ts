// A small in-memory stand-in for the Prisma client, just enough for the AI integration tests (no real database is touched).
// It understands the few query shapes the code uses: equality, null, { equals | contains (insensitive) | gt | lt }, OR, and the relation
// filter `connection: { adminId }` of ContentSubmission.
type Row = Record<string, unknown> & { id?: string };

export function createFakeDb() {
  let n = 0;
  const id = () => `c${String(++n).padStart(12, "0")}test`;
  const names = ["aiConnection", "contentSubmission", "submissionEvent", "media", "blogPost", "careerRole", "adminUser", "oauthClient", "oauthCode"] as const;
  const tables = Object.fromEntries(names.map((t) => [t, [] as Row[]])) as Record<(typeof names)[number], Row[]>;

  const matches = (row: Row, where: Row = {}): boolean =>
    Object.entries(where).every(([k, v]) => {
      if (k === "OR") return (v as Row[]).some((w) => matches(row, w));
      if (v === null) return row[k] === null || row[k] === undefined;
      if (v instanceof Date) return (row[k] as Date | undefined)?.getTime() === v.getTime();
      if (typeof v === "object") {
        const o = v as Row;
        if ("equals" in o) return String(row[k] ?? "").toLowerCase() === String(o.equals).toLowerCase();
        if ("contains" in o) return String(row[k] ?? "").toLowerCase().includes(String(o.contains).toLowerCase());
        if ("gt" in o) return row[k] instanceof Date && row[k] > (o.gt as Date);
        if ("lt" in o) return row[k] instanceof Date && row[k] < (o.lt as Date);
        if (k === "connection") return matches((tables.aiConnection.find((c) => c.id === row.connectionId) ?? {}) as Row, o);
        return true;
      }
      return row[k] === v;
    });

  const model = (name: (typeof names)[number]) => ({
    findUnique: async ({ where, include }: { where: Row; include?: Row }) => {
      const row = tables[name].find((r) => matches(r, where));
      if (row && include?.admin) return { ...row, admin: tables.adminUser.find((a) => a.id === row.adminId) };
      return row ?? null;
    },
    findFirst: async ({ where }: { where?: Row } = {}) => tables[name].find((r) => matches(r, where)) ?? null,
    findMany: async ({ where, take }: { where?: Row; take?: number } = {}) => {
      const rows = tables[name].filter((r) => matches(r, where)).slice().reverse();
      return typeof take === "number" ? rows.slice(0, take) : rows;
    },
    count: async ({ where }: { where?: Row } = {}) => tables[name].filter((r) => matches(r, where)).length,
    create: async ({ data }: { data: Row }) => {
      const { events, ...rest } = data as Row & { events?: { create: Row } };
      const row: Row = { id: id(), createdAt: new Date(), reviewedAt: null, rejectReason: "", entitySlug: "", entityId: "", usedAt: null, revokedAt: null, lastUsedAt: null, refreshHash: null, accessExpiresAt: null, expiresAt: null, ...rest };
      tables[name].push(row);
      if (events) tables.submissionEvent.push({ id: id(), submissionId: row.id, at: new Date(), note: "", ...events.create });
      return row;
    },
    update: async ({ where, data }: { where: Row; data: Row }) => {
      const row = tables[name].find((r) => matches(r, where));
      if (!row) throw new Error("not found");
      Object.assign(row, data);
      return row;
    },
    updateMany: async ({ where, data }: { where?: Row; data: Row }) => {
      const rows = tables[name].filter((r) => matches(r, where));
      rows.forEach((r) => Object.assign(r, data));
      return { count: rows.length };
    },
    delete: async ({ where }: { where: Row }) => {
      const i = tables[name].findIndex((r) => matches(r, where));
      if (i < 0) throw new Error("not found");
      return tables[name].splice(i, 1)[0];
    },
    deleteMany: async ({ where }: { where?: Row } = {}) => {
      const keep = tables[name].filter((r) => !matches(r, where));
      const count = tables[name].length - keep.length;
      tables[name].splice(0, tables[name].length, ...keep);
      return { count };
    },
  });

  return { tables, db: Object.fromEntries(names.map((t) => [t, model(t)])) as Record<(typeof names)[number], ReturnType<typeof model>> };
}
