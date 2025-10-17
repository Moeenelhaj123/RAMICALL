import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert } from '@mui/material';
import { UploadSimple } from '@phosphor-icons/react';

type BulkImportDialogProps = {
  open: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<{ imported: number; skipped: number; errors?: Array<{ line: number; reason: string }> }>;
};

export function BulkImportDialog({ open, onClose, onImport }: BulkImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    imported: number;
    skipped: number;
    errors?: Array<{ line: number; reason: string }>;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    try {
      const importResult = await onImport(file);
      setResult(importResult);
      if (!importResult.errors || importResult.errors.length === 0) {
        setTimeout(() => {
          onClose();
          setFile(null);
          setResult(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    if (!importing) {
      onClose();
      setFile(null);
      setResult(null);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Import IPs from CSV</DialogTitle>
      <DialogContent>
        <div className="space-y-4">
          <Alert severity="info">
            <div className="text-sm">
              <div className="font-medium mb-1">CSV Format</div>
              <div className="text-slate-600">
                Required columns: <code className="bg-slate-100 px-1 py-0.5 rounded">cidr</code>,{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded">scopes</code>,{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded">status</code>
              </div>
              <div className="text-slate-600 mt-1">
                Optional: <code className="bg-slate-100 px-1 py-0.5 rounded">label</code>,{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded">tags</code>,{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded">notes</code>
              </div>
            </div>
          </Alert>

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <UploadSimple size={32} className="text-slate-400" />
              <div className="text-sm text-slate-600">
                {file ? (
                  <span className="font-medium text-slate-900">{file.name}</span>
                ) : (
                  <>
                    <span className="text-blue-600 hover:text-blue-700">Choose a file</span> or
                    drag and drop
                  </>
                )}
              </div>
              <div className="text-xs text-slate-500">CSV files only</div>
            </label>
          </div>

          {result && (
            <Alert severity={result.errors && result.errors.length > 0 ? 'warning' : 'success'}>
              <div className="text-sm">
                <div className="font-medium">
                  Imported: {result.imported}, Skipped: {result.skipped}
                </div>
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {result.errors.slice(0, 5).map((err) => (
                      <div key={err.line} className="text-xs text-slate-600">
                        Line {err.line}: {err.reason}
                      </div>
                    ))}
                    {result.errors.length > 5 && (
                      <div className="text-xs text-slate-600">
                        ... and {result.errors.length - 5} more errors
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Alert>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={importing}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleImport}
          disabled={!file || importing}
          startIcon={<UploadSimple size={18} />}
        >
          {importing ? 'Importing...' : 'Import'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
