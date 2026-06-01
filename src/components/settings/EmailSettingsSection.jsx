import React from "react";

function Label({ children }) {
  return (
    <div className="mb-2 text-[12px] font-medium text-white/70">{children}</div>
  );
}

export default function EmailSettingsSection({ value, onChange }) {
  const v = value || {};
  const setField = (key, val) => onChange?.({ ...v, [key]: val });

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="text-[14px] font-semibold text-white">Email Settings</div>
      <div className="mt-1 text-[12px] text-white/55">
        Configure default sender information.
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Default Sender Name</Label>
          <input
            value={v.senderName || ""}
            onChange={(e) => setField("senderName", e.target.value)}
            placeholder="Enter sender name"
            className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white/80 outline-none placeholder:text-white/30 focus:border-[#0b74ff]"
          />
        </div>

        <div>
          <Label>Default Sender Email</Label>
          <select
            value={v.senderEmail || ""}
            onChange={(e) => setField("senderEmail", e.target.value)}
            className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white/75 outline-none focus:border-[#0b74ff]"
          >
            <option value="">Select email</option>
            <option value="support@makeithappen.com">
              support@makeithappen.com
            </option>
            <option value="noreply@makeithappen.com">
              noreply@makeithappen.com
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
