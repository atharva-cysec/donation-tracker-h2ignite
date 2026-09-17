/**
 * OverviewCard — minimal stat summary card.
 *
 * All four cards use the same visual weight — no rainbow of colors.
 * A small blue accent on the icon is the only accent color.
 *
 * Props:
 *   icon    — Lucide icon element
 *   label   — metric name
 *   value   — formatted value string
 *   sub     — optional grey sub-text
 */
function OverviewCard({ icon, label, value, sub }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex flex-col gap-3">
      {/* Icon */}
      <div
        className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Value + Label */}
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-none tracking-tight">
          {value}
        </p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
        {sub && (
          <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  );
}

export default OverviewCard;
