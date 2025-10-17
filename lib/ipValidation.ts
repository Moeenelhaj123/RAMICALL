export function isIPv4(str: string): boolean {
  const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = str.match(ipv4Pattern);
  if (!match) return false;
  
  return match.slice(1, 5).every(octet => {
    const num = parseInt(octet, 10);
    return num >= 0 && num <= 255;
  });
}

export function isIPv6(str: string): boolean {
  const ipv6Pattern = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|::([fF]{4}(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return ipv6Pattern.test(str);
}

export function isCIDR(str: string): boolean {
  const parts = str.split('/');
  if (parts.length !== 2) return false;
  
  const [ip, maskStr] = parts;
  const mask = parseInt(maskStr, 10);
  
  if (isIPv4(ip)) {
    return mask >= 0 && mask <= 32;
  } else if (isIPv6(ip)) {
    return mask >= 0 && mask <= 128;
  }
  
  return false;
}

export function normalizeCIDR(str: string): {
  version: 4 | 6;
  cidr: string;
  start: string;
  end: string;
} | null {
  let ip = str;
  let mask: number | null = null;
  
  if (str.includes('/')) {
    const parts = str.split('/');
    ip = parts[0];
    mask = parseInt(parts[1], 10);
  }
  
  if (isIPv4(ip)) {
    if (mask === null) mask = 32;
    if (mask < 0 || mask > 32) return null;
    
    const cidr = `${ip}/${mask}`;
    const ipNum = ipv4ToNumber(ip);
    const maskBits = (0xFFFFFFFF << (32 - mask)) >>> 0;
    const startNum = (ipNum & maskBits) >>> 0;
    const endNum = (startNum | (~maskBits >>> 0)) >>> 0;
    
    return {
      version: 4,
      cidr,
      start: numberToIPv4(startNum),
      end: numberToIPv4(endNum),
    };
  } else if (isIPv6(ip)) {
    if (mask === null) mask = 128;
    if (mask < 0 || mask > 128) return null;
    
    return {
      version: 6,
      cidr: `${ip}/${mask}`,
      start: ip,
      end: ip,
    };
  }
  
  return null;
}

function ipv4ToNumber(ip: string): number {
  const parts = ip.split('.').map(p => parseInt(p, 10));
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function numberToIPv4(num: number): string {
  return [
    (num >>> 24) & 0xFF,
    (num >>> 16) & 0xFF,
    (num >>> 8) & 0xFF,
    num & 0xFF,
  ].join('.');
}

export function validateCIDR(str: string): { valid: boolean; error?: string } {
  if (!str || !str.trim()) {
    return { valid: false, error: 'IP or CIDR is required' };
  }
  
  const trimmed = str.trim();
  
  if (trimmed.includes('/')) {
    if (!isCIDR(trimmed)) {
      return { valid: false, error: 'Invalid CIDR notation' };
    }
  } else {
    if (!isIPv4(trimmed) && !isIPv6(trimmed)) {
      return { valid: false, error: 'Invalid IP address' };
    }
  }
  
  const normalized = normalizeCIDR(trimmed);
  if (!normalized) {
    return { valid: false, error: 'Unable to normalize IP/CIDR' };
  }
  
  return { valid: true };
}

export function overlaps(cidrA: string, cidrB: string): boolean {
  const normA = normalizeCIDR(cidrA);
  const normB = normalizeCIDR(cidrB);
  
  if (!normA || !normB || normA.version !== normB.version) {
    return false;
  }
  
  if (normA.version === 4) {
    const aStart = ipv4ToNumber(normA.start);
    const aEnd = ipv4ToNumber(normA.end);
    const bStart = ipv4ToNumber(normB.start);
    const bEnd = ipv4ToNumber(normB.end);
    
    return (aStart <= bEnd && aEnd >= bStart);
  }
  
  return false;
}
