import React, { useState, useEffect } from "react";
import { Stack } from "../../utils/stack/Stack";

const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debouncedValue;
};

const BrowserNavigationHistory = () => {
  const [currentPage, setCurrentPage] = useState<string>("");
  const [history, setHistory] = useState(new Stack<string>());
  const [forwardHistory, setForwardHistory] = useState(new Stack<string>());
  const [search, setSearch] = useState<string>("");

  const debouncedSearch = useDebounce(search, 300);

  const isSearchDisabled = debouncedSearch === currentPage;

  const visitPage = (url: string): void => {
    if (url !== currentPage) {
      setCurrentPage(url);
      history.push(url);
      setForwardHistory(new Stack<string>());
    }
  };

  const goBack = (): void => {
    if (!history.isEmpty()) {
      const previousPage = history.pop();
      if (previousPage) {
        forwardHistory.push(currentPage);
        setCurrentPage(previousPage);
      }
    }
  };

  const goForward = (): void => {
    if (!forwardHistory.isEmpty()) {
      const nextPage = forwardHistory.pop();
      if (nextPage) {
        history.push(currentPage);
        setCurrentPage(nextPage);
      }
    }
  };

  const handleSearch = (): void => {
    visitPage(search);
    setSearch("");
  };

  return (
    <div>
      <h1>Current Page: {currentPage || "No page visited"}</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={handleSearch} disabled={isSearchDisabled}>
        Visit Page
      </button>
      <nav>
        <button onClick={goBack} disabled={history.isEmpty()}>
          Back
        </button>
        <button onClick={goForward} disabled={forwardHistory.isEmpty()}>
          Forward
        </button>
      </nav>
    </div>
  );
};

export default BrowserNavigationHistory;
