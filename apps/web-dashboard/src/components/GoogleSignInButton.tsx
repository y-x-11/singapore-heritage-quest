interface GoogleSignInButtonProps {
  onClick: () => void;
  loading?: boolean;
  label?: string;
}

export default function GoogleSignInButton({
  onClick,
  loading = false,
  label = 'Continue with Google',
}: GoogleSignInButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 font-body font-semibold text-navy hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-60"
    >
      <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.083 36 24 36c-5.522 0-10-4.478-10-10s4.478-10 10-10c2.837 0 5.402 1.188 7.213 3.091l5.657-5.657C33.64 10.053 29.082 8 24 8 14.059 8 6 16.059 6 26s8.059 18 18 18 18-8.059 18-18c0-1.341-.148-2.651-.389-3.917z" />
        <path fill="#FF3D00" d="M6 26c0-3.314 1.343-6.314 3.517-8.483l5.657 5.657C13.188 24.598 12 26.837 12 29.5S13.188 34.402 15.174 36.326L9.517 42.017C7.343 39.686 6 36.686 6 33.5V26z" transform="translate(0 -2)" />
        <path fill="#4CAF50" d="M24 44c4.962 0 9.258-1.904 12.603-5.017l-5.657-5.657C29.402 34.402 26.837 35.5 24 35.5c-5.083 0-9.654-3.343-11.303-7.5H6.389C8.852 39.941 15.682 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a10.04 10.04 0 0 1-4.087 5.197l.003-.002 5.657 5.657C42.012 35.494 44 30.494 44 26c0-1.341-.148-2.651-.389-3.917z" />
      </svg>
      {loading ? 'Signing in…' : label}
    </button>
  );
}
