type RegistrationAttempt = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: string | null;
  reason: string;
  ipAddress: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  userAgent: string | null;
  createdAt: string;
};

export function RegistrationAttempts({ attempts }: { attempts: RegistrationAttempt[] }) {
  return <section className="mt-10">
    <div className="border-b border-slate-200 pb-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Registratiecontrole</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-950">Mislukte registraties</h2>
      <p className="mt-2 text-sm text-slate-600">Beweeg met je muis over een rode status om direct de reden en extra informatie te zien.</p>
    </div>
    <div className="mt-5 overflow-x-auto border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-[0.1em] text-slate-500"><tr><th className="px-5 py-3">Moment</th><th className="px-5 py-3">Naam en e-mail</th><th className="px-5 py-3">Rol</th><th className="px-5 py-3">Resultaat</th><th className="px-5 py-3">Plaats</th></tr></thead>
        <tbody>
          {attempts.map((attempt) => <tr key={attempt.id} className="border-t border-slate-100 align-top">
            <td className="whitespace-nowrap px-5 py-4 text-slate-600">{new Date(attempt.createdAt).toLocaleString("nl-NL")}</td>
            <td className="px-5 py-4"><p className="font-bold text-slate-950">{[attempt.firstName, attempt.lastName].filter(Boolean).join(" ") || "Niet ingevuld"}</p><p className="mt-1 text-xs text-slate-500">{attempt.email || "Geen e-mail ontvangen"}</p></td>
            <td className="px-5 py-4 text-slate-700">{attempt.role === "CLIENT" ? "Ondernemer" : attempt.role === "SECURITY_PROFESSIONAL" ? "ZZP-beveiliger" : "Onbekend"}</td>
            <td className="px-5 py-4"><div className="group relative inline-block"><span tabIndex={0} className="inline-flex cursor-help rounded-md bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">Mislukt</span><div role="tooltip" className="invisible absolute bottom-full left-0 z-20 mb-2 w-72 border border-slate-200 bg-slate-950 p-4 text-left text-xs text-white opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"><p className="font-bold text-orange-300">Reden</p><p className="mt-1 leading-5">{attempt.reason}</p><p className="mt-3 font-bold text-orange-300">Extra informatie</p><p className="mt-1 leading-5 text-slate-300">IP: {attempt.ipAddress || "Niet beschikbaar"}<br />Locatie: {[attempt.city, attempt.region, attempt.country].filter(Boolean).join(", ") || "Niet beschikbaar"}<br />Browser: {attempt.userAgent || "Niet beschikbaar"}</p></div></div></td>
            <td className="px-5 py-4 text-slate-700">{[attempt.city, attempt.region, attempt.country].filter(Boolean).join(", ") || "Niet beschikbaar"}</td>
          </tr>)}
          {attempts.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-600">Nog geen mislukte registraties geregistreerd.</td></tr>}
        </tbody>
      </table>
    </div>
  </section>;
}