import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash, Warning } from '@phosphor-icons/react';
import type { ExtensionRow } from '@/types/extensions';

interface DeleteConfirmProps {
  open: boolean;
  extensions: ExtensionRow[];
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirm({
  open,
  extensions,
  loading,
  onClose,
  onConfirm,
}: DeleteConfirmProps) {
  const isMultiple = extensions.length > 1;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            <Trash size={20} className="text-red-500" />
            <span>
              Delete {isMultiple ? 'Extensions' : 'Extension'}
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isMultiple ? (
              <>
                You are about to delete <strong>{extensions.length} extensions</strong>. 
                This action cannot be undone.
              </>
            ) : (
              <>
                You are about to delete extension{' '}
                <strong>{extensions[0]?.extension} ({extensions[0]?.callerIdName})</strong>.
                This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <Alert className="border-amber-200 bg-amber-50">
            <Warning size={16} className="text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Warning:</strong> Deleting extensions will:
              <ul className="mt-2 ml-4 space-y-1 text-sm list-disc">
                <li>Remove all extension configurations</li>
                <li>Disconnect any active devices</li>
                <li>Remove call history associations</li>
                {isMultiple && <li>Affect multiple users simultaneously</li>}
              </ul>
            </AlertDescription>
          </Alert>

          {extensions.length > 0 && (
            <div className="max-h-32 overflow-y-auto">
              <div className="text-sm font-medium text-gray-900 mb-2">
                Extensions to be deleted:
              </div>
              <div className="space-y-2">
                {extensions.slice(0, 5).map((ext) => (
                  <div
                    key={ext.extension}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                  >
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="font-mono">
                        {ext.extension}
                      </Badge>
                      <span className="text-sm font-medium">{ext.callerIdName}</span>
                    </div>
                    {ext.role && (
                      <Badge variant="outline" className="text-xs">
                        {ext.role}
                      </Badge>
                    )}
                  </div>
                ))}
                {extensions.length > 5 && (
                  <div className="text-sm text-gray-500 text-center py-2">
                    ... and {extensions.length - 5} more extensions
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Deleting...</span>
              </div>
            ) : (
              <>Delete {isMultiple ? `${extensions.length} Extensions` : 'Extension'}</>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}