import type { CallRecord, CallDirection, CallResult, HungupBy } from "@/types/calls";

const directions: CallDirection[] = ["inbound", "outbound"];
const results: CallResult[] = ["answered", "busy", "no_answer", "hungup"];
const hungupByOptions: HungupBy[] = ["agent", "client", "system", "unknown"];

const agentNames = [
  "Majed Alnajar",
  "Rashed Alnuaimi",
  "Mahdi Alomari",
  "Tareq Global",
  "Ruba Khamis",
  "Yousef Elhaj",
];

const agentIds = ["1", "2", "3", "4", "5", "6"];

const queueNames = ["Sales", "Support", "Billing", "General"];

const generatePhoneNumber = (): string => {
  const prefixes = ["+971-50", "+971-4", "+971-55", "+971-56"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `${prefix}-${number}`;
};

export function generateMockCallHistory(count: number): CallRecord[] {
  const records: CallRecord[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const result = results[Math.floor(Math.random() * results.length)];
    const agentIdx = Math.floor(Math.random() * agentNames.length);
    
    const startAt = new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const totalDurationSec = result === "answered" 
      ? Math.floor(30 + Math.random() * 600)
      : result === "hungup"
      ? Math.floor(5 + Math.random() * 60)
      : Math.floor(5 + Math.random() * 30);
    
    const endAt = new Date(startAt.getTime() + totalDurationSec * 1000);
    
    const ringTimeSec = result === "answered" 
      ? Math.floor(2 + Math.random() * 15)
      : Math.floor(5 + Math.random() * 30);
    
    const answeredAt = result === "answered"
      ? new Date(startAt.getTime() + ringTimeSec * 1000).toISOString()
      : undefined;
    
    const talkTimeSec = result === "answered"
      ? totalDurationSec - ringTimeSec
      : undefined;
    
    const onHoldDurationSec = result === "answered" && Math.random() > 0.7
      ? Math.floor(5 + Math.random() * 60)
      : undefined;
    
    const hungupBy = result === "hungup" || result === "answered"
      ? hungupByOptions[Math.floor(Math.random() * hungupByOptions.length)]
      : undefined;

    const queueName = Math.random() > 0.3
      ? queueNames[Math.floor(Math.random() * queueNames.length)]
      : undefined;

    records.push({
      id: `call-${i + 1}`,
      direction,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      callerNumber: direction === "inbound" ? generatePhoneNumber() : `Ext ${1001 + agentIdx}`,
      calledNumber: direction === "inbound" ? `Ext ${1001 + agentIdx}` : generatePhoneNumber(),
      totalDurationSec,
      result,
      agentId: agentIds[agentIdx],
      agentName: agentNames[agentIdx],
      queueId: queueName ? `queue-${queueNames.indexOf(queueName) + 1}` : undefined,
      queueName,
      hungupBy,
      talkTimeSec,
      answeredAt,
      ringTimeSec,
      onHoldDurationSec,
      recordingUrl: result === "answered" && Math.random() > 0.5 
        ? `https://example.com/recordings/call-${i + 1}.mp3`
        : undefined,
      callId: `pbx-call-${Math.random().toString(36).substring(2, 15)}`,
    });
  }

  return records.sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());
}
