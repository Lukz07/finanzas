'use client';

import React, { createContext, useContext, useRef } from 'react';

interface AdSenseContextType {
  initializedSlots: Set<string>;
}

const AdSenseContext = createContext<AdSenseContextType>({ initializedSlots: new Set() });

export function AdSenseProvider({ children }: { children: React.ReactNode }) {
  const initializedSlotsRef = useRef<Set<string>>(new Set());

  return (
    <AdSenseContext.Provider value={{ initializedSlots: initializedSlotsRef.current }}>
      {children}
    </AdSenseContext.Provider>
  );
}

export const useAdSense = () => useContext(AdSenseContext); 