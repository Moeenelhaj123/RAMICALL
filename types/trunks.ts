export type TrunkProtocol = "sip" | "iax2";
export type TrunkStatus = "up" | "down" | "unavailable";
export type TrunkAuthMode = "ip_auth" | "userpass";
export type TrunkTransport = "udp" | "tcp" | "tls";

export type Trunk = {
  id: string;
  name: string;
  protocol: TrunkProtocol;
  status: TrunkStatus;
  host?: string;
  port?: number;
  registered?: boolean;
  lastHeartbeatAt?: string;
  maxChannels?: number;
  activeChannels?: number;
  latencyMs?: number;
  packetLossPct?: number;
  asrPct?: number;
  acdSec?: number;
};

export type TrunkFormData = {
  name: string;
  protocol: TrunkProtocol;
  host: string;
  port?: number;
  active: boolean;
  authMode: TrunkAuthMode;
  username?: string;
  password?: string;
  registrar?: string;
  outboundProxy?: string;
  transport?: TrunkTransport;
  codecs?: string[];
  maxChannels?: number;
  burst?: number;
};

export type TrunksPageProps = {
  trunks: Trunk[];
  loading?: boolean;
  onCreate?: (data: Omit<Trunk, "id" | "status" | "lastHeartbeatAt"> & { auth?: any }) => Promise<void>;
  onUpdate?: (id: string, patch: Partial<Trunk> & { auth?: any }) => Promise<void>;
  onToggleActive?: (id: string, active: boolean) => Promise<void>;
  onTestFailover?: (id: string) => Promise<void>;
  onRefreshStatus?: () => Promise<void>;
};
