import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { dutchLocations } from "@/lib/dutch-locations";

const pageSize = 6;
const categories = [
  "Alle types",
  "Objectbeveiliging",
  "Evenementenbeveiliging",
  "Horecabeveiliging",
  "Winkelsurveillance",
  "Bouwplaatsbeveiliging",
  "Receptiebeveiliging",
  "Toegangscontrole",
  "Nachtbeveiliging",
  "Mobiele surveillance",
  "Overig",
];

type SearchParams = Promise<{
  q?: string;
  category?: string;
  city?: string;
  sort?: string;
  page?: string;
}>;

export default async function JobsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session?.user) redirect("/register?role=SECURITY_PROFESSIONAL");
  if (!["CLIENT", "SECURITY_PROFESSIONAL", "ADMIN"].includes(session.user.role)) {
    redirect("/login");
  }
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const category = params.category ?? "";
  const city = params.city?.trim() ?? "";
  const currentPage = Math.max(1, Number(params.page) || 1);
  const where = {
    status: "PUBLISHED" as const,
    ...(category && category !== "Alle types" ? { category } : {}),
    ...(city ? { city: { contains: city, mode: "insensitive" as const } } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as const } },
            { description: { contains: query, mode: "insensitive" as const } },
            { location: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
  const orderBy =
    params.sort === "date"
      ? { startAt: "asc" as const }
      : params.sort === "rate"
        ? { hourlyRateCents: "desc" as const }
        : { publishedAt: "desc" as const };
  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy,
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        title: true,
        category: true,
        location: true,
        city: true,
        startAt: true,
        endAt: true,
        hourlyRateCents: true,
        budgetCents: true,
        negotiable: true,
        description: true,
        languages: true,
        specializations: true,
      },
    }),
    prisma.job.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  function href(page: number) {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (category) next.set("category", category);
    if (city) next.set("city", city);
    if (params.sort) next.set("sort", params.sort);
    next.set("page", String(page));
    return `/jobs?${next.toString()}`;
  }
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="py-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
            Open opdrachten
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-slate-950">
            Vind werk dat bij je past.
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Bekijk actuele beveiligingsopdrachten van opdrachtgevers in
            Nederland.
          </p>
        </header>
        <form
          className="grid gap-3 rounded-xl bg-white p-5 shadow-sm md:grid-cols-[1.5fr_1fr_1fr_auto]"
          method="get"
        >
          <input
            name="q"
            defaultValue={query}
            placeholder="Zoek opdracht, type of plaats"
          />
          <select name="category" defaultValue={category}>
            <option value="">Alle types</option>
            {categories.slice(1).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <div>
            <input
              name="city"
              list="dutch-locations"
              defaultValue={city}
              placeholder="Plaats, dorp of provincie"
            />
            <datalist id="dutch-locations">
              {dutchLocations.map((location) => (
                <option key={location} value={location} />
              ))}
            </datalist>
          </div>
          <button
            className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
            type="submit"
          >
            Zoeken
          </button>
        </form>
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {total} opdracht{total === 1 ? "" : "en"} gevonden
          </p>
          <form method="get">
            <input type="hidden" name="q" value={query} />
            <input type="hidden" name="category" value={category} />
            <input type="hidden" name="city" value={city} />
            <select
              name="sort"
              defaultValue={params.sort ?? "new"}
              aria-label="Sorteer opdrachten"
              className="rounded-lg border border-slate-300 bg-white p-2 text-sm font-semibold"
            >
              <option value="new">Nieuwste eerst</option>
              <option value="date">Startdatum</option>
              <option value="rate">Hoogste uurtarief</option>
            </select>
          </form>
        </div>
        <section className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Link href={`/jobs/${job.id}`} key={job.id} className="rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                  {job.category}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {job.city}
                </span>
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-950">
                {job.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                {job.description}
              </p>
              <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                <div className="flex justify-between gap-3">
                  <dt>Wanneer</dt>
                  <dd className="text-right font-semibold text-slate-900">
                    {job.startAt.toLocaleDateString("nl-NL")} ·{" "}
                    {job.startAt.toLocaleTimeString("nl-NL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Tarief</dt>
                  <dd className="font-semibold text-slate-900">
                    {job.hourlyRateCents
                      ? `€ ${(job.hourlyRateCents / 100).toFixed(2)} / uur`
                      : job.negotiable
                        ? "Bespreekbaar"
                        : "In overleg"}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-xs font-semibold text-slate-500">
                {job.location}
              </p>
            </Link>
          ))}
          {jobs.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-600 md:col-span-2 lg:col-span-3">
              Geen opdrachten gevonden.
            </p>
          )}
        </section>
        <nav
          className="mt-8 flex items-center justify-center gap-2"
          aria-label="Paginering"
        >
          {currentPage > 1 && (
            <Link
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold"
              href={href(currentPage - 1)}
            >
              Vorige
            </Link>
          )}
          <span className="px-3 text-sm font-semibold text-slate-600">
            Pagina {currentPage} van {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold"
              href={href(currentPage + 1)}
            >
              Volgende
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
