"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { soundEngine } from "../lib/sounds";

interface SoundContextValue {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (enabled: boolean) => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabledState] = useState(false);

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    soundEngine.setEnabled(value);
  }, []);

  const toggle = useCallback(() => {
    setEnabledState((prev) => {
      const next = !prev;
      soundEngine.setEnabled(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ enabled, toggle, setEnabled }),
    [enabled, toggle, setEnabled]
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundContextValue {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within SoundProvider");
  }
  return context;
}
