import { act, renderHook } from "@testing-library/react";
import { usePagination } from "./usePagination";

it("bounds rendered items and resets the page when filters change", () => {
  const items = Array.from({ length: 101 }, (_, i) => i);
  const { result, rerender } = renderHook(
    ({ key, data }) => usePagination(data, key),
    { initialProps: { key: "wizards", data: items } },
  );
  expect(result.current.visibleItems).toHaveLength(48);
  act(() => result.current.setPage(3));
  expect(result.current.visibleItems).toEqual([96, 97, 98, 99, 100]);
  rerender({ key: "warriors", data: items });
  expect(result.current.page).toBe(1);
  act(() => result.current.setPage(99));
  rerender({ key: "warriors", data: [1, 2] });
  expect(result.current.page).toBe(1);
  expect(result.current.visibleItems).toEqual([1, 2]);
});
