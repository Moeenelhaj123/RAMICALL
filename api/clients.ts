export type PhoneHit = {
  number: string;
  display?: string;
  name?: string;
  label?: string;
  lastCallAt?: string;
  callsCount?: number;
};

export async function searchClientsByPhone(query: string): Promise<PhoneHit[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const mockData: PhoneHit[] = [
    { number: '+971501234567', display: '+971 50 123 4567', name: 'Majed Alnajar', label: 'Mobile', lastCallAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), callsCount: 42 },
    { number: '+971509876543', display: '+971 50 987 6543', name: 'Rashed Alnuaimi', label: 'Work', lastCallAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), callsCount: 28 },
    { number: '+971502345678', display: '+971 50 234 5678', name: 'Mahdi Alomari', label: 'Mobile', lastCallAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), callsCount: 15 },
    { number: '+971503456789', display: '+971 50 345 6789', name: 'Tareq Global', label: 'Work', lastCallAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), callsCount: 8 },
    { number: '+971504567890', display: '+971 50 456 7890', name: 'Ruba Khamis', label: 'Mobile', lastCallAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), callsCount: 19 },
    { number: '+971505678901', display: '+971 50 567 8901', name: 'Yousef Elhaj', label: 'Work', lastCallAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), callsCount: 6 },
    { number: '+97145551234', display: '+971 4 555 1234', name: 'ABC Corporation', label: 'Office', lastCallAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), callsCount: 156 },
    { number: '+97145559876', display: '+971 4 555 9876', name: 'XYZ Trading LLC', label: 'Main Line', lastCallAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), callsCount: 89 },
  ];

  const normalizedQuery = query.replace(/[^\d+]/g, '');
  
  return mockData.filter(hit => 
    hit.number.includes(normalizedQuery) || 
    hit.display?.toLowerCase().includes(query.toLowerCase()) ||
    hit.name?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10);
}

export function toNumberHistoryRoute(num: string): string {
  const params = new URLSearchParams({ number: num });
  return `/call-history?${params.toString()}`;
}
