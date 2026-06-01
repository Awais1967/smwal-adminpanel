import React, {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiEye,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import Button from "../shared/Button";
import IconButton from "../shared/IconButton";
import SelectField from "../shared/SelectField";
import StatusPill from "../shared/StatusPill";

function buildPagination(current, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (current <= 2) return [1, 2, "...", totalPages];
  if (current >= totalPages - 1) {
    return [1, "...", totalPages - 1, totalPages];
  }

  return [1, "...", current, "...", totalPages];
}

export default function MessagesTable({
  rows,
  onAddCampaign,
  onViewCampaign,
  onEditCampaign,
  onDeleteCampaign,
}) {
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(7);
  const deferredQuery = useDeferredValue(query);

  const segmentOptions = useMemo(() => {
    const values = Array.from(new Set(rows.map((row) => row.segment))).sort(
      (left, right) => left.localeCompare(right),
    );

    return [{ value: "All", label: "Segment" }].concat(
      values.map((value) => ({ value, label: value })),
    );
  }, [rows]);

  const statusOptions = useMemo(() => {
    const values = Array.from(new Set(rows.map((row) => row.status)));

    return [{ value: "All", label: "Status" }].concat(
      values.map((value) => ({ value, label: value })),
    );
  }, [rows]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          row.campaignName,
          row.segment,
          row.message,
          row.status,
          row.date,
          row.priority,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesSegment = segment === "All" || row.segment === segment;
      const matchesStatus = status === "All" || row.status === status;

      return matchesQuery && matchesSegment && matchesStatus;
    });
  }, [deferredQuery, rows, segment, status]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / perPage));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) {
      const id = setTimeout(() => setPage(totalPages), 0);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [page, totalPages]);

  const pagedRows = useMemo(() => {
    const start = (safePage - 1) * perPage;
    return filteredRows.slice(start, start + perPage);
  }, [filteredRows, perPage, safePage]);

  const pageItems = useMemo(
    () => buildPagination(safePage, totalPages),
    [safePage, totalPages],
  );

  return (
    <div className="w-full">
      <div className="mb-4 text-[15px] font-semibold text-white">Overview</div>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            autoComplete="off"
            spellCheck={false}
            className="h-10 w-full rounded-lg border border-white/10 bg-white/3 pl-9 pr-3 text-sm text-white/80 placeholder:text-white/35 outline-none hover:bg-white/5 focus:border-white/20"
            placeholder="Search by campaign name, segment, or status"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SelectField
            value={segment}
            onChange={(value) => {
              setSegment(value);
              setPage(1);
            }}
            options={segmentOptions}
            className="min-w-40"
          />
          <SelectField
            value={status}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={statusOptions}
            className="min-w-32"
          />

          <Button variant="add" onClick={onAddCampaign}>
            + Add Campaign
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1080px] text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/2">
                <th className="px-4 py-4 text-left text-[12px] font-medium text-white/55">
                  Campaign
                </th>
                <th className="px-4 py-4 text-left text-[12px] font-medium text-white/55">
                  Segment
                </th>
                <th className="px-4 py-4 text-left text-[12px] font-medium text-white/55">
                  Recipients
                </th>
                <th className="px-4 py-4 text-left text-[12px] font-medium text-white/55">
                  Status
                </th>
                <th className="px-4 py-4 text-left text-[12px] font-medium text-white/55">
                  Sent
                </th>
                <th className="px-4 py-4 text-left text-[12px] font-medium text-white/55">
                  Open Rate
                </th>
                <th className="px-4 py-4 text-left text-[12px] font-medium text-white/55">
                  CTR
                </th>
                <th className="px-4 py-4 text-left text-[12px] font-medium text-white/55">
                  Date
                </th>
                <th className="px-4 py-4 text-right text-[12px] font-medium text-white/55">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {pagedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-sm text-white/50"
                  >
                    No campaigns matched the current filters.
                  </td>
                </tr>
              ) : null}

              {pagedRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-white/5 last:border-b-0 hover:bg-white/2"
                >
                  <td className="px-4 py-4 align-top text-white/85">
                    <div className="max-w-38 leading-5">{row.campaignName}</div>
                  </td>
                  <td className="px-4 py-4 align-top text-white/70">
                    <div className="max-w-36 truncate" title={row.segment}>
                      {row.segment}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top text-white/80">
                    {row.recipients}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="px-4 py-4 align-top text-white/80">
                    {row.sent}
                  </td>
                  <td className="px-4 py-4 align-top text-white/80">
                    {row.openRate}%
                  </td>
                  <td className="px-4 py-4 align-top text-white/80">
                    {row.ctr}%
                  </td>
                  <td className="px-4 py-4 align-top text-white/70">
                    {row.date}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        icon={FiEye}
                        label="View campaign"
                        onClick={() => onViewCampaign(row)}
                        variant="subtle"
                        className="text-white/80"
                      />
                      <IconButton
                        icon={FiEdit2}
                        label="Edit campaign"
                        onClick={() => onEditCampaign(row)}
                        variant="edit"
                      />
                      <IconButton
                        icon={FiTrash2}
                        label="Delete campaign"
                        onClick={() => onDeleteCampaign(row)}
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
            Showing Campaigns {pagedRows.length} of {filteredRows.length}
          </span>

          <SelectField
            value={perPage}
            onChange={(value) => {
              setPerPage(Number(value));
              setPage(1);
            }}
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
            onClick={() => setPage((current) => Math.max(1, current - 1))}
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
                onClick={() => setPage(item)}
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
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
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
