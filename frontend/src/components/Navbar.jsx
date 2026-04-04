import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Upload,
  LayoutDashboard,
  Lightbulb,
  Sparkles,
  History,
  Menu,
  X,
  LogOut,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import logoUrl from "../assets/nexus-logo-01.png";
import { useAuth } from "../context/AuthContext";
import { useResume } from "../context/ResumeContext";

const navItems = [
  { to: "/", label: "Home", icon: Zap },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/suggestions", label: "AI Fixes", icon: Lightbulb },
  { to: "/bullet", label: "Bullet Pro", icon: Sparkles },
  { to: "/history", label: "History", icon: History },
  { to: "/recruiter", label: "Recruiter", icon: Users },
];

/* ────────────────────────────────────────────────────────────────
   Exact Watermelon UI "Fluid Tabs" style
   Source: https://registry.watermelon.sh/r/fluid-tabs.json
   Adapted to JSX with NavLink routing
   ──────────────────────────────────────────────────────────────── */
const springTransition = {
  type: "spring",
  stiffness: 280,
  damping: 25,
  mass: 0.8,
};

function WatermelonFluidTabs({ items, location, historyCount }) {
  return (
    <div className="hidden md:flex relative items-center gap-1 rounded-full border-[1.6px] border-[#f5f1ebf4] bg-[#F5F1EB] px-1 py-1 sm:gap-2 dark:border-neutral-800 dark:bg-neutral-900">
      {items.map(({ to, label, icon: Icon }) => {
        const isActive =
          to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
        return (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className="group relative rounded-full px-3 py-2.5 outline-none"
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                transition={springTransition}
                className="absolute inset-0 rounded-full border border-[#fefefe]/90 bg-gradient-to-b from-[#fefefe] to-gray-50/80 shadow-xs dark:border-neutral-600/50 dark:from-neutral-700 dark:to-neutral-800/90"
              />
            )}

            <motion.div
              transition={{ duration: 0.3, ease: "easeOut" }}
              animate={{
                filter: isActive
                  ? ["blur(0px)", "blur(4px)", "blur(0px)"]
                  : "blur(0px)",
              }}
              className={`relative z-10 flex items-center gap-1.5 transition-colors duration-200 ${isActive
                ? "font-bold text-[#292926] dark:text-white"
                : "font-semibold text-[#585652] dark:text-neutral-500 group-hover:text-[#292926] group-hover:dark:text-neutral-300"
                }`}
            >
              <motion.div
                animate={{ scale: isActive ? 1.03 : 1 }}
                transition={{
                  scale: { type: "spring", stiffness: 300, damping: 15 },
                }}
                className="flex shrink-0 items-center justify-center"
              >
                <Icon size={14} />
              </motion.div>
              <span className="text-xs tracking-tight whitespace-nowrap sm:text-sm">
                {label}
              </span>
              {to === "/history" && historyCount > 0 && (
                <span className="relative z-10 min-w-[16px] h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[9px] font-black px-1">
                  {historyCount}
                </span>
              )}
            </motion.div>
          </NavLink>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Main Navbar — composed from Watermelon components
   ──────────────────────────────────────────────────────────────── */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { history } = useResume();

  useEffect(() => {
    if (!dropdownOpen) return;
    const close = () => setDropdownOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [dropdownOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav className="mt-3 glass-card px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <img
              src={logoUrl}
              alt=""
              className="h-8 w-auto max-w-[120px] object-contain object-left shrink-0"
            />
            <span className="font-bold text-base tracking-tight">
              <span className="text-gradient-cyan">Nexus</span>
              <span className="text-nexus-text"> AI</span>
            </span>
          </NavLink>

          {/* Center: Watermelon Fluid Tabs */}
          <WatermelonFluidTabs
            items={navItems}
            location={location}
            historyCount={history?.length || 0}
          />

          {/* Right: Status + User */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-nexus-muted mr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI Online
            </div>

            {/* User */}
            {user ? (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/25 hover:bg-primary/15 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-[#4ade80] flex items-center justify-center text-[#062c11] text-xs font-black">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-sm font-medium text-foreground hidden sm:block max-w-[100px] truncate">
                    {user.name || user.email}
                  </span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-white border border-[#d4d4d4] rounded-2xl shadow-xl p-2 z-50"
                    >
                      <div className="px-3 py-2.5 mb-1 border-b border-[#f0f0f0]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#4ade80] flex items-center justify-center text-[#062c11] font-black text-sm">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#333333] truncate">
                              {user.name || "User"}
                            </p>
                            <p className="text-xs text-[#6e6e6e] truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <NavLink
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-[#333333] hover:bg-[#f5f5f5] rounded-xl transition-colors"
                      >
                        <LayoutDashboard size={14} className="text-[#33cc33]" />
                        Dashboard
                      </NavLink>
                      <NavLink
                        to="/history"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-[#333333] hover:bg-[#f5f5f5] rounded-xl transition-colors"
                      >
                        <History size={14} className="text-[#6e6e6e]" />
                        My History
                      </NavLink>
                      <div className="border-t border-[#f0f0f0] mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <NavLink to="/login" className="btn-primary text-xs py-2 px-4">
                Sign In
              </NavLink>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-2 glass-card px-4 py-3 flex flex-col gap-1 md:hidden"
          >
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </div>
    </header>
  );
}
