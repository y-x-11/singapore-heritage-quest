import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { parseLocationQrData } from '@heritage/shared';
import { getSiteBaseUrl } from '../lib/site';

export default function LocationScanner() {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const scanner = new Html5Qrcode('heritage-qr-reader');
    scannerRef.current = scanner;

    const onSuccess = (decodedText: string) => {
      const siteBase = getSiteBaseUrl();
      const locationId = parseLocationQrData(decodedText, siteBase);
      if (locationId) {
        scanner.stop().catch(() => {});
        navigate(`/explore/location/${locationId}`);
      } else {
        setError('Not a heritage location QR code. Try scanning a code from the Explore page.');
      }
    };

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onSuccess,
        () => {}
      )
      .then(() => setScanning(true))
      .catch(() => setError('Camera access denied. Allow camera permission and try again, or scan a printed QR with your phone camera app.'));

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center">
      <div id="heritage-qr-reader" className="w-full max-w-sm rounded-2xl overflow-hidden shadow-lg" />
      {scanning && (
        <p className="mt-4 text-sm text-navy/60 font-body text-center">
          Point your camera at a heritage location QR code
        </p>
      )}
      {error && (
        <div className="mt-4 bg-merlion/10 border border-merlion/30 rounded-xl p-4 max-w-sm">
          <p className="text-sm text-merlion font-body text-center">{error}</p>
        </div>
      )}
    </div>
  );
}
