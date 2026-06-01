export function normalizeListResponse(response, fallbackItems = []) {
  if (Array.isArray(response)) {
    return {
      items: response,
      total: response.length,
      page: 1,
      pageSize: response.length,
    };
  }

  const data = response && typeof response === "object" ? response : {};
  const items = Array.isArray(data.items)
    ? data.items
    : Array.isArray(data.data)
      ? data.data
      : Array.isArray(data.results)
        ? data.results
        : fallbackItems;

  return {
    items,
    total: Number(data.total ?? data.count ?? items.length) || 0,
    page: Number(data.page ?? 1) || 1,
    pageSize: Number(data.pageSize ?? data.limit ?? items.length) || 0,
  };
}

export function flattenTableParams(params = {}) {
  const { filters, ...rest } = params || {};
  const flat = { ...rest, ...(filters || {}) };

  Object.keys(flat).forEach((key) => {
    if (
      flat[key] === "" ||
      flat[key] == null ||
      flat[key] === "All" ||
      flat[key] === "all"
    ) {
      delete flat[key];
    }
  });

  return flat;
}

export function getErrorMessage(error, fallback = "Something went wrong.") {
  return error?.message || fallback;
}
