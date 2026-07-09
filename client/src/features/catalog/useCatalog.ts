import { useCallback, useEffect, useRef, useState } from "react";
import type { CatalogResponse } from "@finnplay-test-task/shared";

import { getCatalog } from "./api";

type CatalogState =
  | {
      catalog: CatalogResponse;
      error: null;
      status: "loaded";
    }
  | {
      catalog: null;
      error: null;
      status: "loading";
    }
  | {
      catalog: null;
      error: string;
      status: "error";
    };

export function useCatalog() {
  const isMountedRef = useRef(false);
  const requestIdRef = useRef(0);
  const [state, setState] = useState<CatalogState>({
    catalog: null,
    error: null,
    status: "loading",
  });

  const loadCatalog = useCallback(async () => {
    const requestId = requestIdRef.current + 1;

    requestIdRef.current = requestId;
    setState({ catalog: null, error: null, status: "loading" });

    try {
      const catalog = await getCatalog();

      if (!isMountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      setState({ catalog, error: null, status: "loaded" });
    } catch (error) {
      if (!isMountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      setState({
        catalog: null,
        error: error instanceof Error ? error.message : "Unable to load games.",
        status: "error",
      });
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void loadCatalog();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadCatalog]);

  return { ...state, reload: loadCatalog };
}
