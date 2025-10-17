import { useState, useEffect } from "react";
import { Queue, QueueStrategy, QueueStatus, QueueHours } from "@/types/queues";
import { UserAccount } from "@/types/users";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { QueueMembersEditor } from "./QueueMembersEditor";
import { X } from "@phosphor-icons/react";

interface QueueDrawerProps {
  open: boolean;
  onClose: () => void;
  queue?: Queue;
  users: UserAccount[];
  onSave: (queue: Omit<Queue, "id" | "createdAt" | "updatedAt" | "metrics"> | Queue) => Promise<void>;
}

const strategies: { value: QueueStrategy; label: string }[] = [
  { value: "round_robin", label: "Round Robin" },
  { value: "least_recent", label: "Least Recent" },
  { value: "fewest_calls", label: "Fewest Calls" },
  { value: "ring_all", label: "Ring All" },
  { value: "linear", label: "Linear" },
  { value: "random", label: "Random" },
  { value: "skills", label: "Skills-Based" },
];

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Tokyo",
];

const languages = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];

export function QueueDrawer({ open, onClose, queue, users, onSave }: QueueDrawerProps) {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("basics");

  const [name, setName] = useState("");
  const [status, setStatus] = useState<QueueStatus>("active");
  const [strategy, setStrategy] = useState<QueueStrategy>("round_robin");
  const [priority, setPriority] = useState(0);
  const [recording, setRecording] = useState(false);
  const [callbackEnabled, setCallbackEnabled] = useState(false);
  const [members, setMembers] = useState(queue?.members || []);

  const [slaEnabled, setSlaEnabled] = useState(false);
  const [slaThreshold, setSlaThreshold] = useState(20);
  const [slaTarget, setSlaTarget] = useState(80);

  const [hoursEnabled, setHoursEnabled] = useState(false);
  const [timezone, setTimezone] = useState("UTC");
  const [hours, setHours] = useState<QueueHours>({ timezone: "UTC" });

  const [mohEnabled, setMohEnabled] = useState(false);
  const [moh, setMoh] = useState("");
  const [welcomePrompt, setWelcomePrompt] = useState("");
  const [positionPrompt, setPositionPrompt] = useState(false);
  const [etaPrompt, setEtaPrompt] = useState(false);
  const [periodicPrompt, setPeriodicPrompt] = useState(0);
  const [language, setLanguage] = useState("en");

  const [overflowEnabled, setOverflowEnabled] = useState(false);
  const [maxWaitSec, setMaxWaitSec] = useState(300);
  const [maxQueueSize, setMaxQueueSize] = useState(50);
  const [destination, setDestination] = useState<"voicemail" | "callback" | "ivr" | "external" | "queue">("voicemail");
  const [destinationRef, setDestinationRef] = useState("");

  useEffect(() => {
    if (queue) {
      setName(queue.name);
      setStatus(queue.status);
      setStrategy(queue.strategy);
      setPriority(queue.priority ?? 0);
      setRecording(queue.recording ?? false);
      setCallbackEnabled(queue.callbackEnabled ?? false);
      setMembers(queue.members);

      if (queue.sla) {
        setSlaEnabled(true);
        setSlaThreshold(queue.sla.thresholdSec);
        setSlaTarget(queue.sla.targetPct);
      }

      if (queue.hours) {
        setHoursEnabled(true);
        setTimezone(queue.hours.timezone);
        setHours(queue.hours);
      }

      if (queue.prompts) {
        if (queue.prompts.moh) {
          setMohEnabled(true);
          setMoh(queue.prompts.moh);
        }
        setWelcomePrompt(queue.prompts.welcomePrompt || "");
        setPositionPrompt(queue.prompts.positionPrompt ?? false);
        setEtaPrompt(queue.prompts.etaPrompt ?? false);
        setPeriodicPrompt(queue.prompts.periodicPromptSec ?? 0);
        setLanguage(queue.prompts.language || "en");
      }

      if (queue.overflow) {
        setOverflowEnabled(true);
        setMaxWaitSec(queue.overflow.maxWaitSec ?? 300);
        setMaxQueueSize(queue.overflow.maxQueueSize ?? 50);
        setDestination(queue.overflow.destination ?? "voicemail");
        setDestinationRef(queue.overflow.destinationRef ?? "");
      }
    } else {
      resetForm();
    }
  }, [queue, open]);

  const resetForm = () => {
    setName("");
    setStatus("active");
    setStrategy("round_robin");
    setPriority(0);
    setRecording(false);
    setCallbackEnabled(false);
    setMembers([]);
    setSlaEnabled(false);
    setHoursEnabled(false);
    setMohEnabled(false);
    setOverflowEnabled(false);
    setErrors({});
    setActiveTab("basics");
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Queue name is required";
    }

    if (status === "active" && members.length === 0) {
      newErrors.members = "At least one member is required for active queues";
    }

    if (slaEnabled) {
      if (slaThreshold < 1 || slaThreshold > 300) {
        newErrors.slaThreshold = "Threshold must be between 1 and 300 seconds";
      }
      if (slaTarget < 1 || slaTarget > 100) {
        newErrors.slaTarget = "Target must be between 1 and 100%";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const queueData: any = {
        ...(queue ? { id: queue.id } : {}),
        name: name.trim(),
        status,
        strategy,
        priority,
        recording,
        callbackEnabled,
        members,
      };

      if (slaEnabled) {
        queueData.sla = {
          thresholdSec: slaThreshold,
          targetPct: slaTarget,
        };
      }

      if (hoursEnabled) {
        queueData.hours = {
          ...hours,
          timezone,
        };
      }

      if (mohEnabled || welcomePrompt || positionPrompt || etaPrompt || periodicPrompt > 0) {
        queueData.prompts = {
          ...(mohEnabled && moh ? { moh } : {}),
          ...(welcomePrompt ? { welcomePrompt } : {}),
          positionPrompt,
          etaPrompt,
          ...(periodicPrompt > 0 ? { periodicPromptSec: periodicPrompt } : {}),
          language,
        };
      }

      if (overflowEnabled) {
        queueData.overflow = {
          maxWaitSec,
          maxQueueSize,
          destination,
          destinationRef: destinationRef || undefined,
        };
      }

      await onSave(queueData);
      onClose();
      resetForm();
    } catch (error) {
      console.error("Failed to save queue:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateHours = (day: keyof Omit<QueueHours, "timezone" | "holidays">, field: "open" | "close", value: string) => {
    setHours((prev) => ({
      ...prev,
      [day]: prev[day] ? { ...prev[day], [field]: value } : { open: "", close: "" },
    }));
  };

  const toggleDay = (day: keyof Omit<QueueHours, "timezone" | "holidays">) => {
    setHours((prev) => ({
      ...prev,
      [day]: prev[day] ? null : { open: "09:00", close: "17:00" },
    }));
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[90vw] md:w-[60vw] lg:w-[50vw] max-w-[880px] p-0 overflow-y-auto"
      >
        <SheetHeader className="sticky top-0 z-20 bg-[#111827] px-6 py-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold text-white">
              {queue ? "Edit Queue" : "Add Queue"}
            </SheetTitle>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={20} weight="bold" />
            </button>
          </div>
        </SheetHeader>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="sla">SLA</TabsTrigger>
              <TabsTrigger value="hours">Hours</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-900">
                    Queue Name *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter queue name"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status" className="text-sm font-semibold text-slate-900">
                      Status
                    </Label>
                    <Select value={status} onValueChange={(v) => setStatus(v as QueueStatus)}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority" className="text-sm font-semibold text-slate-900">
                      Priority
                    </Label>
                    <Input
                      id="priority"
                      type="number"
                      min="0"
                      value={priority}
                      onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="strategy" className="text-sm font-semibold text-slate-900">
                    Routing Strategy *
                  </Label>
                  <Select value={strategy} onValueChange={(v) => setStrategy(v as QueueStrategy)}>
                    <SelectTrigger id="strategy">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {strategies.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-semibold text-slate-900">Call Recording</Label>
                      <p className="text-xs text-slate-500 mt-1">
                        Record all calls in this queue
                      </p>
                    </div>
                    <Switch checked={recording} onCheckedChange={setRecording} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-semibold text-slate-900">Callback</Label>
                      <p className="text-xs text-slate-500 mt-1">
                        Offer callers the option to receive a callback
                      </p>
                    </div>
                    <Switch checked={callbackEnabled} onCheckedChange={setCallbackEnabled} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              {errors.members && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  {errors.members}
                </div>
              )}
              <QueueMembersEditor members={members} availableUsers={users} onChange={setMembers} />
            </TabsContent>

            <TabsContent value="sla" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-slate-900">Enable SLA Tracking</Label>
                  <p className="text-xs text-slate-500 mt-1">
                    Monitor service level agreement metrics
                  </p>
                </div>
                <Switch checked={slaEnabled} onCheckedChange={setSlaEnabled} />
              </div>

              {slaEnabled && (
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <Label htmlFor="slaThreshold" className="text-sm font-semibold text-slate-900">
                      Answer Threshold (seconds)
                    </Label>
                    <Input
                      id="slaThreshold"
                      type="number"
                      min="1"
                      max="300"
                      value={slaThreshold}
                      onChange={(e) => setSlaThreshold(parseInt(e.target.value) || 20)}
                      className={errors.slaThreshold ? "border-destructive" : ""}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Calls should be answered within this many seconds
                    </p>
                    {errors.slaThreshold && (
                      <p className="text-xs text-destructive mt-1">{errors.slaThreshold}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="slaTarget" className="text-sm font-semibold text-slate-900">
                      Target Percentage (%)
                    </Label>
                    <Input
                      id="slaTarget"
                      type="number"
                      min="1"
                      max="100"
                      value={slaTarget}
                      onChange={(e) => setSlaTarget(parseInt(e.target.value) || 80)}
                      className={errors.slaTarget ? "border-destructive" : ""}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Target percentage of calls meeting the threshold
                    </p>
                    {errors.slaTarget && (
                      <p className="text-xs text-destructive mt-1">{errors.slaTarget}</p>
                    )}
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>SLA Target:</strong> {slaTarget}% of calls answered within {slaThreshold}s
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="hours" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-slate-900">Enable Business Hours</Label>
                  <p className="text-xs text-slate-500 mt-1">
                    Define when this queue is available
                  </p>
                </div>
                <Switch checked={hoursEnabled} onCheckedChange={setHoursEnabled} />
              </div>

              {hoursEnabled && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="timezone" className="text-sm font-semibold text-slate-900">
                      Timezone
                    </Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    {(["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const).map((day) => (
                      <div key={day} className="flex items-center gap-3">
                        <Switch
                          checked={!!hours[day]}
                          onCheckedChange={() => toggleDay(day)}
                          className="shrink-0"
                        />
                        <Label className="w-16 text-sm capitalize">{day}</Label>
                        {hours[day] && (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              type="time"
                              value={hours[day]?.open || ""}
                              onChange={(e) => updateHours(day, "open", e.target.value)}
                              className="flex-1"
                            />
                            <span className="text-slate-500">to</span>
                            <Input
                              type="time"
                              value={hours[day]?.close || ""}
                              onChange={(e) => updateHours(day, "close", e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Prompts & Messages</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="welcomePrompt" className="text-sm font-semibold text-slate-900">
                      Welcome Prompt
                    </Label>
                    <Input
                      id="welcomePrompt"
                      value={welcomePrompt}
                      onChange={(e) => setWelcomePrompt(e.target.value)}
                      placeholder="Prompt ID or URL"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-semibold text-slate-900">Music on Hold</Label>
                    </div>
                    <Switch checked={mohEnabled} onCheckedChange={setMohEnabled} />
                  </div>

                  {mohEnabled && (
                    <Input
                      value={moh}
                      onChange={(e) => setMoh(e.target.value)}
                      placeholder="MOH ID or URL"
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Announce position in queue</Label>
                    <Switch checked={positionPrompt} onCheckedChange={setPositionPrompt} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Announce estimated wait time</Label>
                    <Switch checked={etaPrompt} onCheckedChange={setEtaPrompt} />
                  </div>

                  <div>
                    <Label htmlFor="periodicPrompt" className="text-sm font-semibold text-slate-900">
                      Periodic Announcement (seconds)
                    </Label>
                    <Input
                      id="periodicPrompt"
                      type="number"
                      min="0"
                      step="5"
                      value={periodicPrompt}
                      onChange={(e) => setPeriodicPrompt(parseInt(e.target.value) || 0)}
                      placeholder="0 = disabled"
                    />
                  </div>

                  <div>
                    <Label htmlFor="language" className="text-sm font-semibold text-slate-900">
                      Language
                    </Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Overflow Handling</h3>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-900">Enable Overflow</Label>
                    <p className="text-xs text-slate-500 mt-1">
                      Route calls when queue is full or wait time exceeds limit
                    </p>
                  </div>
                  <Switch checked={overflowEnabled} onCheckedChange={setOverflowEnabled} />
                </div>

                {overflowEnabled && (
                  <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="maxWaitSec" className="text-sm">
                          Max Wait (sec)
                        </Label>
                        <Input
                          id="maxWaitSec"
                          type="number"
                          min="0"
                          value={maxWaitSec}
                          onChange={(e) => setMaxWaitSec(parseInt(e.target.value) || 300)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxQueueSize" className="text-sm">
                          Max Queue Size
                        </Label>
                        <Input
                          id="maxQueueSize"
                          type="number"
                          min="0"
                          value={maxQueueSize}
                          onChange={(e) => setMaxQueueSize(parseInt(e.target.value) || 50)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="destination" className="text-sm">
                        Destination
                      </Label>
                      <Select value={destination} onValueChange={(v: any) => setDestination(v)}>
                        <SelectTrigger id="destination">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="voicemail">Voicemail</SelectItem>
                          <SelectItem value="callback">Callback</SelectItem>
                          <SelectItem value="ivr">IVR</SelectItem>
                          <SelectItem value="external">External</SelectItem>
                          <SelectItem value="queue">Another Queue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="destinationRef" className="text-sm">
                        Destination Reference
                      </Label>
                      <Input
                        id="destinationRef"
                        value={destinationRef}
                        onChange={(e) => setDestinationRef(e.target.value)}
                        placeholder="Extension, Queue ID, or phone number"
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : queue ? "Update Queue" : "Create Queue"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
