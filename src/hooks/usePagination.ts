"use client";

import { useState } from "react";

export const usePagination = <T>(
  items: T[],
  resetKey: string,
  pageSize = 48,
) => {
  const [selection, setSelection] = useState({ key: resetKey, page: 1 });
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page =
    selection.key === resetKey ? Math.min(selection.page, pageCount) : 1;
  const setPage = (next: number) =>
    setSelection({
      key: resetKey,
      page: Math.max(1, Math.min(next, pageCount)),
    });
  return {
    visibleItems: items.slice((page - 1) * pageSize, page * pageSize),
    page,
    pageCount,
    setPage,
  };
};
