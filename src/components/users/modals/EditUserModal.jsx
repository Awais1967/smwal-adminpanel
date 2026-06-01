import React, { useEffect, useMemo, useState, startTransition } from "react";
import { FiArrowLeft, FiX, FiChevronDown, FiUpload } from "react-icons/fi";

const COUNTRIES = ["UK", "Spain", "India", "Canada", "Australia"];
const CITIES = {
  UK: ["London", "Manchester"],
  Spain: ["Barcelona", "Madrid"],
  India: ["Mumbai", "Delhi"],
  Canada: ["Toronto", "Vancouver"],
  Australia: ["Sydney", "Melbourne"],
};

function useLockBody(open) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);
}

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <p className="text-[12px] font-medium text-white/75">{label}</p>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white placeholder:text-white/30 outline-none focus:border-white/20"
  />
);

const Select = ({ children, ...props }) => (
  <div className="relative">
    <select
      {...props}
      className="h-10 w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-3 pr-9 text-[13px] text-white/80 outline-none focus:border-white/20"
    >
      {children}
    </select>
    <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50" />
  </div>
);

export default function EditUserModal({ open, onClose, user, onSave }) {
  useLockBody(open);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [portraitName, setPortraitName] = useState("");

  const cities = useMemo(
    () => (country ? CITIES[country] || [] : []),
    [country],
  );

  useEffect(() => {
    if (!open || !user) return;
    startTransition(() => {
      setFullName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAge(user.age || 0);
      setGender(user.gender || "");
      setCountry(user.country || "");
      setPortraitName(user.portraitName || "");
      const onlyCity = (user.city || "").split(",")[0]?.trim() || "";
      setCity(onlyCity);
    });
  }, [open, user]);

  const canSubmit = useMemo(() => {
    return (
      fullName.trim().length >= 2 &&
      email.includes("@") &&
      phone.trim().length > 5 &&
      gender &&
      country &&
      city
    );
  }, [fullName, email, phone, gender, country, city]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#161616] shadow-2xl">
        <div className="flex items-start justify-between gap-3 p-6">
          <div className="flex items-start gap-4">
            <button
              onClick={onClose}
              className="mt-0.5 rounded-md p-2 text-white/70 hover:bg-white/5 hover:text-white"
            >
              <FiArrowLeft size={18} />
            </button>
            <div>
              <h3 className="text-[16px] font-semibold text-white">Add User</h3>
              <p className="mt-1 text-[12px] text-white/55">
                Create a new user profile for the platform.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-white/60 hover:bg-white/5 hover:text-white"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 pb-6">
          <div className="space-y-4">
            <Field label="Full Name">
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Field>

            <Field label="Email Address">
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>

            <Field label="Phone Number">
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>

            <Field label="Age">
              <div className="flex h-10 items-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <button
                  type="button"
                  onClick={() => setAge((a) => a + 1)}
                  className="h-full w-10 text-white/70 hover:bg-white/5"
                >
                  +
                </button>
                <input
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value || 0))}
                  className="h-full flex-1 bg-transparent px-3 text-center text-[13px] text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setAge((a) => Math.max(0, a - 1))}
                  className="h-full w-10 text-white/70 hover:bg-white/5"
                >
                  –
                </button>
              </div>
            </Field>

            <Field label="Gender">
              <Select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" className="bg-[#141414]">
                  Select gender
                </option>
                <option value="Male" className="bg-[#141414]">
                  Male
                </option>
                <option value="Female" className="bg-[#141414]">
                  Female
                </option>
                <option value="Other" className="bg-[#141414]">
                  Other
                </option>
              </Select>
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Country">
                <Select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setCity("");
                  }}
                >
                  <option value="" className="bg-[#141414]">
                    Select country
                  </option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} className="bg-[#141414]">
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="City">
                <Select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!country}
                >
                  <option value="" className="bg-[#141414]">
                    Enter city
                  </option>
                  {cities.map((c) => (
                    <option key={c} value={c} className="bg-[#141414]">
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="User Portrait (optional)">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-white/5 px-4 py-6 text-center hover:bg-white/10">
                <FiUpload className="text-white/55" />
                <p className="text-[12px] text-white/50">
                  Drop images or click to add
                </p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    setPortraitName(e.target.files?.[0]?.name || portraitName)
                  }
                />
              </label>

              {portraitName ? (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="text-[12px] text-white/70">
                    {portraitName}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPortraitName("")}
                    className="rounded-md px-2 py-1 text-[12px] text-white/60 hover:bg-white/10"
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </Field>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={onClose}
            className="h-10 w-full rounded-lg border border-white/10 bg-white/5 text-[13px] text-white/70 hover:bg-white/10 sm:w-55"
          >
            Cancel
          </button>

          <button
            disabled={!canSubmit}
            onClick={() => {
              if (!user?.id) return;
              onSave?.(user.id, {
                name: fullName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                age: Number(age || 0),
                gender,
                country,
                city: `${city}, ${country}`,
                portraitName,
              });
            }}
            className={`h-10 w-full rounded-lg text-[13px] font-medium text-white sm:w-[320px] ${
              canSubmit
                ? "bg-[#0B67CD] hover:brightness-110"
                : "bg-white/30 cursor-not-allowed"
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
