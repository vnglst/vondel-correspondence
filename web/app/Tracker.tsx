"use client";

import { useEffect } from "react";
import Plausible from "plausible-tracker";

const plausible = Plausible({
  domain: "vondel.koenvangilst.nl",
  apiHost: "https://plausible.koenvangilst.nl",
  trackLocalhost: true,
});

export const Tracker = () => {
  useEffect(() => {
    plausible.enableAutoPageviews();
  }, []);

  return null;
};
