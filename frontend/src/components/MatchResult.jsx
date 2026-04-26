import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const ConfirmDialog = ({ title, message, icon, confirmLabel, confirmColor, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
    <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-6 shadow-2xl w-full max-w-sm animate-fade-in-up">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-navy-800 flex items-center justify-center text-2xl mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white text-lg text-center mb-1">{title}</h3>
      <p className="text-gray-500 dark:text-navy-400 text-sm text-center mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-navy-800 hover:bg-gray-200 dark:hover:bg-navy-700 text-gray-700 dark:text-navy-200 text-sm font-semibold transition">
          Cancel
        </button>
        <button onClick={onConfirm}
          className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition shadow-md ${confirmColor}`}>
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

const MatchResult = ({ match, onStatusUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  const statusConfig = {
    suggested: { label: "SUGGESTED", class: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30" },
    accepted:  { label: "ACCEPTED",  class: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30" },
    rejected:  { label: "REJECTED",  class: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30" },
    completed: { label: "COMPLETED", class: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30" },
  }[match.status] || { label: match.status?.toUpperCase(), class: "bg-gray-100 text-gray-600" };

  const scoreColor = match.matchScore >= 80 ? "text-emerald-600 dark:text-emerald-400" : match.matchScore >= 50 ? "text-amber-600 dark:text-amber-400" : "text-red-500 dark:text-red-400";
  const scoreBar   = match.matchScore >= 80 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : match.matchScore >= 50 ? "bg-gradient-to-r from-amber-400 to-amber-500" : "bg-gradient-to-r from-red-400 to-red-500";

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      await API.patch(`/api/matches/${match._id}/status`, { status });
      toast.success(
        status === "accepted"  ? "Match accepted! 🎉" :
        status === "rejected"  ? "Match rejected"     :
        status === "completed" ? "Mission complete! 🏆" : `Match ${status}!`
      );
      if (onStatusUpdate) onStatusUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed!");
    } finally {
      setUpdating(false);
    }
  };

  const categoryIcons = {
    education: "📚", food: "🍱", health: "🏥",
    shelter: "🏠", clothing: "👕", other: "🌟"
  };

  return (
    <>
      {/* ── Reject Confirmation ── */}
      {showRejectConfirm && (
        <ConfirmDialog
          icon="❌"
          title="Reject this match?"
          message="This volunteer will be notified that you declined. This action cannot be undone."
          confirmLabel="Yes, Reject"
          confirmColor="bg-red-500 hover:bg-red-400 shadow-red-500/25"
          onConfirm={() => { setShowRejectConfirm(false); updateStatus("rejected"); }}
          onCancel={() => setShowRejectConfirm(false)}
        />
      )}

      {/* ── Complete Confirmation ── */}
      {showCompleteConfirm && (
        <ConfirmDialog
          icon="🏆"
          title="Mark as completed?"
          message="This will mark the volunteer mission as done and notify the volunteer."
          confirmLabel="Yes, Complete!"
          confirmColor="bg-blue-500 hover:bg-blue-400 shadow-blue-500/25"
          onConfirm={() => { setShowCompleteConfirm(false); updateStatus("completed"); }}
          onCancel={() => setShowCompleteConfirm(false)}
        />
      )}

      <div className="card-hover bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl shadow-sm overflow-hidden">

        {/* ── Colored top bar ── */}
        <div className={`h-1 w-full ${
          match.status === "suggested" ? "bg-gradient-to-r from-amber-400 to-amber-500" :
          match.status === "accepted"  ? "bg-gradient-to-r from-emerald-400 to-emerald-500" :
          match.status === "completed" ? "bg-gradient-to-r from-blue-400 to-blue-500" :
          "bg-gradient-to-r from-red-400 to-red-500"
        }`} />

        <div className="p-5">
          {/* ── Header ── */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-navy-600 to-navy-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md shadow-navy-600/25">
                {match.volunteer?.name?.charAt(0).toUpperCase() || "V"}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                  {match.volunteer?.name || "Volunteer"}
                </h3>
                <p className="text-xs text-gray-400 dark:text-navy-400">
                  {match.volunteer?.email || "Matched volunteer"}
                </p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusConfig.class}`}>
              {statusConfig.label}
            </span>
          </div>

          {/* ── Score Bar ── */}
          <div className="mb-4 p-3 bg-gray-50 dark:bg-navy-800/50 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500 dark:text-navy-400 font-semibold">Match Score</span>
              <span className={`text-base font-bold ${scoreColor}`}>
                {match.matchScore}
                <span className="text-xs font-normal opacity-60">/100</span>
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-navy-700 rounded-full h-2">
              <div className={`${scoreBar} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${match.matchScore}%` }} />
            </div>
          </div>

          {/* ── Need Info ── */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-navy-800/60 border border-gray-100 dark:border-navy-700/40">
              <p className="text-xs text-gray-400 dark:text-navy-500 font-medium mb-0.5">📍 Area</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-navy-100 capitalize">
                {match.need?.area || "—"}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-navy-800/60 border border-gray-100 dark:border-navy-700/40">
              <p className="text-xs text-gray-400 dark:text-navy-500 font-medium mb-0.5">🏷 Category</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-navy-100 capitalize">
                {categoryIcons[match.need?.category] || "🌟"} {match.need?.category || "—"}
              </p>
            </div>
          </div>

          {/* ── AI Reasoning ── */}
          {match.aiReason && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-navy-50 to-navy-100/50 dark:from-navy-800/40 dark:to-navy-900/40 border border-navy-100 dark:border-navy-700/40 mb-3">
              <p className="text-xs font-bold text-navy-600 dark:text-navy-300 mb-1.5">🤖 AI Reasoning</p>
              <p className="text-xs text-gray-600 dark:text-navy-300 leading-relaxed">{match.aiReason}</p>
            </div>
          )}

          {/* ── Urgency score if available ── */}
          {match.need?.urgencyScore > 0 && (
            <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 dark:text-navy-400">
              <span>🎯 Urgency Score:</span>
              <div className="flex gap-0.5">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < match.need.urgencyScore ? "bg-amber-400" : "bg-gray-200 dark:bg-navy-700"}`} />
                ))}
              </div>
              <span className="font-semibold">{match.need.urgencyScore}/10</span>
            </div>
          )}

          {/* ── Action Buttons ── */}
          {match.status === "suggested" && (
            <div className="flex gap-2 mt-4">
              <button onClick={() => updateStatus("accepted")} disabled={updating}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-60 text-white text-sm font-bold transition-all shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5">
                {updating ? "..." : <><span>✅</span><span>Accept</span></>}
              </button>
              <button onClick={() => setShowRejectConfirm(true)} disabled={updating}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 disabled:opacity-60 text-white text-sm font-bold transition-all shadow-md shadow-red-500/25 flex items-center justify-center gap-1.5">
                <span>❌</span><span>Reject</span>
              </button>
            </div>
          )}

          {match.status === "accepted" && (
            <button onClick={() => setShowCompleteConfirm(true)} disabled={updating}
              className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:opacity-60 text-white text-sm font-bold transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-1.5">
              <span>🏆</span><span>Mark as Completed</span>
            </button>
          )}

          {match.status === "completed" && (
            <div className="mt-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-500/5 border border-blue-200 dark:border-blue-500/20 text-center">
              <p className="text-sm font-bold text-blue-700 dark:text-blue-300">🎉 Mission Complete!</p>
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-0.5">Thank you for your service</p>
            </div>
          )}

          {match.status === "rejected" && (
            <div className="mt-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-center">
              <p className="text-sm font-bold text-red-600 dark:text-red-400">Match Declined</p>
              <p className="text-xs text-red-400 dark:text-red-500 mt-0.5">This match was rejected</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MatchResult;