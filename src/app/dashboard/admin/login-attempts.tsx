type LoginAttempt = {
  id: string;
  identifier: string;
  successful: boolean;
  ipAddress: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  userAgent: string | null;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string } | null;
};

export function LoginAttempts({ attempts }: { attempts: LoginAttempt[] }) {
  return (
    <section className="mt-10">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Beveiliging</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Inlogpogingen</h2>
        <p className="mt-2 text-sm text-slate-600">Recente succesvolle en mislukte pogingen met de beschikbare locatiegegevens.</p>
      </div>
      <div className="mt-5 overflow-x-auto border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
            <tr>
              <th className="px-5 py-3">Moment</th>
              <th className="px-5 py-3">Gebruiker</th>
              <th className="px-5 py-3">Resultaat</th>
              <th className="px-5 py-3">Stad</th>
              <th className="px-5 py-3">IP-adres</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt.id} className="border-t border-slate-100 align-top">
                <td className="whitespace-nowrap px-5 py-4 text-slate-600">{new Date(attempt.createdAt).toLocaleString("nl-NL")}</td>
                <td className="px-5 py-4"><p className="font-bold text-slate-950">{attempt.user ? `${attempt.user.firstName} ${attempt.user.lastName}` : "Onbekend account"}</p><p className="mt-1 text-xs text-slate-500">{attempt.identifier}</p></td>
                <td className="px-5 py-4"><span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${attempt.successful ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{attempt.successful ? "Geslaagd" : "Mislukt"}</span></td>
                <td className="px-5 py-4 text-slate-700">{[attempt.city, attempt.region, attempt.country].filter(Boolean).join(", ") || "Niet beschikbaar"}</td>
                <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-slate-600">{attempt.ipAddress || "Niet beschikbaar"}</td>
              </tr>
            ))}
            {attempts.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-600">Nog geen inlogpogingen geregistreerd.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}