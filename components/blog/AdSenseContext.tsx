'use client';

import React, { createContext, useContext, useRef, useState } from 'react';

interface AdSenseContextType {
  initializedSlots: Set<string>;
  isScriptLoaded: boolean;
  setScriptLoaded: (loaded: boolean) => void;
}

const AdSenseContext = createContext<AdSenseContextType>({
  initializedSlots: new Set(),
  isScriptLoaded: false,
  setScriptLoaded: () => {},
});

export function AdSenseProvider({ children }: { children: React.ReactNode }) {
  const initializedSlotsRef = useRef<Set<string>>(new Set());
  const [isScriptLoaded, setScriptLoaded] = useState(false);

  return (
    <AdSenseContext.Provider 
      value={{ 
        initializedSlots: initializedSlotsRef.current,
        isScriptLoaded,
        setScriptLoaded
      }}
    >
      {children}
    </AdSenseContext.Provider>
  );
}

export const useAdSense = () => useContext(AdSenseContext); 