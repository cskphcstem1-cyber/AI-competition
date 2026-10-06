import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLang } from "../contexts/LangContext";
import LoginModal from "./LoginModal";
import DailyLoginModal from "./DailyLoginModal";
import ParentEmailModal from "./ParentEmailModal";

export default function Navbar() {
  const { user, logout, loading, isAdmin } = useAuth();
  const { t, toggleLang } = useLang();
  const [showLogin, setShowLogin] = useState(false);
  const [showParentEmail, setShowParentEmail] = useState(false);
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

  return (
    <>
      <header className="theme-surface-light sticky top-0 z-40 flex h-14 items-center border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-full w-full max-w-[1600px] items-center justify-between px-4 lg:px-5">
          <div className="flex h-full items-center gap-2 sm:gap-3">
            <Link to="/" className="group flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="CSK PHC STEM Lab"
                className="h-11 w-11 object-contain transition group-hover:scale-105"
              />
              <div className="leading-tight">
                <span className="block text-lg font-bold tracking-tight text-ink">
                  Code<span className="text-brand">Kids</span>
                </span>
                <span className="hidden font-mono text-[10px] font-bold uppercase tracking-wider text-muted sm:block">
                  STEM Lab
                </span>
              </div>
            </Link>
            {pathname !== "/" && !isStemHub && (
              <Link
                to="/stem"
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-bold text-ink shadow-sm transition hover:border-brand hover:text-brand-dark"
              >
                STEM
              </Link>
            )}
            {showChaptersButton && (
              <Link
                to={chaptersPath}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-ink shadow-sm transition hover:border-brand hover:text-brand-dark"
              >
                {t.nav.chapters}
              </Link>
            )}
            {showScienceBack && (
              <Link
                to="/science"
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-ink shadow-sm transition hover:border-brand hover:text-brand-dark"
              >
                {t.nav.science}
              </Link>
            )}
            {showEngineeringBack && (
              <Link
                to="/engineering"
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-ink shadow-sm transition hover:border-brand hover:text-brand-dark"
              >
                {t.nav.engineering}
              </Link>
            )}
          </div>

          <div className="flex h-full items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleLang}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-ink shadow-sm transition hover:border-brand hover:text-brand-dark"
            >
              {t.langBtn}
            </button>
            {!logoOnly &&
              !loading &&
              (user ? (
                <>
                  <div className="flex h-full items-center gap-2">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt=""
                        className="h-8 w-8 rounded-full ring-2 ring-brand-tag"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white ring-2 ring-brand-tag">
                        {(user.displayName || user.email || "?")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                    <span className="hidden text-sm font-semibold text-muted sm:inline">
                      {t.nav.hello(
                        user.displayName || user.email?.split("@")[0],
                      )}
                    </span>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="rounded-full border border-brand/30 bg-brand/10 px-5 py-2 text-base font-bold text-brand-dark transition hover:border-brand hover:bg-brand/20"
                    >
                      {t.nav.admin}
                    </Link>
                  )}
                  {!isAdmin && (
                    <button
                      type="button"
                      onClick={() => setShowParentEmail(true)}
                      className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-ink shadow-sm transition hover:border-brand hover:text-brand-dark"
                    >
                      {t.nav.parentEmail}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-semibold text-muted transition hover:border-coral hover:text-coral"
                  >
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowLogin(true)}
                  className="rounded-full bg-lab px-5 py-1.5 text-sm font-bold text-white shadow-sm transition hover:bg-ink"
                >
                  {t.nav.login}
                </button>
              ))}
          </div>
        </div>
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
