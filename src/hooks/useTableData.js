import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useDebounce from "./useDebounce";

/**
 * Standard list API response expected:
 *   { items: [], total: number }
 *
 * fetcher signature:
 *   fetcher({ page, pageSize, search, filters }) => Promise<{ items, total }>
 *
 * This hook provides:
 * - debounced search
 * - server-side pagination
 * - "lazy" refetch on param changes
 * - consistent loading + error
 */
export default function useTableData({
  fetcher,
  initialPageSize = 6,
  initialFilters = {},
  initialSearch = "",
  enabled = true,
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState(initialFilters);

  const debouncedSearch = useDebounce(search, 350);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  const reqId = useRef(0);

  const params = useMemo(
    () => ({
      page,
      pageSize,
      search: debouncedSearch,
      filters,
    }),
    [page, pageSize, debouncedSearch, filters],
  );

  const refresh = useCallback(async () => {
    if (!enabled || !fetcher) return;

    const id = ++reqId.current;
    setLoading(true);
    setError(null);

    try {
      const res = await fetcher({
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
        filters: params.filters,
      });

      if (id !== reqId.current) return; // ignore stale response
      setItems(res?.items || []);
      setTotal(res?.total ?? 0);
    } catch (e) {
      if (id !== reqId.current) return;
      setError(e);
      setItems([]);
      setTotal(0);
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }, [
    enabled,
    fetcher,
    params.page,
    params.pageSize,
    params.search,
    params.filters,
  ]);

  // reset page if filters/search change
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, JSON.stringify(filters)]);

  // fetch on param changes
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    // state
    loading,
    error,
    items,
    total,

    // controls
    page,
    pageSize,
    setPage,
    setPageSize,

    search,
    setSearch,

    filters,
    setFilters,

    refresh,
  };
}
