import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CookieConsent: React.FC = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) {
      setVisible(true);
    }
  }, []);

  const accept = () => { localStorage.setItem('cookie-consent', 'accepted'); setVisible(false); };
  const decline = () => { localStorage.setItem('cookie-consent', 'declined'); setVisible(false); };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 glass p-4 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-2xl mx-auto">
      <p className="text-sm text-foreground/80">{t('cookie_text')}</p>
      <div className="flex gap-2">
        <button onClick={accept} className="neon-btn px-4 py-2 text-sm">{t('cookie_accept')}</button>
        <button onClick={decline} className="glass px-4 py-2 text-sm text-foreground/70 hover:text-foreground transition-colors">{t('cookie_decline')}</button>
      </div>
    </div>
  );
};

export default CookieConsent;
