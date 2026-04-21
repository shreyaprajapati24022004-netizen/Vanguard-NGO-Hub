import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const categories = [
  { value: "food", label: "🍱 Food" }, { value: "education", label: "📚 Education" },
  { value: "health", label: "🏥 Health" }, { value: "shelter", label: "🏠 Shelter" },
  { value: "clothing", label: "👗 Clothing" }, { value: "other", label: "📦 Other" },
];
const urgencyLevels = [
  { value: "low",      label: "Low",      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30" },
  { value: "medium",   label: "Medium",   color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/30" },
  { value: "high",     label: "High",     color: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/15 border-orange-200 dark:border-orange-500/30" },
  { value: "critical", label: "Critical", color: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/15 border-red-200 dark:border-red-500/30" },
];
const inputClass = "w-full bg-gray-50 dark:bg-navy-800/60 border border-gray-200 dark:border-navy-700/50 rounded-xl px-4 py-2.5 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-navy-400 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/40 focus:border-navy-500 dark:focus:border-navy-400 transition";

const SurveyForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ area: "", category: "food", description: "", urgencyLevel: "medium", peopleAffected: "" });
  const [loading, setLoading] = useState(false);
  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/api/surveys", formData);
      toast.success("Survey submitted successfully!");
      setFormData({ area: "", category: "food", description: "", urgencyLevel: "medium", peopleAffected: "" });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Survey submission failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-navy-100 dark:bg-navy-700/60 flex items-center justify-center text-xl">📋</div>
        <div>
          <h2 className="font-display font-bold text-gray-900 dark:text-white text-base">Submit Community Need Survey</h2>
          <p className="text-xs text-gray-400 dark:text-navy-400">Report a need in your community</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-navy-300 mb-1.5">📍 Area / Location</label>
          <input type="text" required placeholder="e.g. Lucknow, Gomti Nagar" className={inputClass} value={formData.area} onChange={set("area")} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-navy-300 mb-2">🏷 Category</label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((c) => (
              <button key={c.value} type="button" onClick={() => setFormData({ ...formData, category: c.value })}
                className={`p-2 rounded-xl border text-xs font-semibold transition-all duration-200 ${formData.category === c.value ? "border-navy-500 bg-navy-50 dark:bg-navy-700/60 text-navy-700 dark:text-navy-200" : "border-gray-200 dark:border-navy-700/50 bg-gray-50 dark:bg-navy-800/40 text-gray-500 dark:text-navy-400 hover:border-navy-300 dark:hover:border-navy-500"}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-navy-300 mb-1.5">📝 Description</label>
          <textarea required rows={3} placeholder="Describe the community need in detail..." className={inputClass + " resize-none"} value={formData.description} onChange={set("description")} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-navy-300 mb-2">🚨 Urgency Level</label>
          <div className="grid grid-cols-4 gap-2">
            {urgencyLevels.map((u) => (
              <button key={u.value} type="button" onClick={() => setFormData({ ...formData, urgencyLevel: u.value })}
                className={`py-2 rounded-xl border text-xs font-bold transition-all duration-200 ${formData.urgencyLevel === u.value ? u.color : "border-gray-200 dark:border-navy-700/50 bg-gray-50 dark:bg-navy-800/40 text-gray-400 dark:text-navy-500 hover:border-gray-300"}`}>
                {u.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-navy-300 mb-1.5">👥 People Affected</label>
          <input type="number" placeholder="e.g. 50" min="1" className={inputClass} value={formData.peopleAffected} onChange={set("peopleAffected")} />
        </div>
        <button type="submit" disabled={loading}
          className="btn-shine w-full bg-navy-600 hover:bg-navy-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md shadow-navy-800/30 flex items-center justify-center gap-2 mt-2">
          {loading ? (
            <><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Submitting...</>
          ) : "Submit Survey"}
        </button>
      </form>
    </div>
  );
};

export default SurveyForm;