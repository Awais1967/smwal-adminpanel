import { useMemo } from "react";

export default function usePagination({ total = 0, page = 1, pageSize = 10 }) {
  const pageCount = useMemo(
    () => Math.max(1, Math.ceil((total || 0) / (pageSize || 1))),
    [total, pageSize],
  );

  const showingFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, total || 0);

  return { pageCount, showingFrom, showingTo };
}
