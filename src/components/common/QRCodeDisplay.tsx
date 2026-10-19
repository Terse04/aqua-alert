import React, { useState } from 'react';
import { QrCode, Download, Printer, Copy, Check, ExternalLink } from 'lucide-react';

interface QRCodeDisplayProps {
  customUrl?: string;
  title?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  customUrl,
  title = 'AquaAlert Community QR Access',
}) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = customUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://aquaalert-wagholi.web.app');

  // Generate a standard high-quality QR code image via free public API (api.qrserver.com or quickchart)
  // encoded with current URL, with print stylesheet support
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    currentUrl
  )}&margin=10&color=10-59-84`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm max-w-md mx-auto text-center">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E9F8F7] text-[#087EBC] flex items-center justify-center mb-4">
        <QrCode className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold text-[#103B54] mb-1">{title}</h3>
      <p className="text-xs text-gray-500 mb-5">
        Scan with any mobile camera during community field campaigns in Wagholi to report leaks & calculate water usage.
      </p>

      {/* QR Code Container */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-inner inline-block mx-auto mb-4 print:border-none">
        <img
          src={qrImageUrl}
          alt={`QR Code for ${currentUrl}`}
          className="w-48 h-48 mx-auto object-contain rounded-lg"
          loading="lazy"
        />
      </div>

      <div className="text-xs font-mono text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100 mb-5 break-all flex items-center justify-between gap-2">
        <span className="truncate">{currentUrl}</span>
        <button
          onClick={handleCopy}
          type="button"
          className="p-1 hover:text-[#087EBC] transition-colors"
          title="Copy URL"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 text-xs font-medium">
        <a
          href={qrImageUrl}
          download="AquaAlert-Wagholi-QRCode.png"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-[#103B54] rounded-xl transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Save Image</span>
        </a>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#087EBC] hover:bg-[#103B54] text-white rounded-xl transition-colors shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Poster</span>
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-1 text-[11px] text-gray-400">
        <span>Second Year IT CEP Initiative • Wagholi</span>
        <ExternalLink className="w-3 h-3" />
      </div>
    </div>
  );
};
