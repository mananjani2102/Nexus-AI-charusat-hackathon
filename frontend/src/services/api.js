import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://nexus-ai-3o4n.onrender.com/api",
  timeout: 90000,
});
export const analyzeResume = async (file, jobRole, jdText) => {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("jobRole", jobRole);
  if (jdText) {
    formData.append("jobDescription", jdText);
  }
  const { data } = await api.post("/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
export const improveBullet = async (bullet, jobRole) => {
  const { data } = await api.post("/improve-bullet", { bullet, jobRole });
  return data;
};
export const getHistory = async () => {
  const { data } = await api.get("/history");
  return data;
};

export const generateInterviewQuestions = async (payload) => {
  const { data } = await api.post("/interview-questions", payload);
  return data;
};

export const rewriteResume = async (payload) => {
  const { data } = await api.post("/rewrite-resume", payload);
  return data;
};
