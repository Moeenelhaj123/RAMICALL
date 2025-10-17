// Font Verification Component - Add this temporarily to test
// Remove after verification

export function FontVerification() {
  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg p-4 rounded-lg border z-50 text-sm">
      <h3 className="font-semibold mb-2">Font Verification</h3>
      
      {/* Tailwind Text */}
      <div className="mb-2">
        <span className="text-gray-600">Tailwind:</span>
        <div className="font-normal">Normal 400</div>
        <div className="font-medium">Medium 500</div>
        <div className="font-semibold">Semibold 600</div>
        <div className="font-bold">Bold 700</div>
      </div>

      {/* Tabular Numbers */}
      <div className="mb-2">
        <span className="text-gray-600">Numbers:</span>
        <div className="tabular-nums">1,234.56 | 987.10</div>
        <div className="">1,234.56 | 987.10</div>
      </div>

      {/* MUI Elements would go here */}
      <div>
        <span className="text-gray-600">Check DevTools:</span>
        <div className="text-xs">font-family should be Poppins</div>
        <div className="text-xs">font-weight: 400, 500, 600, 700</div>
      </div>
    </div>
  )
}