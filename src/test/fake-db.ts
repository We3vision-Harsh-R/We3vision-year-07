// A small in-memory stand-in for the Prisma client, just enough for the AI integration tests (no real database is touched).
type Row = Record<string, unknown> & { id?: string };

export function createFakeDb() {
  let n = 0;
  const id = () => `c${String(++n).padStart(12, "0")}test`;
  const tables: Record<string, Row[]> = { aiConnection: [], contentSubmission: [], submissionEvent: [], media: [], blogPost: [], careerRole: [], adminUser: [] };
  const matches = (row: Row, where: Row = {}): boolean =>
    Object.entries(where).every(([k, v]) => {
      if (v && typeof v === "object" && !(v instanceof Date)) {
        const o = v as Row;
        if ("equals" in o) return String(row[k] ?? "").toLowerCase() === String(o.equals).toLowerCase();
        if ("contains" in o) return String(row[k] ?? "").toLowerCase().includes(String(o.contains).toLowerCase());
        if (k === "connection") return matches((tables.aiConnection.find((c) => c.id === row.connectionId) ?? {}) as Row, o);
        return true;
      }
      return row[k] === v;
    });
  const model = (name: string, onCreate?: (row: Row, data: Row) => void) => ({
    findUnique: async ({ where, include }: { where: Row; include?: Row }) => {
      const row = tables[name].find((r) => matches(r, where));
      if (row && include?.admin) return { ...row, admin: tables.adminUser.find((a) => a.id === row.adminId) };
      return row ?? null;
    },
    findFirst: async ({ where }: { where?: Row }) => tables[name].find((r) => matches(r, where)) ?? null,
    findMany: async ({ where, take }: { where?: Row; take?: number } = {}) => {
      const rows = tables[name].filter((r) => matches(r, where)).slice().reverse();
      return typeof take === "number" ? rows.slice(0, take) : rows;
    },
    create: async ({ data }: { data: Row }) => {
      const { events, ...rest } = data as Row & { events?: { create: Row } };
      const row: Row = { id: id(), createdAt: new Date(), reviewedAt: null, rejectReason: "", entitySlug: "", entityId: "", ...rest };
      tables[name].push(row);
      onCreate?.(row, data);
      if (events) tables.submissionEvent.push({ id: id(), submissionId: row.id, at: new Date(), note: "", ...events.create });
      return row;
    },
    update: async ({ where, data }: { where: Row; data: Row }) => {
      const row = tables[name].find((r) => matches(r, where));
      if (!row) throw new Error("not found");
      Object.assign(row, data);
      return row;
    },
  });
  return {
    tables,
    db: {
      aiConnection: model("aiConnection"),
      contentSubmission: model("contentSubmission"),
      submissionEvent: model("submissionEvent"),
      media: model("media"),
      blogPost: model("blogPost"),
      careerRole: model("careerRole"),
      adminUser: model("adminUser"),
    },
  };
}
