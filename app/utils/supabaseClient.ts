/* Local browser storage adapter. No external backend is required. */

type StoredUser = {
  id: string;
  email: string;
  email_confirmed_at: string;
};

type Row = Record<string, any>;

const isBrowser = () => typeof window !== "undefined";
const keyFor = (table: string) => `setlist:${table}`;

function readTable(table: string): Row[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(window.localStorage.getItem(keyFor(table)) || "[]");
  } catch {
    return [];
  }
}

function writeTable(table: string, rows: Row[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(keyFor(table), JSON.stringify(rows));
}

function id() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

class QueryBuilder implements PromiseLike<{ data: any; error: any }> {
  private table: string;
  private action: "select" | "insert" | "update" | "delete" = "select";
  private payload: Row | Row[] | null = null;
  private filters: Array<[string, any]> = [];
  private fields = "*";
  private singleMode = false;
  private maybeSingleMode = false;
  private orderField: string | null = null;
  private ascending = true;

  constructor(table: string) {
    this.table = table;
  }

  select(fields = "*") {
    this.fields = fields;
    if (this.action === "insert") return this;
    this.action = "select";
    return this;
  }

  insert(payload: Row | Row[]) {
    this.action = "insert";
    this.payload = payload;
    return this;
  }

  update(payload: Row) {
    this.action = "update";
    this.payload = payload;
    return this;
  }

  delete() {
    this.action = "delete";
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push([field, value]);
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderField = field;
    this.ascending = options?.ascending !== false;
    return this;
  }

  // `.single()` follows the same contract as a single-row database query:
  // a successful result is one record; zero/multiple records are represented
  // by an error. Keeping the successful data type non-null lets TypeScript
  // correctly model callers that have already handled `error`.
  single<T = Row>() {
    this.singleMode = true;
    return this as QueryBuilder & PromiseLike<{ data: T; error: any }>;
  }

  maybeSingle<T = Row>() {
    this.maybeSingleMode = true;
    return this as QueryBuilder & PromiseLike<{ data: T | null; error: any }>;
  }

  then<TResult1 = { data: any; error: any }, TResult2 = never>(
    onfulfilled?: ((value: { data: any; error: any }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve(this.execute()).then(onfulfilled, onrejected);
  }

  private project(row: Row) {
    if (this.fields === "*" || !this.fields) return { ...row };
    const fields = this.fields.split(",").map((field) => field.trim()).filter(Boolean);
    return Object.fromEntries(fields.map((field) => [field, row[field]]));
  }

  private execute(): { data: any; error: any } {
    try {
      let rows = readTable(this.table);

      if (this.action === "insert") {
        const input = Array.isArray(this.payload) ? this.payload : [this.payload];
        const created = input.filter(Boolean).map((item) => ({
          ...item,
          id: item?.id || id(),
          created_at: item?.created_at || new Date().toISOString(),
        }));
        rows = [...rows, ...created];
        writeTable(this.table, rows);
        const result = created.map((row) => this.project(row));
        return { data: this.singleMode ? result[0] || null : result, error: null };
      }

      const matches = (row: Row) => this.filters.every(([field, value]) => row[field] === value);

      if (this.action === "update") {
        const updated: Row[] = [];
        rows = rows.map((row) => {
          if (!matches(row)) return row;
          const next = { ...row, ...(this.payload || {}), updated_at: new Date().toISOString() };
          updated.push(next);
          return next;
        });
        writeTable(this.table, rows);
        const result = updated.map((row) => this.project(row));
        return { data: this.singleMode ? result[0] || null : result, error: null };
      }

      if (this.action === "delete") {
        const removed = rows.filter(matches);
        rows = rows.filter((row) => !matches(row));
        writeTable(this.table, rows);
        return { data: removed.map((row) => this.project(row)), error: null };
      }

      let result = rows.filter(matches);
      if (this.orderField) {
        const field = this.orderField;
        result.sort((a, b) => {
          const av = a[field] ?? "";
          const bv = b[field] ?? "";
          const comparison = av > bv ? 1 : av < bv ? -1 : 0;
          return this.ascending ? comparison : -comparison;
        });
      }
      const projected = result.map((row) => this.project(row));
      if (this.singleMode) {
        return projected.length === 1
          ? { data: projected[0], error: null }
          : { data: null, error: { message: "Expected one record" } };
      }
      if (this.maybeSingleMode) {
        return projected.length <= 1
          ? { data: projected[0] || null, error: null }
          : { data: null, error: { message: "Expected zero or one record" } };
      }
      return { data: projected, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error?.message || "Local storage error" } };
    }
  }
}

const defaultUser = (): StoredUser => ({
  id: "local-artist",
  email: "artist@setlist.local",
  email_confirmed_at: new Date().toISOString(),
});

const auth = {
  async getUser() {
    if (!isBrowser()) return { data: { user: null }, error: null };
    const raw = window.localStorage.getItem("setlist:current-user");
    const user = raw ? JSON.parse(raw) : defaultUser();
    window.localStorage.setItem("setlist:current-user", JSON.stringify(user));
    return { data: { user }, error: null };
  },
  async signOut() {
    if (isBrowser()) window.localStorage.removeItem("setlist:current-user");
    return { error: null };
  },
  async signInWithOAuth(_options: { provider: string; options?: Record<string, any> }) {
    return {
      data: null,
      error: { message: "Google sign-in is unavailable in local workspace mode." },
    };
  },
  onAuthStateChange(callback: (event: string, session: { user: StoredUser } | null) => void) {
    let active = true;
    void auth.getUser().then(({ data }) => {
      if (active) callback(data.user ? "SIGNED_IN" : "SIGNED_OUT", data.user ? { user: data.user } : null);
    });
    return { data: { subscription: { unsubscribe: () => { active = false; } } } };
  },
};

export const supabase = {
  auth,
  from: (table: string) => new QueryBuilder(table),
};
