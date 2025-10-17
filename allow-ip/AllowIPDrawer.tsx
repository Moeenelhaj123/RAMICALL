import { useState, useEffect, useMemo } from 'react';
import {
  Drawer,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Autocomplete,
} from '@mui/material';
import { X, CheckCircle, WarningCircle, Trash } from '@phosphor-icons/react';
import { AllowedIP, IpScope } from '@/types/security';
import { validateCIDR, normalizeCIDR, overlaps } from '@/lib/ipValidation';

type AllowIPDrawerProps = {
  open: boolean;
  mode: 'create' | 'edit';
  initialData?: AllowedIP;
  existingIPs: AllowedIP[];
  onClose: () => void;
  onSave: (data: Omit<AllowedIP, 'id' | 'createdAt' | 'createdBy' | 'updatedAt'>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
};

const SCOPE_OPTIONS: IpScope[] = ['global', 'api', 'rtp', 'sip', 'admin_ui', 'webhook', 'custom'];

const SCOPE_LABELS: Record<IpScope, string> = {
  global: 'Global',
  api: 'API',
  rtp: 'RTP',
  sip: 'SIP',
  admin_ui: 'Admin UI',
  webhook: 'Webhook',
  custom: 'Custom',
};

export function AllowIPDrawer({
  open,
  mode,
  initialData,
  existingIPs,
  onClose,
  onSave,
  onDelete,
}: AllowIPDrawerProps) {
  const [cidr, setCidr] = useState('');
  const [label, setLabel] = useState('');
  const [scopes, setScopes] = useState<IpScope[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'enabled' | 'disabled'>('enabled');
  const [tagInput, setTagInput] = useState('');
  const [cidrTouched, setCidrTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setCidr(initialData.cidr);
        setLabel(initialData.label || '');
        setScopes(initialData.scopes);
        setTags(initialData.tags || []);
        setNotes(initialData.notes || '');
        setStatus(initialData.status);
      } else {
        setCidr('');
        setLabel('');
        setScopes([]);
        setTags([]);
        setNotes('');
        setStatus('enabled');
      }
      setCidrTouched(false);
    }
  }, [open, mode, initialData]);

  const cidrValidation = useMemo(() => {
    if (!cidrTouched || !cidr) return null;
    return validateCIDR(cidr);
  }, [cidr, cidrTouched]);

  const normalized = useMemo(() => {
    if (!cidrValidation?.valid) return null;
    return normalizeCIDR(cidr);
  }, [cidr, cidrValidation]);

  const overlapWarning = useMemo(() => {
    if (!normalized) return null;
    
    const overlapping = existingIPs.filter((ip) => {
      if (mode === 'edit' && initialData && ip.id === initialData.id) return false;
      return overlaps(cidr, ip.cidr);
    });

    return overlapping.length > 0 ? overlapping : null;
  }, [cidr, normalized, existingIPs, mode, initialData]);

  const isValid = cidrValidation?.valid && scopes.length > 0;

  const handleSave = async () => {
    if (!isValid) return;

    setSaving(true);
    try {
      await onSave({
        cidr: normalized?.cidr || cidr,
        label: label.trim() || undefined,
        scopes,
        tags: tags.length > 0 ? tags : undefined,
        notes: notes.trim() || undefined,
        status,
      });
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !initialData) return;
    if (!window.confirm('Are you sure you want to delete this IP entry?')) return;

    setSaving(true);
    try {
      await onDelete(initialData.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '90vw', md: '60vw', lg: '50vw' },
          maxWidth: '720px',
        },
      }}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {mode === 'create' ? 'Add Allowed IP' : 'Edit Allowed IP'}
          </h2>
          <IconButton onClick={onClose} size="small" aria-label="Close drawer">
            <X size={20} />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div>
            <TextField
              fullWidth
              label="IP Address / CIDR"
              placeholder="e.g., 203.0.113.7 or 203.0.113.0/24"
              value={cidr}
              onChange={(e) => setCidr(e.target.value)}
              onBlur={() => setCidrTouched(true)}
              error={cidrTouched && cidrValidation?.valid === false}
              helperText={
                cidrTouched && cidrValidation?.valid === false
                  ? cidrValidation.error
                  : undefined
              }
              required
              disabled={mode === 'edit'}
              inputProps={{
                'aria-label': 'IP address or CIDR notation',
                'aria-invalid': cidrTouched && cidrValidation?.valid === false,
              }}
            />
            {normalized && (
              <Alert
                severity="success"
                icon={<CheckCircle size={20} />}
                sx={{ mt: 1.5 }}
              >
                <div className="text-sm">
                  <div className="font-medium">
                    Normalized to {normalized.cidr}
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    Range: {normalized.start} – {normalized.end}
                  </div>
                </div>
              </Alert>
            )}
            {overlapWarning && (
              <Alert
                severity="warning"
                icon={<WarningCircle size={20} />}
                sx={{ mt: 1.5 }}
              >
                <div className="text-sm">
                  <div className="font-medium">Overlapping IP detected</div>
                  <div className="text-slate-600 mt-0.5">
                    This range overlaps with {overlapWarning.length} existing{' '}
                    {overlapWarning.length === 1 ? 'entry' : 'entries'}:{' '}
                    {overlapWarning.map((ip) => ip.cidr).join(', ')}
                  </div>
                </div>
              </Alert>
            )}
          </div>

          <TextField
            fullWidth
            label="Label (optional)"
            placeholder="e.g., Saudi Telecom Carrier"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            inputProps={{ 'aria-label': 'Friendly label for this IP' }}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Scopes <span className="text-red-500">*</span>
            </label>
            <Autocomplete
              multiple
              options={SCOPE_OPTIONS}
              value={scopes}
              onChange={(_, newValue) => setScopes(newValue)}
              getOptionLabel={(option) => SCOPE_LABELS[option]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select scopes..."
                  error={cidrTouched && scopes.length === 0}
                  helperText={
                    cidrTouched && scopes.length === 0
                      ? 'At least one scope is required'
                      : undefined
                  }
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={SCOPE_LABELS[option]}
                    size="small"
                  />
                ))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tags (optional)
            </label>
            <div className="flex gap-2 mb-2">
              <TextField
                size="small"
                fullWidth
                placeholder="Add tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                inputProps={{ 'aria-label': 'Add tag' }}
              />
              <Button variant="outlined" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                  />
                ))}
              </div>
            )}
          </div>

          <TextField
            fullWidth
            label="Notes (optional)"
            placeholder="Additional notes or context..."
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            inputProps={{ 'aria-label': 'Additional notes' }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={status === 'enabled'}
                onChange={(e) =>
                  setStatus(e.target.checked ? 'enabled' : 'disabled')
                }
                inputProps={{ 'aria-label': 'Enable or disable this IP' }}
              />
            }
            label={status === 'enabled' ? 'Enabled' : 'Disabled'}
          />
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div>
            {mode === 'edit' && onDelete && (
              <Tooltip title="Delete this IP entry">
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Trash size={18} />}
                  onClick={handleDelete}
                  disabled={saving}
                >
                  Delete
                </Button>
              </Tooltip>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outlined" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!isValid || saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
