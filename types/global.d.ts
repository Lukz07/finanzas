interface Window {
  adsbygoogle: {
    push: (params: any) => void;
  }[] & {
    push: (params: any) => void;
  };
  googlefc: {
    callbackQueue: {
      push: (params: {
        CONSENT_DATA_READY?: () => void;
        USER_CONSENT_ACCEPTED?: () => void;
        USER_CONSENT_DENIED?: () => void;
      }) => void;
    };
    controlledMessaging: boolean;
    showRevocationMessage: () => void;
  };
  googletag: any;
} 