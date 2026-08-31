"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  MessageSquareText,
  Plus,
  ReceiptText,
  Settings2,
  ShieldCheck,
  X,
} from "lucide-react";

type Role = "ADMIN" | "CLIENT" | "SECURITY_PROFESSIONAL";
type NavigationItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
};

type SiteNavigationProps = {
  role: Role | null;
  userName?: string | null;
  signOutAction: () => Promise<void>;
};

function dashboardPath(role: Role) {
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "CLIENT") return "/dashboard/client";
  return "/dashboard/security";
}

function roleLabel(role: Role) {
  if (role === "ADMIN") return "Beheerder";
  if (role === "CLIENT") return "Ondernemer";
  return "ZZP-beveiliger";
}

function navigationFor(role: Role | null): NavigationItem[] {
  if (role === "CLIENT") {
    return [
      { href: "/dashboard/client", label: "Overzicht", icon: LayoutDashboard },
      { href: "/dashboard/client/jobs", label: "Opdrachten", icon: BriefcaseBusiness },
      { href: "/dashboard/client/candidates", label: "Beveiligers zoeken", icon: ShieldCheck },
      { href: "/dashboard/client/favorites", label: "Favorieten", icon: Heart },
      { href: "/dashboard/client/applications", label: "Reacties", icon: ShieldCheck },
      { href: "/dashboard/client/billing", label: "Betalingen", icon: ReceiptText },
      { href: "/messages", label: "Berichten", icon: MessageSquareText },
    ];
  }

  if (role === "SECURITY_PROFESSIONAL") {
    return [
      { href: "/dashboard/security", label: "Overzicht", icon: LayoutDashboard },
      { href: "/jobs", label: "Opdrachten", icon: BriefcaseBusiness },
      { href: "/dashboard/security/invitations", label: "Uitnodigingen", icon: BriefcaseBusiness },
      { href: "/dashboard/security/calendar", label: "Agenda", icon: Settings2 },
      { href: "/messages", label: "Berichten", icon: MessageSquareText },
      { href: "/dashboard/security/connect", label: "Uitbetalingen", icon: ReceiptText },
    ];
  }

  if (role === "ADMIN") {
    return [
      { href: "/dashboard/admin", label: "Overzicht", icon: LayoutDashboard },
      { href: "/jobs", label: "Marketplace", icon: BriefcaseBusiness },
      { href: "/dashboard/admin/reports", label: "Meldingen", icon: ShieldCheck },
      { href: "/messages", label: "Berichten", icon: MessageSquareText },
      { href: "/dashboard/admin/settings", label: "Instellingen", icon: Settings2 },
    ];
  }

  return [
    { href: "/jobs", label: "Open opdrachten", icon: BriefcaseBusiness },
    { href: "/#opdrachtgevers", label: "Voor ondernemers", icon: BriefcaseBusiness },
    { href: "/#beveiligers", label: "Voor ZZP-beveiligers", icon: ShieldCheck },
    { href: "/#hoe-werkt-het", label: "Werkwijze", icon: Settings2 },
  ];
}

function isCurrentPath(pathname: string, href: string) {
  if (href.includes("#")) return false;
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

function NavigationLinks({
  items,
  pathname,
  mobile = false,
  onNavigate,
}: {
  items: NavigationItem[];
  pathname: string;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      {items.map((item) => {
        const Icon = item.icon;
        const current = isCurrentPath(pathname, item.href);
        const className = mobile
          ? `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold ${current ? "bg-[#eff7f3] text-[#08705f]" : "text-[#344145] hover:bg-[#f1f5f2]"}`
          : `rounded-lg px-3 py-2 text-sm font-bold transition-colors ${current ? "bg-[#eff7f3] text-[#08705f]" : "text-[#566267] hover:bg-[#f1f5f2] hover:text-[#172629]"}`;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={current ? "page" : undefined}
            className={className}
          >
            {mobile && <Icon aria-hidden="true" size={18} />}
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function SiteNavigation({ role, userName, signOutAction }: SiteNavigationProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const items = navigationFor(role);
  const audienceRole =
    pathname === "/voor-ondernemers"
      ? "CLIENT"
      : pathname === "/voor-beveiligers"
        ? "SECURITY_PROFESSIONAL"
        : null;
  const loginHref = audienceRole ? `/login?role=${audienceRole}` : "/login";
  const registerHref = audienceRole ? `/register?role=${audienceRole}` : "/register";
  const homeHref = role ? dashboardPath(role) : "/";
  const primaryAction =
    role === "CLIENT"
      ? "/dashboard/client/jobs"
      : role === "SECURITY_PROFESSIONAL"
        ? "/jobs"
        : "/register";
  const primaryActionLabel =
    role === "CLIENT"
      ? "Nieuwe opdracht"
      : role === "SECURITY_PROFESSIONAL"
        ? "Vind opdrachten"
        : "Account maken";
  const profileHref =
    role === "CLIENT"
      ? "/dashboard/client/profile"
      : role === "SECURITY_PROFESSIONAL"
        ? "/dashboard/security/profile"
        : "/dashboard/admin/settings";

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#dce4e1] bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-3 px-5 sm:px-8 lg:px-10">
        <Link
          href={homeHref}
          onClick={closeMenu}
          className="shrink-0 text-lg font-bold text-[#172629] sm:text-xl"
        >
          Security<span className="text-[#e76f51]">Match</span>
        </Link>

        <nav aria-label="Hoofdnavigatie" className="hidden min-w-0 items-center gap-1 xl:flex">
          <NavigationLinks items={items} pathname={pathname} />
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          {role ? (
            <>
              <Link
                href={primaryAction}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#08705f] px-3 text-sm font-bold text-white transition hover:bg-[#065b4d]"
              >
                {role === "CLIENT" ? (
                  <Plus aria-hidden="true" size={16} />
                ) : (
                  <BriefcaseBusiness aria-hidden="true" size={16} />
                )}
                {primaryActionLabel}
              </Link>
              <details className="group relative">
                <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-lg border border-[#d2ddd8] px-3 text-sm font-bold text-[#344145] [&::-webkit-details-marker]:hidden">
                  <span className="max-w-28 truncate">{userName || "Mijn account"}</span>
                  <ChevronDown aria-hidden="true" size={16} />
                </summary>
                <div className="absolute right-0 top-12 w-52 border border-[#dce4e1] bg-white p-2 shadow-lg">
                  <div className="border-b border-[#e5ece8] px-3 py-2">
                    <p className="truncate text-sm font-bold text-[#172629]">
                      {userName || "Mijn account"}
                    </p>
                    <p className="mt-1 text-xs text-[#687670]">{roleLabel(role)}</p>
                  </div>
                  <Link
                    href={profileHref}
                    className="mt-1 block rounded-md px-3 py-2 text-sm font-bold text-[#344145] hover:bg-[#f1f5f2]"
                  >
                    Mijn profiel
                  </Link>
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-bold text-[#9f3627] hover:bg-[#fff1ed]"
                    >
                      <LogOut aria-hidden="true" size={16} />
                      Uitloggen
                    </button>
                  </form>
                </div>
              </details>
            </>
          ) : (
            <>
              <Link
                href={loginHref}
                className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-bold text-[#344145] hover:bg-[#f1f5f2]"
              >
                <LogIn aria-hidden="true" size={16} />
                Inloggen
              </Link>
              <Link
                href={registerHref}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#e76f51] px-4 text-sm font-bold text-white transition hover:bg-[#cf5f45]"
              >
                <Plus aria-hidden="true" size={16} />
                Account maken
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          {role && (
            <Link
              href={primaryAction}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#08705f] text-white"
              aria-label={primaryActionLabel}
              title={primaryActionLabel}
            >
              {role === "CLIENT" ? (
                <Plus aria-hidden="true" size={19} />
              ) : (
                <BriefcaseBusiness aria-hidden="true" size={19} />
              )}
            </Link>
          )}
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#d2ddd8] text-[#344145] hover:bg-[#f1f5f2]"
            aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
            title={menuOpen ? "Menu sluiten" : "Menu openen"}
          >
            {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-navigation" className="border-t border-[#dce4e1] bg-white px-5 py-4 xl:hidden">
          <div className="mx-auto max-w-7xl">
            <nav aria-label="Mobiele hoofdnavigatie" className="grid gap-1">
              <NavigationLinks
                items={items}
                pathname={pathname}
                mobile
                onNavigate={closeMenu}
              />
            </nav>
            <div className="mt-4 border-t border-[#e5ece8] pt-4">
              {role ? (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[#172629]">
                      {userName || "Mijn account"}
                    </p>
                    <p className="mt-1 text-xs text-[#687670]">{roleLabel(role)}</p>
                  </div>
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#ebc7be] text-[#9f3627]"
                      aria-label="Uitloggen"
                      title="Uitloggen"
                    >
                      <LogOut aria-hidden="true" size={18} />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={loginHref}
                    onClick={closeMenu}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d2ddd8] px-3 py-3 text-sm font-bold text-[#344145]"
                  >
                    <LogIn aria-hidden="true" size={16} />
                    Inloggen
                  </Link>
                  <Link
                    href={registerHref}
                    onClick={closeMenu}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e76f51] px-3 py-3 text-sm font-bold text-white"
                  >
                    <Plus aria-hidden="true" size={16} />
                    Account maken
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
