import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  label?: string;
}

export default function QRCodeDisplay({ value, size = 180, label }: QRCodeDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      color: { dark: '#1D3557', light: '#FFFFFF' },
    }).then(setDataUrl);
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        className="bg-white rounded-2xl flex items-center justify-center text-navy/40 text-sm font-body"
        style={{ width: size, height: size }}
      >
        Loading QR…
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <img src={dataUrl} alt={label ? `QR code for ${label}` : 'QR code'} className="rounded-2xl shadow-md" width={size} height={size} />
      {label && <p className="text-xs text-navy/50 font-body text-center max-w-[200px]">{label}</p>}
    </div>
  );
}
