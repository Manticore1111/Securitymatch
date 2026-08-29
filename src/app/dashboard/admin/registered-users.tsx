type RegisteredUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "CLIENT" | "SECURITY_PROFESSIONAL";
  status: string;
  createdAt: string;
};

function statusClass(status: string) {
  if (status === "ACTIVE" || status === "APPROVED" || status === "VERIFIED") return "bg-emerald-50 text-emerald-700";
  if (status === "REJECTED") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-800";
}

export function RegisteredUsers({ users }: { users: RegisteredUser[] }) {
  const groups = [
    { role: "CLIENT" as const, title: "Ondernemers", empty: "Nog geen ondernemers geregistreerd." },
    { role: "SECURITY_PROFESSIONAL" as const, title: "ZZP-beveiligers", empty: "Nog geen ZZP-beveiligers geregistreerd." },
  ];

  return <section className="mx-auto mt-10 max-w-7xl px-5 sm:px-8"><div className="border-b border-slate-200 pb-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Registraties</p><h2 className="mt-2 text-2xl font-bold text-slate-950">Ondernemers en ZZP-beveiligers</h2><p className="mt-2 text-sm text-slate-600">Bekijk wie zich heeft geregistreerd en wat de huidige accountstatus is.</p></div><div className="mt-5 grid gap-5 lg:grid-cols-2">{groups.map((group) => { const groupUsers = users.filter((user) => user.role === group.role); return <section key={group.role} aria-labelledby={`${group.role}-title`} className="border border-slate-200 bg-white"><div className="border-b border-slate-200 bg-slate-50 px-5 py-4"><h3 id={`${group.role}-title`} className="font-bold text-slate-950">{group.title} ({groupUsers.length})</h3></div>{groupUsers.length > 0 ? groupUsers.map((user) => <article key={user.id} className="border-b border-slate-100 p-5 last:border-b-0"><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start"><div><p className="font-bold text-slate-950">{user.firstName} {user.lastName}</p><p className="mt-1 text-sm text-slate-600">{user.email}</p></div><span className={`w-fit rounded-md px-2.5 py-1 text-xs font-bold ${statusClass(user.status)}`}>{user.status}</span></div><p className="mt-3 text-xs text-slate-500">Geregistreerd op {new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium" }).format(new Date(user.createdAt))}</p></article>) : <p className="p-5 text-sm text-slate-600">{group.empty}</p>}</section>; })}</div></section>;
}
