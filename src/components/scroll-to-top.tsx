"use client";

import { useLayoutEffect } from "react";

export function ScrollToTop() {
  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);

  return null;
}
