import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Clipboard, Copy, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { detectPlatform, type PlatformInfo } from '@/lib/platforms';
import axios from 'axios';

interface VideoFormat {
  quality: string;
  url: string;
  ext: string;
}

interface VideoResult {
  title: string;
  thumbnail: string | null;
  formats: VideoFormat[];
  platform: string;
  source: string;
}

type WidgetState = 'idle' | 'detecting' | 'loading' | 'success' | 'error';

interface DownloadWidgetProps {
  forcePlatform?: string;
}

const API_BASE = '/.netlify/functions';

const DownloadWidget: React.FC<DownloadWidgetProps> = ({ forcePlatform }) => {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [state, setState] = useState<WidgetState>('idle');
  const [detected, setDetected] = useState<PlatformInfo | null>(null);
  const [result, setResult] = useState<VideoResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (url.length > 10) {
      const p = detectPlatform(url);
      if (p) {
        setDetected(p);
        setState('detecting');
      }
    } else {
      setDetected(null);
      if (state === 'detecting') setState('idle');
    }
  }, [url]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch { /* clipboard not available */ }
  }, []);

  const handleDownload = useCallback(async () => {
    if (!url.trim()) {
      setError(t('error_invalid'));
      setState('error');
      return;
    }

    try {
      new URL(url);
    } catch {
      setError(t('error_invalid'));
      setState('error');
      return;
    }

    // YouTube special handling
    if (detected?.id === 'youtube' || /youtube\.com|youtu\.be/.test(url)) {
      setState('success');
      setResult({
        title: 'YouTube — Extension Required',
        thumbnail: null,
        formats: [],
        platform: 'youtube',
        source: 'extension',
      });
      return;
    }

    setState('loading');
    setError('');
    setResult(null);

    try {
      const res = await axios.post(`${API_BASE}/download`, { url }, { timeout: 15000 });
      setResult(res.data);
      setState('success');
    } catch (err: any) {
      const msg = err.response?.data?.error || t('error_failed');
      setError(msg);
      setState('error');
    }
  }, [url, detected, t]);

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setUrl('');
    setState('idle');
    setResult(null);
    setError('');
    setDetected(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input */}
      <div className="glass p-2 flex items-center gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
          placeholder={t('input_placeholder')}
          className="glass-input flex-1 px-4 py-3.5 text-sm bg-transparent border-0 backdrop-filter-none"
          style={{ backdropFilter: 'none' }}
        />
        <button onClick={handlePaste} className="glass p-3 hover:bg-foreground/5 transition-colors rounded-xl" title={t('paste_btn')}>
          <Clipboard className="w-5 h-5 text-foreground/60" />
        </button>
        <button onClick={handleDownload} className="neon-btn px-6 py-3.5 text-sm flex items-center gap-2 whitespace-nowrap" disabled={state === 'loading'}>
          <Download className="w-4 h-4" />
          {t('download_btn')}
        </button>
      </div>

      {/* Platform detection badge */}
      {detected && state === 'detecting' && (
        <div className="mt-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" style={{ color: detected.color }} />
          <span className="text-sm" style={{ color: detected.color }}>
            ✓ {detected.name} {t('detecting')}
          </span>
        </div>
      )}

      {/* Loading */}
      {state === 'loading' && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="neon-spinner" />
          <span className="text-sm text-muted-foreground animate-pulse">{t('loading_text')}</span>
        </div>
      )}

      {/* Error */}
      {state === 'error' && (
        <div className="mt-4 glass p-4 border border-neon-pink/30">
          <div className="flex items-center gap-2 text-neon-pink">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
          <button onClick={() => { setState('idle'); setError(''); }} className="mt-3 text-sm text-foreground/60 hover:text-foreground transition-colors">
            Try again
          </button>
        </div>
      )}

      {/* YouTube Extension Card */}
      {state === 'success' && result?.platform === 'youtube' && (
        <div className="mt-4 glass p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 text-xs rounded-full bg-neon-pink/20 text-neon-pink font-bold">{t('badge_extension')}</span>
          </div>
          <h3 className="font-orbitron text-lg mb-2 neon-text">{t('youtube_extension_title')}</h3>
          <p className="text-sm text-muted-foreground mb-4">{t('youtube_extension_desc')}</p>
          <div className="flex gap-3">
            <a href="https://chrome.google.com/webstore/detail/video-downloadhelper/lmjnegcaeklhafolokijcfjliaokphfk" target="_blank" rel="noopener noreferrer" className="neon-btn px-4 py-2 text-sm">
              {t('youtube_install_chrome')}
            </a>
            <a href="https://addons.mozilla.org/en-US/firefox/addon/video-downloadhelper/" target="_blank" rel="noopener noreferrer" className="glass px-4 py-2 text-sm text-foreground/80 hover:text-foreground transition-colors">
              {t('youtube_install_firefox')}
            </a>
          </div>
          <button onClick={reset} className="mt-4 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> {t('result_new_download')}
          </button>
        </div>
      )}

      {/* Success Result */}
      {state === 'success' && result && result.platform !== 'youtube' && (
        <div className="mt-4 glass p-5">
          <div className="flex gap-4">
            {result.thumbnail && (
              <img src={result.thumbnail} alt={result.title} className="w-32 h-20 object-cover rounded-xl" />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold truncate">{result.title}</h3>
              <span className="text-xs text-muted-foreground capitalize">{result.platform}</span>
            </div>
          </div>

          {/* Quality options */}
          <div className="mt-4 flex flex-wrap gap-2">
            {result.formats.map((f, i) => (
              <a
                key={i}
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="neon-btn px-4 py-2 text-sm flex items-center gap-2"
              >
                <Download className="w-3 h-3" />
                {f.quality} ({f.ext})
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center gap-3">
            {result.formats[0] && (
              <button onClick={() => handleCopyLink(result.formats[0].url)}
                className="glass px-3 py-1.5 text-xs text-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors">
                <Copy className="w-3 h-3" />
                {copied ? '✓ Copied' : t('result_copy_link')}
              </button>
            )}
            <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> {t('result_new_download')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadWidget;
