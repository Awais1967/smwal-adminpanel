import React, { useEffect, useMemo, useState, startTransition } from "react";
import { FiArrowLeft, FiX, FiChevronDown, FiUpload } from "react-icons/fi";

const COUNTRIES = ["UK", "USA", "France", "Germany", "Canada", "Indonesia"];
const CITIES = {
  UK: ["London", "Manchester", "Birmingham"],
  USA: ["New York", "San Francisco", "Austin"],
  France: ["Paris", "Lyon"],
  Germany: ["Berlin", "Munich"],
  Canada: ["Toronto", "Vancouver"],
  Indonesia: ["Bali", "Jakarta"],
};

function useLockBody(open) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
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
    className={
      "h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white placeholder:text-white/30 outline-none focus:border-white/20 " +
      (props.className || "")
    }
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    className={
      "min-h-27.5 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-[13px] text-white placeholder:text-white/30 outline-none focus:border-white/20 " +
      (props.className || "")
    }
  />
);

const Select = ({ children, ...props }) => (
  <div className="relative">
    <select
      {...props}
      className={
        "h-10 w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-3 pr-9 text-[13px] text-white/80 outline-none focus:border-white/20 " +
        (props.className || "")
      }
    >
      {children}
    </select>
    <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50" />
  </div>
);

export default function EditEventModal({ open, onClose, event, onSave }) {
  useLockBody(open);

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [fee, setFee] = useState(0);
  const [description, setDescription] = useState("");
  const [coverName, setCoverName] = useState("");

  const cities = useMemo(
    () => (country ? CITIES[country] || [] : []),
    [country],
  );

  useEffect(() => {
    if (!open || !event) return;
    startTransition(() => {
      setName(event.name || "");
      setCountry(event.country || "");
      setCity(event.city || "");
      setDate(event.date || "");
      setStartTime(event.startTime || "");
      setEndTime(event.endTime || "");
      setFee(event.fee ?? 0);
      setDescription(event.description || "");
      setCoverName(event.coverName || "Image.png");
    });
  }, [open, event]);

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 2 && country && city && date && startTime && endTime
    );
  }, [name, country, city, date, startTime, endTime]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#161616] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-6">
          <div className="flex items-start gap-4">
            <button
              onClick={onClose}
              className="mt-0.5 rounded-md p-2 text-white/70 hover:bg-white/5 hover:text-white"
              aria-label="Back"
            >
              <FiArrowLeft size={18} />
            </button>

            <div>
              <h3 className="text-[16px] font-semibold text-white">
                Create Event
              </h3>
              <p className="mt-1 text-[12px] text-white/55">
                Add a new event and open registrations for users.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-2 text-white/60 hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 pb-6">
          <div className="space-y-4">
            <Field label="Event Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
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

            <Field label="Event Date">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Start Time">
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </Field>

              <Field label="End Time">
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </Field>
            </div>

            <Field label="Event Fee">
              <div className="flex h-10 items-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <button
                  type="button"
                  onClick={() => setFee((f) => f + 5)}
                  className="h-full w-10 text-white/70 hover:bg-white/5"
                >
                  +
                </button>
                <input
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value || 0))}
                  className="h-full flex-1 bg-transparent px-3 text-center text-[13px] text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setFee((f) => Math.max(0, f - 5))}
                  className="h-full w-10 text-white/70 hover:bg-white/5"
                >
                  –
                </button>
              </div>
            </Field>

            <Field label="Short Description">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>

            <Field label="Cover Photo (optional)">
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
                    setCoverName(e.target.files?.[0]?.name || coverName)
                  }
                />
              </label>

              {coverName ? (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="text-[12px] text-white/70">{coverName}</div>
                  <button
                    type="button"
                    onClick={() => setCoverName("")}
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
              if (!event?.id) return;
              onSave?.(event.id, {
                name: name.trim(),
                country,
                city,
                date,
                startTime,
                endTime,
                fee: Number(fee || 0),
                description: description.trim(),
                coverName,
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
