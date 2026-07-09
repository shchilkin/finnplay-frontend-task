import { useEffect, useState } from "react";
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
  const [state, setState] = useState<CatalogState>({
    catalog: null,
    error: null,
    status: "loading",
  });

  useEffect(() => {
    let isActive = true;

    async function loadCatalog() {
      try {
        const catalog = await getCatalog();

        if (!isActive) {
          return;
        }

        setState({ catalog, error: null, status: "loaded" });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setState({
          catalog: null,
          error: error instanceof Error ? error.message : "Unable to load games.",
          status: "error",
        });
      }
    }

    void loadCatalog();

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
