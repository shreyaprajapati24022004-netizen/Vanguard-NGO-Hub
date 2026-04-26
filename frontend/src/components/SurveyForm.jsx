import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const categories = [
  { value: "food",      label: "Food",      icon: "🍱", desc: "Food & nutrition needs" },
  { value: "education", label: "Education", icon: "📚", desc: "Learning & tutoring" },
  { value: "health",    label: "Health",    icon: "🏥", desc: "Medical assistance" },
  { value: "shelter",   label: "Shelter",   icon: "🏠", desc: "Housing support" },
  { value: "clothing",  label: "Clothing",  icon: "👕", desc: "Clothes & essentials" },
  { value: "other",     label: "Other",     icon: "📦", desc: "Other community needs" },
];

const urgencyLevels = [
  { value: "low",      label: "Low",      icon: "🟢", desc: "Can wait a few weeks",    color: "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  { value: "medium",   label: "Medium",   icon: "🟡", desc: "Needed within a week",    color: "border-amber-400 bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  { value: "high",     label: "High",     icon: "🟠", desc: "Needed within days",      color: "border-orange-400 bg-orange-50 dark:bg-orange-500/15 text-orange-700 dark:text-orange-300" },
  { value: "critical", label: "Critical", icon: "🔴", desc: "Immediate action needed", color: "border-red-400 bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300" },
];

const inputClass = "w-full bg-gray-50 dark:bg-navy-800/60 border border-gray-200 dark:border-navy-700/50 rounded-xl px-4 py-3 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-navy-400 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/40 focus:border-navy-500 transition";

const steps = [
  { id: 1, label: "Location", icon: "📍" },
  { id: 2, label: "Category", icon: "🏷" },
  { id: 3, label: "Details",  icon: "📝" },
  { id: 4, label: "Urgency",  icon: "🚨" },
];

const SurveyForm = ({ onSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    area: "", category: "", description: "",
    urgencyLevel: "", peopleAffected: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  const canProceed = () => {
    if (step === 1) return formData.area.trim().length > 0;
    if (step === 2) return formData.category !== "";
    if (step === 3) return formData.description.trim().length > 0;
    if (step === 4) return formData.urgencyLevel !== "";
    return true;
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    setLoading(true);
    try {
      await API.post("/api/surveys", formData);
      toast.success("Survey submitted successfully! 🎉");
      setFormData({ area: "", category: "", description: "", urgencyLevel: "", peopleAffected: "" });
      setStep(1);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Survey submission failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl shadow-sm overflow-hidden">

      {/* ── Progress Header ── */}
      <div className="bg-gradient-to-r from-navy-800 to-navy-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-white text-base">Submit Community Need Survey</h2>
            <p className="text-navy-300 text-xs mt-0.5">Step {step} of {steps.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
            {steps[step - 1].icon}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/10 rounded-full h-1.5 mb-4">
          <div
            className="bg-white h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex gap-2">
          {steps.map((s) => (
            <div key={s.id} className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
              step === s.id ? "bg-white text-navy-800" :
              step > s.id  ? "bg-white/20 text-white" :
                             "bg-white/10 text-navy-400"
            }`}>
              {step > s.id ? "✓" : s.icon}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form Steps ── */}
      <div className="p-6">

        {/* Step 1 — Location */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Where is this need located?</h3>
              <p className="text-xs text-gray-400 dark:text-navy-400 mb-4">Enter the area or neighborhood where help is needed</p>
              <input
                type="text" required
                placeholder="e.g. Lucknow, Gomti Nagar"
                className={inputClass}
                value={formData.area}
                onChange={set("area")}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-navy-300 mb-1.5">
                👥 People Affected <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                type="number" placeholder="e.g. 50" min="1"
                className={inputClass}
                value={formData.peopleAffected}
                onChange={set("peopleAffected")}
              />
            </div>
          </div>
        )}

        {/* Step 2 — Category */}
        {step === 2 && (
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">What type of need is this?</h3>
            <p className="text-xs text-gray-400 dark:text-navy-400 mb-4">Select the category that best describes the community need</p>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((c) => (
                <button key={c.value} type="button"
                  onClick={() => setFormData({ ...formData, category: c.value })}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    formData.category === c.value
                      ? "border-navy-500 bg-navy-50 dark:bg-navy-700/60"
                      : "border-gray-100 dark:border-navy-700/50 bg-gray-50 dark:bg-navy-800/40 hover:border-navy-300 dark:hover:border-navy-500"
                  }`}>
                  <div className="text-2xl mb-2">{c.icon}</div>
                  <p className={`text-sm font-bold ${formData.category === c.value ? "text-navy-700 dark:text-white" : "text-gray-700 dark:text-navy-200"}`}>
                    {c.label}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-navy-500 mt-0.5">{c.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Description */}
        {step === 3 && (
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Describe the need</h3>
            <p className="text-xs text-gray-400 dark:text-navy-400 mb-4">Provide details so volunteers understand what help is needed</p>
            <textarea
              required rows={5}
              placeholder="e.g. We need tutors for 20 children in Gomti Nagar..."
              className={inputClass + " resize-none"}
              value={formData.description}
              onChange={set("description")}
              autoFocus
            />
            <p className="text-xs text-gray-400 dark:text-navy-500 mt-2">
              {formData.description.length} characters
            </p>
          </div>
        )}

        {/* Step 4 — Urgency */}
        {step === 4 && (
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">How urgent is this need?</h3>
            <p className="text-xs text-gray-400 dark:text-navy-400 mb-4">This helps prioritize volunteer matching</p>
            <div className="space-y-3">
              {urgencyLevels.map((u) => (
                <button key={u.value} type="button"
                  onClick={() => setFormData({ ...formData, urgencyLevel: u.value })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3 ${
                    formData.urgencyLevel === u.value
                      ? `border-current ${u.color}`
                      : "border-gray-100 dark:border-navy-700/50 bg-gray-50 dark:bg-navy-800/40 text-gray-500 dark:text-navy-400 hover:border-gray-200"
                  }`}>
                  <span className="text-xl">{u.icon}</span>
                  <div>
                    <p className="text-sm font-bold">{u.label}</p>
                    <p className="text-xs opacity-70">{u.desc}</p>
                  </div>
                  {formData.urgencyLevel === u.value && (
                    <span className="ml-auto text-lg">✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Summary */}
            {formData.urgencyLevel && (
              <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-navy-800/40 border border-gray-100 dark:border-navy-700/40">
                <p className="text-xs font-bold text-gray-500 dark:text-navy-400 mb-2 uppercase tracking-wide">Survey Summary</p>
                <div className="space-y-1 text-xs text-gray-600 dark:text-navy-300">
                  <p>📍 <span className="font-semibold">{formData.area}</span></p>
                  <p>🏷 <span className="font-semibold capitalize">{formData.category}</span></p>
                  <p>📝 <span className="font-semibold">{formData.description.slice(0, 60)}{formData.description.length > 60 ? "..." : ""}</span></p>
                  {formData.peopleAffected && <p>👥 <span className="font-semibold">{formData.peopleAffected} people affected</span></p>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Navigation Buttons ── */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button type="button" onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-navy-700/60 bg-white dark:bg-navy-800 text-gray-600 dark:text-navy-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-navy-700 transition">
              ← Back
            </button>
          )}
          {step < steps.length ? (
            <button type="button"
              onClick={() => { if (canProceed()) setStep(s => s + 1); }}
              disabled={!canProceed()}
              className="flex-1 py-3 rounded-xl bg-navy-600 hover:bg-navy-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition shadow-md shadow-navy-600/25">
              Continue →
            </button>
          ) : (
            <button type="button" onClick={handleSubmit}
              disabled={loading || !canProceed()}
              className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Submitting...</>
              ) : "🚀 Submit Survey"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;