import type { ExtensionRow, ExtensionsResponse, ListQuery, ExtensionFormData, ImportResult } from '@/types/extensions';
import type { ExtensionCreateDTO } from '@/components/extensions/ExtensionDrawer';

const BASE_URL = '/api/extensions';

// Mock data and localStorage helpers for development
function getStoredExtensions(): ExtensionRow[] {
  try {
    const stored = localStorage.getItem('extensions');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to parse stored extensions:', error);
  }
  
  // Return initial mock data if no stored data
  const mockData: ExtensionRow[] = [
    {
      id: '1',
      extension: '101',
      presence: 'Available',
      callerIdName: 'John Doe',
      role: 'Agent',
      email: 'john.doe@example.com',
      mobile: '+1234567890',
      device: { sip: true, pc: false, mobile: true, web: false },
      notes: 'Sample agent',
    },
    {
      id: '2',
      extension: '102',
      presence: 'Away',
      callerIdName: 'Jane Smith',
      role: 'Supervisor',
      email: 'jane.smith@example.com',
      mobile: '+1234567891',
      device: { sip: true, pc: true, mobile: true, web: true },
      notes: 'Sample supervisor',
    },
    {
      id: '3',
      extension: '103',
      presence: 'DND',
      callerIdName: 'Mike Johnson',
      role: 'Agent',
      email: 'mike.johnson@example.com',
      mobile: '+1234567892',
      device: { sip: true, pc: true, mobile: false, web: true },
      notes: 'Senior agent',
    },
    {
      id: '4',
      extension: '104',
      presence: 'Offline',
      callerIdName: 'Sarah Wilson',
      role: 'Manager',
      email: 'sarah.wilson@example.com',
      mobile: '+1234567893',
      device: { sip: false, pc: false, mobile: false, web: false },
      notes: 'Department head',
    },
    {
      id: '5',
      extension: '105',
      presence: 'Available',
      callerIdName: 'David Brown',
      role: 'Agent',
      email: 'david.brown@example.com',
      mobile: '+1234567894',
      device: { sip: true, pc: true, mobile: true, web: false },
      notes: 'New hire',
    },
  ];
  
  // Store initial data
  localStorage.setItem('extensions', JSON.stringify(mockData));
  return mockData;
}

// Get extensions list with query parameters
export async function getExtensions(query: ListQuery = {}): Promise<ExtensionsResponse> {
  // For development - use mock API with localStorage
  return new Promise((resolve) => {
    setTimeout(() => {
      const extensions = getStoredExtensions();
      
      // Apply search filter
      let filtered = extensions;
      if (query.q) {
        const searchTerm = query.q.toLowerCase();
        filtered = extensions.filter(ext => 
          ext.extension.toLowerCase().includes(searchTerm) ||
          ext.callerIdName?.toLowerCase().includes(searchTerm) ||
          ext.role?.toLowerCase().includes(searchTerm) ||
          ext.email?.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply sorting
      if (query.sortBy && query.order) {
        filtered.sort((a, b) => {
          const aVal = a[query.sortBy!] || '';
          const bVal = b[query.sortBy!] || '';
          const comparison = aVal.toString().localeCompare(bVal.toString());
          return query.order === 'desc' ? -comparison : comparison;
        });
      }
      
      // Apply pagination
      const page = query.page || 1;
      const pageSize = query.pageSize || 50;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filtered.slice(startIndex, endIndex);
      
      resolve({
        data: paginatedData,
        meta: {
          page,
          pageSize,
          total: filtered.length,
        },
      });
    }, 300); // Simulate network delay
  });
}

// Create new extension
export async function createExtension(payload: ExtensionCreateDTO): Promise<ExtensionRow> {
  // For development - use mock API with localStorage
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Get existing extensions from localStorage
        const existing = getStoredExtensions();
        
        // Check for duplicate extension number
        if (existing.some(ext => ext.extension === payload.extension)) {
          reject(new Error('Extension already exists'));
          return;
        }
        
        // Create new extension
        const newExtension: ExtensionRow = {
          extension: payload.extension,
          presence: payload.presence || 'Available',
          callerIdName: payload.callerIdName || '',
          role: payload.role || '',
          email: payload.email || '',
          mobile: payload.mobile || '',
          device: payload.device || { sip: false, pc: false, mobile: false, web: false },
          notes: '',
        };
        
        // Add to storage
        const updated = [...existing, newExtension];
        localStorage.setItem('extensions', JSON.stringify(updated));
        
        resolve(newExtension);
      } catch (error) {
        reject(new Error('Failed to create extension'));
      }
    }, 500); // Simulate network delay
  });
}

// Update extension
export async function updateExtension(id: string, data: ExtensionFormData): Promise<ExtensionRow> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update extension: ${response.statusText}`);
  }
  
  return response.json();
}

// Delete extensions (batch)
export async function deleteExtensions(ids: string[]): Promise<void> {
  const response = await fetch(BASE_URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete extensions: ${response.statusText}`);
  }
}

// Import extensions from CSV
export async function importExtensions(file: File): Promise<ImportResult> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${BASE_URL}/import`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`Failed to import extensions: ${response.statusText}`);
  }
  
  return response.json();
}

// Export extensions to CSV
export async function exportExtensions(query: ListQuery = {}): Promise<void> {
  const params = new URLSearchParams();
  
  if (query.q) params.append('q', query.q);
  if (query.sortBy) params.append('sortBy', query.sortBy);
  if (query.order) params.append('order', query.order);

  const response = await fetch(`${BASE_URL}/export?${params}`);
  if (!response.ok) {
    throw new Error(`Failed to export extensions: ${response.statusText}`);
  }
  
  // Download the CSV file
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `extensions-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// Get user's preferred page size from localStorage
export function getPreferredPageSize(): number {
  const stored = localStorage.getItem('extensions.pageSize');
  return stored ? parseInt(stored, 10) : 20;
}

// Save user's preferred page size to localStorage
export function setPreferredPageSize(pageSize: number): void {
  localStorage.setItem('extensions.pageSize', pageSize.toString());
}