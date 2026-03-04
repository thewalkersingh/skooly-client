import { useState } from "react";

export function usePagination (initialPage = 1, initialSize = 10) {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  
  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const goToPage = (p) => setPage(p);
  const reset = () => setPage(1);
  
  return { page, size, setPage, setSize, nextPage, prevPage, goToPage, reset };
}