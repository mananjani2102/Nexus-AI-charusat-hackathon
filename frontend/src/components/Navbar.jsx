import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useState } from "react";
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
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { history } = useResume();
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav className="mt-3 glass-card px-4 py-3 flex items-center justify-between">
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
          <div className="hidden md:flex items-center gap-1 relative">
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive =
                to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
              return (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={`nav-link relative ${isActive ? "active" : ""}`}
                >
                  <Icon size={14} />
                  {label}
                  {to === "/history" && history?.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-primary text-background flex items-center justify-center text-[9px] font-bold absolute -top-1 -right-1">
                      {history.length}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    />
                  )}
                </NavLink>
              );
            })}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-nexus-muted mr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI Online
            </div>

            {user ? (
              <div className="relative">
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
                      {/* User info section */}
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

                      {/* Menu items */}
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
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
        {open && (
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
                onClick={() => setOpen(false)}
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
