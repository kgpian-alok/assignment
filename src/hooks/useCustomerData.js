// src/hooks/useCustomerData.js
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "./useDebounce.js";
import DataWorker from "../worker.js?worker";

const RECORD_COUNT = 1_000; // change to 100 for testing if needed

export const useCustomerData = () => {
  const [displayedList, setDisplayedList] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const debouncedSearchTerm = useDebounce(searchTerm, 250);
  const workerRef = useRef(null);

  // Initialize the worker and data
  useEffect(() => {
    const worker = new DataWorker();
    workerRef.current = worker;

    console.log("Main: Starting worker initialization...");
    worker.postMessage({ type: "INIT", payload: { count: RECORD_COUNT } });

    worker.onmessage = (e) => {
      const { type, payload } = e.data;

      switch (type) {
        case "INIT_COMPLETE":
          console.log("Main: Worker initialization complete.");
          setIsInitializing(false);
          // Ask worker to send initial processed dataset
          worker.postMessage({
            type: "PROCESS",
            payload: {
              searchTerm: "",
              sortConfig: { key: null, direction: "asc" },
            },
          });
          break;

        case "PROGRESS":
          // Optional: show progress bar
          console.log(`Main: Generated ${payload.generated}/${payload.total}`);
          break;

        case "PROCESS_COMPLETE":
          setDisplayedList(payload.data);
          setIsProcessing(false);
          break;

        default:
          console.warn("Main: Unknown worker message", type);
      }
    };

    return () => {
      worker.terminate();
      console.log("Main: Worker terminated.");
    };
  }, []);

  // Handle search + sort
  useEffect(() => {
    if (!workerRef.current || isInitializing) return;
    setIsProcessing(true);
    workerRef.current.postMessage({
      type: "PROCESS",
      payload: { searchTerm: debouncedSearchTerm, sortConfig },
    });
  }, [debouncedSearchTerm, sortConfig, isInitializing]);

  // Sorting toggle handler
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return {
    displayedList,
    isInitializing,
    isProcessing,
    searchTerm,
    setSearchTerm,
    sortConfig,
    requestSort,
  };
};
