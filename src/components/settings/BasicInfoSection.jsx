import React, { useRef, useState } from "react";
import { FiEye, FiEyeOff, FiUploadCloud } from "react-icons/fi";
import ChangePasswordModal from "./modals/ChangePasswordModal";

function Label({ children }) {
  return (
    <div className="mb-2 text-[12px] font-medium text-white/70">{children}</div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  right,
  leftPad = false,
}) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        type={type}
        className={[
          "h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white/80 outline-none placeholder:text-white/30 focus:border-[#0b74ff]",
          right ? "pr-10" : "",
          leftPad ? "pl-9" : "",
        ].join(" ")}
      />
      {right ? (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">{right}</div>
      ) : null}
    </div>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white/75 outline-none focus:border-[#0b74ff]"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export default function BasicInfoSection({
  value,
  onChange,
  countries = [
    { value: "UK", label: "UK" },
    { value: "USA", label: "USA" },
    { value: "Canada", label: "Canada" },
    { value: "Pakistan", label: "Pakistan" },
  ],
}) {
  const v = value || {};
  const fileRef = useRef(null);

  const [showPass, setShowPass] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [logoFile, setLogoFile] = useState(v.logoFile || null);

  const setField = (key, val) => onChange?.({ ...v, [key]: val });

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="text-[14px] font-semibold text-white">
        Basic Information
      </div>
      <div className="mt-1 text-[12px] text-white/55">
        Manage your organization profile settings.
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Ministry Name</Label>
          <Input
            value={v.ministryName || ""}
            onChange={(val) => setField("ministryName", val)}
            placeholder="Enter ministry name"
          />
        </div>

        <div>
          <Label>Country</Label>
          <Select
            value={v.country || ""}
            onChange={(val) => setField("country", val)}
            options={countries}
            placeholder="Select country"
          />
        </div>

        <div>
          <Label>Organization Type</Label>
          <Input
            value={v.orgType || ""}
            onChange={(val) => setField("orgType", val)}
            placeholder="Email"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label>Password</Label>
            <button
              type="button"
              onClick={() => setPasswordModal(true)}
              className="text-[12px] font-semibold text-[#a855f7] hover:text-[#c084fc]"
            >
              Change
            </button>
          </div>
          <Input
            value={v.passwordMasked || "********"}
            onChange={() => {}}
            placeholder="Password"
            type={showPass ? "text" : "password"}
            right={
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="grid h-8 w-8 place-items-center rounded-md text-white/60 hover:bg-white/5"
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            }
          />
        </div>

        <div className="md:col-span-2">
          <Label>Organization Logo</Label>
          <div
            className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-4 hover:bg-white/10"
            onClick={() => fileRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10">
                <FiUploadCloud className="text-white/70" />
              </div>
              <div>
                <div className="text-[13px] text-white/80">
                  {logoFile?.name || "Drop image or click to upload"}
                </div>
                <div className="text-[12px] text-white/45">
                  PNG, JPG up to 5MB
                </div>
              </div>
            </div>

            <div className="text-[12px] font-semibold text-white/60">
              Browse
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setLogoFile(f);
                setField("logoFile", f);
              }}
            />
          </div>
        </div>
      </div>

      <ChangePasswordModal
        open={passwordModal}
        onClose={() => setPasswordModal(false)}
      />
    </div>
  );
}
