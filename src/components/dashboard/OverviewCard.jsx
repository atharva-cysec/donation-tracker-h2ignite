/**
 * OverviewCard — minimal stat card.
 * All cards share the same neutral style — no per-card colors.
 * Green icon only.
 */
function OverviewCard({ icon, label, value, sub }) {
  return (
    <div className="bg-white rounded-xl border border-[#E4E8E5] px-5 py-4 flex flex-col gap-3">
      <div
        className="w-8 h-8 rounded-lg bg-[#EAF3EE] flex items-center justify-center text-[#2F7D5B] shrink-0"
        aria-hidden="true"
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-[#1D2925] leading-none tracking-tight">{value}</p>
        <p className="text-sm text-[#68746F] mt-1">{label}</p>
        {sub && <p className="text-xs text-[#9BAB9E] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default OverviewCard;
