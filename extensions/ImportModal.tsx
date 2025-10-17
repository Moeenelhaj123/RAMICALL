import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Download,
  Warning 
} from '@phosphor-icons/react';
import type { ImportResult } from '@/types/extensions';

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<ImportResult>;
}

export function ImportModal({ open, onClose, onImport }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    if (!importing) {
      setFile(null);
      setResult(null);
      onClose();
    }
  };

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileSelect(selectedFile);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    try {
      const importResult = await onImport(file);
      setResult(importResult);
    } catch (error) {
      console.error('Import failed:', error);
      setResult({
        jobId: 'error',
        summary: {
          total: 0,
          imported: 0,
          failed: 0,
        },
      });
    } finally {
      setImporting(false);
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      ['Extension', 'CallerIdName', 'Role', 'Email', 'Mobile', 'Presence', 'SIP', 'PC', 'Mobile Device', 'Web', 'Notes'],
      ['100', 'John Doe', 'Agent', 'john.doe@example.com', '+1234567890', 'Available', 'true', 'false', 'true', 'false', 'Sample agent'],
      ['101', 'Jane Smith', 'Supervisor', 'jane.smith@example.com', '+1234567891', 'Available', 'true', 'true', 'true', 'true', 'Sample supervisor'],
    ];

    const csvContent = sampleData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extensions_sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getProgressValue = () => {
    if (!result) return 0;
    return result.summary.total > 0 ? (result.summary.imported / result.summary.total) * 100 : 0;
  };

  const renderFileUpload = () => (
    <div className="space-y-4">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${file ? 'border-green-400 bg-green-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <FileText size={24} />
            <span className="font-medium">{file.name}</span>
            <span className="text-sm text-gray-500">
              ({(file.size / 1024).toFixed(1)} KB)
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload size={32} className="mx-auto text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Drop your CSV file here, or{' '}
                <button
                  type="button"
                  onClick={handleBrowseClick}
                  className="text-blue-600 hover:text-blue-500"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Only CSV files are accepted
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={downloadSampleCSV}
          className="text-blue-600 hover:text-blue-500 p-0 h-auto"
        >
          <Download size={16} className="mr-1" />
          Download Sample CSV
        </Button>
        
        {file && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setFile(null)}
            className="text-gray-600 hover:text-gray-500 p-0 h-auto"
          >
            Remove File
          </Button>
        )}
      </div>
    </div>
  );

  const renderImportProgress = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Importing extensions...</p>
      </div>
      <Progress value={33} className="w-full" />
    </div>
  );

  const renderImportResult = () => {
    if (!result) return null;

    return (
      <div className="space-y-4">
        <div className={`flex items-center space-x-2 ${result.summary.failed === 0 ? 'text-green-600' : 'text-red-600'}`}>
          {result.summary.failed === 0 ? (
            <CheckCircle size={24} />
          ) : (
            <XCircle size={24} />
          )}
          <div>
            <p className="font-medium">
              {result.summary.failed === 0 ? 'Import Successful' : 'Import Completed with Errors'}
            </p>
            <p className="text-sm text-gray-600">
              {result.summary.failed === 0 
                ? 'All records imported successfully' 
                : `${result.summary.imported} imported, ${result.summary.failed} failed`
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Total Records</div>
            <div className="text-lg font-semibold">{result.summary.total}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Imported</div>
            <div className="text-lg font-semibold text-green-600">{result.summary.imported}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Failed</div>
            <div className="text-lg font-semibold text-red-600">{result.summary.failed}</div>
          </div>
        </div>

        {result.summary.failed > 0 && (
          <Alert>
            <Warning size={16} />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Import Warnings:</p>
                <p className="text-sm text-gray-600">
                  {result.summary.failed} record(s) failed to import. Please check the file format and data validity.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Progress 
          value={getProgressValue()} 
          className="w-full"
        />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Extensions</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple extensions at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {importing && renderImportProgress()}
          {result && renderImportResult()}
          {!importing && !result && renderFileUpload()}

          <div className="flex items-center justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={importing}
            >
              {result ? 'Close' : 'Cancel'}
            </Button>
            
            {!result && (
              <Button
                onClick={handleImport}
                disabled={!file || importing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {importing ? 'Importing...' : 'Import'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}