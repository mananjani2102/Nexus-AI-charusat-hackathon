import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  Loader2,
  ShieldCheck,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import ErrorBanner from "../components/ErrorBanner";
import { useResume } from "../context/ResumeContext";
import { analyzeResume } from "../services/api";
const JOB_ROLES = [
  "Software Engineer",
  "Senior Software Engineer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Product Manager",
  "UX Designer",
  "Data Analyst",
  "Cloud Architect",
  "Cybersecurity Analyst",
  "Mobile Developer",
  "QA Engineer",
];
export default function UploadPage() {
  const navigate = useNavigate();
  const {
    setFile,
    jobRole,
    setJobRole,
    setAnalysisResult,
    setLoading,
    loading,
    error,
    setError,
    clearError,
  } = useResume();
  const [dragging, setDragging] = useState(false);
  const [localFile, setLocalFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const inputRef = useRef(null);
  const validTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const handleFile = useCallback(
    (f) => {
      if (!f) return;
      if (!validTypes.includes(f.type)) {
        setError("Please upload a PDF or DOCX file only.");
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        setError("File size must be under 5 MB.");
        return;
      }
      clearError();
      setLocalFile(f);
      setFile(f);
    },
    [setFile, setError, clearError],
  );
  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile],
  );
  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);
  const removeFile = () => {
    setLocalFile(null);
    setFile(null);
    clearError();
  };
  const handleAnalyze = async () => {
    if (!localFile) {
      setError("Please upload a resume first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeResume(localFile, jobRole, jdText);
      setAnalysisResult(result);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "Analysis failed. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <span className="badge-cyan mb-4 inline-flex">
            <ShieldCheck size={11} /> Secure Data Ingest
          </span>
          <h1 className="text-4xl font-black text-nexus-text mb-3">
            Upload Your <span className="text-gradient-cyan">Resume</span>
          </h1>
          <p className="text-nexus-muted text-sm leading-relaxed">
            Your resume is analyzed locally and never stored. AES-256 encrypted
            in transit.
          </p>
        </motion.div>
        <ErrorBanner message={error} onDismiss={clearError} />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-5 mt-5"
        >
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => !localFile && inputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
              ${
                dragging
                  ? "border-cyan-400 bg-cyan-500/8 scale-[1.01] shadow-glow-cyan"
                  : localFile
                    ? "border-emerald-400/50 bg-emerald-500/5 cursor-default"
                    : "border-white/15 bg-white/3 hover:border-cyan-400/40 hover:bg-cyan-500/4"
              } p-10`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <AnimatePresence mode="wait">
              {localFile ? (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                    <FileText size={22} className="text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-nexus-text truncate">
                      {localFile.name}
                    </p>
                    <p className="text-xs text-nexus-muted mt-0.5">
                      {(localFile.size / 1024).toFixed(0)} KB ·{" "}
                      {localFile.type.includes("pdf") ? "PDF" : "DOCX"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-emerald-400" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="text-nexus-muted hover:text-rose-400 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center border transition-all ${
                      dragging
                        ? "border-cyan-400 bg-cyan-500/15"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <Upload
                      size={26}
                      className={`transition-colors ${dragging ? "text-cyan-400" : "text-nexus-muted"}`}
                    />
                  </div>
                  <p className="font-semibold text-nexus-text mb-1">
                    {dragging ? "Drop it here!" : "Drag & drop your resume"}
                  </p>
                  <p className="text-sm text-nexus-muted mb-4">
                    or click to browse files
                  </p>
                  <div className="flex gap-2 justify-center">
                    <span className="badge bg-white/5 text-nexus-muted border-white/10 text-[10px]">
                      PDF
                    </span>
                    <span className="badge bg-white/5 text-nexus-muted border-white/10 text-[10px]">
                      DOCX
                    </span>
                    <span className="badge bg-white/5 text-nexus-muted border-white/10 text-[10px]">
                      Max 5MB
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div>
            <label className="block text-sm font-semibold text-nexus-text mb-2">
              Target Job Role
            </label>
            <div className="relative">
              <select
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="nexus-input appearance-none pr-10"
              >
                {JOB_ROLES.map((r) => (
                  <option key={r} value={r} className="bg-navy-800">
                    {r}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-nexus-muted pointer-events-none"
              />
            </div>
            <p className="text-xs text-nexus-muted mt-1.5">
              We tailor keyword extraction and ATS matching to your target role.
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              Paste Job Description (Optional)
              {jdText.length > 0 && (
                <span className="inline-flex items-center gap-1 bg-primary/10 border border-primary/25 text-primary text-xs rounded-full px-2 py-0.5">
                  <CheckCircle size={12} className="text-primary" />
                  JD Matched
                </span>
              )}
            </label>
            <textarea
              className="nexus-input w-full resize-none p-3"
              rows={5}
              placeholder="Paste the job description here for precise keyword matching..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value.substring(0, 2000))}
            />
            <div className="text-xs text-muted-foreground mt-1 text-right">
              {jdText.length} / 2000 characters
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !localFile}
            className={`w-full btn-primary justify-center py-4 text-base transition-all ${
              !localFile || loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Run Full Analysis
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-6 pt-2">
            {[
              "End-to-end encrypted",
              "Auto-deleted after analysis",
              "GDPR compliant",
            ].map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 text-[11px] text-nexus-muted"
              >
                <ShieldCheck size={11} className="text-emerald-400" />
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}