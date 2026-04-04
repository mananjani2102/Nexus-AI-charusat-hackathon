import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Copy,
  CheckCheck,
  Loader2,
  RotateCcw,
  ChevronRight,
  Zap,
  Type,
  Wand2,
} from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import ErrorBanner from "../components/ErrorBanner";
import { useResume } from "../context/ResumeContext";
import { improveBullet } from "../services/api";
import { ContextualAIBar } from "../components/Watermelon/ContextualAIBar";
const EXAMPLES = [
  "Worked on the new website front-end.",
  "Helped with customer support tasks.",
  "Maintained the database.",
  "Did some machine learning stuff for the team.",
  "Was responsible for testing the application.",
];
function DiffHighlight({ original, improved }) {
  const origWords = original.toLowerCase().split(/\s+/);
  const impWords = improved.split(/\s+/);
  return (
    <p className="text-sm leading-7 text-nexus-text">
      {impWords.map((word, i) => {
        const isNew = !origWords.includes(
          word.replace(/[^a-z0-9%$]/gi, "").toLowerCase(),
        );
        return (
          <span key={i}>
            <span
              className={
                isNew ? "bg-emerald-500/20 text-emerald-300 px-0.5 rounded" : ""
              }
            >
              {word}
            </span>{" "}
          </span>
        );
      })}
    </p>
  );
}
function CopyBtn({ text }) {
  const [c, setC] = useState(false);
  const go = () => {
    navigator.clipboard.writeText(text);
    setC(true);
    setTimeout(() => setC(false), 2000);
  };
  return (
    <button
      onClick={go}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all
      ${c ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-white/10 bg-white/5 text-nexus-muted hover:text-nexus-text hover:border-white/20"}`}
    >
      {c ? <CheckCheck size={12} /> : <Copy size={12} />}
      {c ? "Copied!" : "Copy"}
    </button>
  );
}
export default function BulletImproverPage() {
  const { jobRole, analysisResult } = useResume();
  const [bullet, setBullet] = useState("");
  const [result, setResult] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState(null);
  const starBullets = analysisResult?.star_bullets || {};
  const preloaded = Object.entries(starBullets).slice(0, 4);
  const improve = async () => {
    if (!bullet.trim()) {
      setError("Please enter a bullet point to improve.");
      return;
    }
    setLocalLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await improveBullet(bullet, jobRole);
      setResult(data);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        "Backend unavailable. Please try again later.",
      );
    } finally {
      setLocalLoading(false);
    }
  };
  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <span className="badge-cyan mb-4 inline-flex">
          <Sparkles size={11} /> STAR Bullet Engine
        </span>
        <h1 className="text-3xl font-black text-nexus-text">
          Bullet <span className="text-gradient-cyan">Improver</span>
        </h1>
        <p className="text-nexus-muted text-sm mt-1">
          Transform vague bullets into STAR-method impact statements with
          quantifiable metrics.
        </p>
      </motion.div>
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="glass-card p-5">
            <label className="block text-sm font-semibold text-nexus-text mb-3">
              Original Bullet Point
            </label>
            <textarea
              value={bullet}
              onChange={(e) => setBullet(e.target.value)}
              placeholder="e.g. Worked on the new website front-end."
              rows={5}
              className="nexus-input resize-none font-mono text-xs leading-relaxed"
            />
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={() => setBullet("")}
                className="btn-ghost text-xs py-1.5"
              >
                <RotateCcw size={12} /> Clear
              </button>
              <span className="text-xs text-nexus-muted">
                {bullet.length} chars
              </span>
            </div>

            <div className="mt-6 flex justify-center">
              <ContextualAIBar
                placeholder="Ask AI to refine this bullet..."
                onSend={(val) => {
                  setBullet(prev => prev + " " + val);
                  improve();
                }}
                tools={[
                  { id: 'shorten', icon: <Zap size={16} /> },
                  { id: 'professional', icon: <Type size={16} /> },
                  { id: 'action', icon: <Wand2 size={16} /> }
                ]}
                onToolClick={(id) => {
                  if (id === 'shorten') setBullet(prev => prev + " (make it concise)");
                  if (id === 'professional') setBullet(prev => prev + " (make it more professional)");
                  if (id === 'action') setBullet(prev => prev + " (add stronger action verbs)");
                  improve();
                }}
              />
            </div>
          </div>
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
          <button
            onClick={improve}
            disabled={localLoading || !bullet.trim()}
            className={`w-full btn-primary justify-center py-4 text-sm ${!bullet.trim() || localLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {localLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Rewriting with
                AI...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Improve This Bullet
              </>
            )}
          </button>
          <div className="glass-card-sm p-4">
            <p className="text-xs font-semibold text-nexus-muted mb-3 uppercase tracking-wide">
              Try an example
            </p>
            <div className="space-y-1.5">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setBullet(ex);
                    setResult(null);
                    setError(null);
                  }}
                  className="w-full text-left text-xs text-nexus-muted hover:text-nexus-text px-3 py-2 rounded-lg hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  <ChevronRight
                    size={11}
                    className="text-nexus-cyan shrink-0"
                  />
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="glass-card p-5 border-emerald-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge-emerald text-[11px]">
                      ✦ AI Enhanced
                    </span>
                    <CopyBtn text={result.improved || ""} />
                  </div>
                  <DiffHighlight
                    original={bullet}
                    improved={result.improved || ""}
                  />
                  <p className="text-[10px] text-nexus-muted mt-3">
                    ↑ Highlighted words are new additions from STAR analysis
                  </p>
                </div>
                <div className="glass-card-sm p-4 opacity-60">
                  <p className="text-[10px] text-nexus-muted mb-2 uppercase tracking-wide font-semibold">
                    Original
                  </p>
                  <p className="text-xs text-nexus-muted leading-relaxed">
                    {bullet}
                  </p>
                </div>
                {result.metrics && (
                  <div className="glass-card-sm p-4">
                    <p className="text-xs font-semibold text-nexus-muted mb-3 uppercase tracking-wide">
                      STAR Analysis
                    </p>
                    {Object.entries(result.metrics).map(([k, v]) => (
                      <div
                        key={k}
                        className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0"
                      >
                        <span className="text-xs text-nexus-muted capitalize">
                          {k}
                        </span>
                        <span className="text-xs text-nexus-text font-medium">
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-8 flex flex-col items-center justify-center text-center h-64 border-dashed"
              >
                <Sparkles size={32} className="text-nexus-muted mb-3" />
                <p className="text-nexus-muted text-sm">
                  Your improved bullet will appear here
                </p>
                <p className="text-nexus-muted/50 text-xs mt-1">
                  Powered by STAR-method AI analysis
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {preloaded.length > 0 && (
            <div className="glass-card-sm p-4">
              <p className="text-xs font-semibold text-nexus-muted mb-3 uppercase tracking-wide">
                From your resume analysis
              </p>
              <div className="space-y-3">
                {preloaded.map(([orig, imp], i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white/3 border border-white/5"
                  >
                    <p className="text-[10px] text-nexus-muted mb-1">
                      Original
                    </p>
                    <p className="text-xs text-nexus-muted line-through opacity-60 mb-2">
                      {orig}
                    </p>
                    <p className="text-[10px] text-emerald-400 mb-1">
                      Improved
                    </p>
                    <p className="text-xs text-nexus-text leading-relaxed">
                      {imp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
}