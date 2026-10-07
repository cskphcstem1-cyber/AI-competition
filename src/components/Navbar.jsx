import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLang } from "../contexts/LangContext";
import LoginModal from "./LoginModal";
import DailyLoginModal from "./DailyLoginModal";
import ParentEmailModal from "./ParentEmailModal";

const pill =
  "inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-ink shadow-sm transition hover:border-brand hover:text-brand-dark sm:px-4 sm:py-1.5 sm:text-sm";

export default function Navbar() {
  const { user, logout, loading, isAdmin } = useAuth();
  const { t, toggleLang } = useLang();
  const [showLogin, setShowLogin] = useState(false);
  const [showParentEmail, setShowParentEmail] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isPythonChapter = pathname.startsWith("/python/chapter-");
  const isScratchChapter = pathname.startsWith("/scratch/chapter/");
  const isScratchCatalog = pathname === "/scratch/chapters";
  const isMathSubPage = pathname.startsWith("/math/");
  const isEngineeringSub = pathname.startsWith("/engineering/");
  const isScienceHub = pathname === "/science";
  const isScienceSub = pathname.startsWith("/science/");
  const isStemHub = pathname === "/stem" || pathname.startsWith("/stem/");
  const logoOnly = isScienceHub || isScienceSub;
  const showChaptersButton =
    !logoOnly &&
    (isPythonChapter || isScratchChapter || isMathSubPage || isScratchCatalog);
  const chaptersPath = isMathSubPage
    ? "/math"
    : isScratchChapter || isScratchCatalog
      ? "/scratch/chapters"
      : "/python/chapters";
  const showScienceBack = !logoOnly && isScienceSub;
  const showEngineeringBack = !logoOnly && isEngineeringSub;
  const showStem = pathname !== "/" && !isStemHub;
  const hasContextLinks =
    showStem || showChaptersButton || showScienceBack || showEngineeringBack;
  const showHamburger = hasContextLinks || Boolean(user);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const contextLinks = (
    <>
      {showStem && (
        <Link to="/stem" className={pill} onClick={() => setMenuOpen(false)}>
          STEM
        </Link>
      )}
      {showChaptersButton && (
        <Link
          to={chaptersPath}
          className={pill}
          onClick={() => setMenuOpen(false)}
        >
          {t.nav.chapters}
        </Link>
      )}
      {showScienceBack && (
        <Link to="/science" className={pill} onClick={() => setMenuOpen(false)}>
          {t.nav.science}
        </Link>
      )}
      {showEngineeringBack && (
        <Link
          to="/engineering"
          className={pill}
          onClick={() => setMenuOpen(false)}
        >
          {t.nav.engineering}
        </Link>
      )}
    </>
  );

  return (
    <>
      <header className="theme-surface-light sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-12 w-full max-w-[1600px] items-center justify-between gap-2 px-2 sm:h-14 sm:px-4 lg:px-5">
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
            <Link to="/" className="group flex min-w-0 items-center gap-1.5 sm:gap-2.5">
              <img
                src="/logo.png"
                alt="CSK PHC STEM Lab"
                className="h-8 w-8 shrink-0 object-contain transition group-hover:scale-105 sm:h-11 sm:w-11"
              />
              <div className="min-w-0 leading-tight">
                <span className="block truncate text-base font-bold tracking-tight text-ink sm:text-lg">
                  Code<span className="text-brand">Kids</span>
                </span>
                <span className="hidden font-mono text-[10px] font-bold uppercase tracking-wider text-muted sm:block">
                  STEM Lab
                </span>
              </div>
            </Link>
            <nav className="hidden items-center gap-2 md:flex">{contextLinks}</nav>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <button
              type="button"
              onClick={toggleLang}
              className={pill}
            >
              {t.langBtn}
            </button>
            {!logoOnly &&
              !loading &&
              (user ? (
                <>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt=""
                        className="h-7 w-7 rounded-full ring-2 ring-brand-tag sm:h-8 sm:w-8"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white ring-2 ring-brand-tag sm:h-8 sm:w-8 sm:text-xs">
                        {(user.displayName || user.email || "?")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                    <span className="hidden max-w-[10rem] truncate text-sm font-semibold text-muted lg:inline">
                      {t.nav.hello(
                        user.displayName || user.email?.split("@")[0],
                      )}
                    </span>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="hidden rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-sm font-bold text-brand-dark transition hover:border-brand hover:bg-brand/20 md:inline-flex"
                    >
                      {t.nav.admin}
                    </Link>
                  )}
                  {!isAdmin && (
                    <button
                      type="button"
                      onClick={() => setShowParentEmail(true)}
                      className={`hidden md:inline-flex ${pill}`}
                    >
                      {t.nav.parentEmail}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => logout()}
                    className={`hidden md:inline-flex ${pill} hover:border-coral hover:text-coral`}
                  >
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowLogin(true)}
                  className="rounded-full bg-lab px-3 py-1 text-xs font-bold text-white shadow-sm transition hover:bg-ink sm:px-5 sm:py-1.5 sm:text-sm"
                >
                  {t.nav.login}
                </button>
              ))}
            {showHamburger && (
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-ink shadow-sm md:hidden"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? t.nav.closeMenu : t.nav.menu}
                onClick={() => setMenuOpen((open) => !open)}
              >
                {menuOpen ? (
                  <span className="text-lg leading-none">×</span>
                ) : (
                  <span className="flex flex-col gap-0.5" aria-hidden="true">
                    <span className="block h-0.5 w-3.5 rounded-full bg-ink" />
                    <span className="block h-0.5 w-3.5 rounded-full bg-ink" />
                    <span className="block h-0.5 w-3.5 rounded-full bg-ink" />
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {menuOpen && showHamburger && (
          <div className="border-t border-slate-200/80 bg-white/95 px-3 py-3 md:hidden">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">{contextLinks}</div>
              {user && !logoOnly && (
                <div className="flex flex-col gap-2 border-t border-slate-100 pt-2">
                  <p className="truncate px-1 text-sm font-semibold text-muted">
                    {t.nav.hello(user.displayName || user.email?.split("@")[0])}
                  </p>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-center text-sm font-bold text-brand-dark"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t.nav.admin}
                    </Link>
                  )}
                  {!isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setShowParentEmail(true);
                      }}
                      className={`${pill} w-full justify-center py-2`}
                    >
                      {t.nav.parentEmail}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className={`${pill} w-full justify-center py-2 hover:border-coral hover:text-coral`}
                  >
                    {t.nav.logout}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      {user && !isAdmin && (
        <ParentEmailModal
          open={showParentEmail}
          onClose={() => setShowParentEmail(false)}
        />
      )}
      {user && !isAdmin && <DailyLoginModal />}
    </>
  );
}
