import React, { useMemo } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiEye,
  FiSearch,
  FiSend,
  FiTrash2,
} from "react-icons/fi";
import Button from "../shared/Button";
import IconButton from "../shared/IconButton";
import SelectField from "../shared/SelectField";
import StatusPill from "../shared/StatusPill";

const STATUS_OPTIONS = ["Draft", "Sent"];
const PRIORITY_OPTIONS = ["Low", "Normal", "High"];
const SEGMENT_OPTIONS = [
  "All Users",
  "Active Users",
  "Inactive 30-Day Users",
  "Matched Users",
  "Unmatched Users",
  "Subscribed Users",
  "Users with Pending Payment",
  "Event Registered Users",
  "Mentorship Users",
  "Country Based Users",
];

function buildPagination(current, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (current <= 2) return [1, 2, "...", totalPages];
  if (current >= totalPages - 1) return [1, "...", totalPages - 1, totalPages];
  return [1, "...", current, "...", totalPages];
}

function pct(value) {
  const number = Number(value || 0);
  return `${Number.isFinite(number) ? number : 0}%`;
}

export default function MessagesTable({
  rows = [],
  total = 0,
  loading = false,
  error = null,
  page = 1,
  pageSize = 10,
  search = "",
  filters = {},
  onSearchChange,
  onFilterChange,
  onPageChange,
  onPageSizeChange,
  onAddCampaign,
  onViewCampaign,
  onEditCampaign,
  onDeleteCampaign,
  onSendCampaign,
}) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => buildPagination(safePage, totalPages),
    [safePage, totalPages],
  );

  return (
    <div className="w-full">
      <div className="mb-4 text-[15px] font-semibold text-white">Overview</div>

      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(event) => onSearchChange?.(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="h-10 w-full rounded-lg border border-white/10 bg-white/3 pl-9 pr-3 text-sm text-white/80 placeholder:text-white/35 outline-none hover:bg-white/5 focus:border-white/20"
            placeholder="Search by campaign name or message"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:flex xl:items-center">
          <SelectField
            value={filters.status || "All"}
            onChange={(value) => onFilterChange?.("status", value)}
            options={[
              { value: "All", label: "Status" },
              ...STATUS_OPTIONS.map((value) => ({ value, label: value })),
            ]}
            className="min-w-32"
          />
          <SelectField
            value={filters.priority || "All"}
            onChange={(value) => onFilterChange?.("priority", value)}
            options={[
              { value: "All", label: "Priority" },
              ...PRIORITY_OPTIONS.map((value) => ({ value, label: value })),
            ]}
            className="min-w-32"
          />
          <SelectField
            value={filters.segment || "All"}
            onChange={(value) => onFilterChange?.("segment", value)}
            options={[
              { value: "All", label: "Segment" },
              ...SEGMENT_OPTIONS.map((value) => ({ value, label: value })),
            ]}
            className="min-w-52"
          />

          <Button variant="add" onClick={onAddCampaign}>
            + Create Campaign
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1180px] text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/2">
                {[
                  "Campaign Name",
                  "Segment",
                  "Recipients",
                  "Status",
                  "Priority",
                  "Send Date",
                  "Open Rate",
                  "CTR",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className={[
                      "px-4 py-4 text-left text-[12px] font-medium text-white/55",
                      header === "Actions" ? "text-right" : "",
                    ].join(" ")}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-white/50">
                    Loading campaigns...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-red-300">
                    {error.message || "Unable to load campaigns."}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-white/50">
                    No campaigns found.
                  </td>
                </tr>
              ) : null}

              {!loading &&
                !error &&
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-white/5 last:border-b-0 hover:bg-white/2"
                  >
                    <td className="px-4 py-4 align-top text-white/85">
                      <div className="max-w-44 leading-5">{row.campaignName}</div>
                    </td>
                    <td className="px-4 py-4 align-top text-white/70">
                      <div className="max-w-44 truncate" title={row.segment}>
                        {row.segment}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-white/80">
                      {row.recipients || 0}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="px-4 py-4 align-top text-white/80">
                      {row.priority || "Normal"}
                    </td>
                    <td className="px-4 py-4 align-top text-white/70">
                      {row.date || row.sendDate || "-"}
                    </td>
                    <td className="px-4 py-4 align-top text-white/80">
                      {pct(row.openRate)}
                    </td>
                    <td className="px-4 py-4 align-top text-white/80">
                      {pct(row.ctr)}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton
                          icon={FiEye}
                          label="View campaign"
                          onClick={() => onViewCampaign?.(row)}
                          variant="subtle"
                          className="text-white/80"
                        />
                        <IconButton
                          icon={FiEdit2}
                          label="Edit campaign"
                          onClick={() => onEditCampaign?.(row)}
                          variant="edit"
                        />
                        {row.status === "Draft" ? (
                          <IconButton
                            icon={FiSend}
                            label="Send campaign"
                            onClick={() => onSendCampaign?.(row)}
                            variant="subtle"
                            className="text-sky-300"
                          />
                        ) : null}
                        <IconButton
                          icon={FiTrash2}
                          label="Delete campaign"
                          onClick={() => onDeleteCampaign?.(row)}
                          variant="danger"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 text-xs text-white/55 sm:flex-row sm:items-center">
          <span>
            Showing Campaigns {rows.length} of {total}
          </span>

          <SelectField
            value={pageSize}
            onChange={(value) => onPageSizeChange?.(Number(value))}
            options={[
              { value: 5, label: "Rows Per Page: 5" },
              { value: 7, label: "Rows Per Page: 7" },
              { value: 10, label: "Rows Per Page: 10" },
              { value: 20, label: "Rows Per Page: 20" },
            ]}
            className="w-36"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => onPageChange?.(Math.max(1, safePage - 1))}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#1D4ED8] bg-[#1D4ED8] text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <FiChevronLeft />
          </button>

          {pageItems.map((item, index) =>
            item === "..." ? (
              <div
                key={`ellipsis-${index}`}
                className="grid h-9 min-w-9 place-items-center rounded-lg border border-white/10 bg-white/2 px-3 text-white/60"
              >
                ...
              </div>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange?.(item)}
                className={[
                  "h-9 min-w-9 rounded-lg border px-3 text-sm",
                  safePage === item
                    ? "border-white/15 bg-white/8 text-white"
                    : "border-white/10 bg-white/2 text-white/70 hover:bg-white/5",
                ].join(" ")}
              >
                {item}
              </button>
            ),
          )}

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => onPageChange?.(Math.min(totalPages, safePage + 1))}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#1D4ED8] bg-[#1D4ED8] text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
