import { useState, useMemo } from "react";
import { QueueMember } from "@/types/queues";
import { UserAccount } from "@/types/users";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MagnifyingGlass, Plus, Trash, User } from "@phosphor-icons/react";
import { Label } from "@/components/ui/label";

interface QueueMembersEditorProps {
  members: QueueMember[];
  availableUsers: UserAccount[];
  onChange: (members: QueueMember[]) => void;
}

export function QueueMembersEditor({ members, availableUsers, onChange }: QueueMembersEditorProps) {
  const [search, setSearch] = useState("");
  const [newSkill, setNewSkill] = useState<Record<string, string>>({});

  const availableToAdd = useMemo(() => {
    const memberIds = new Set(members.map(m => m.userId));
    return availableUsers.filter(u => !memberIds.has(u.id) && 
      (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    );
  }, [availableUsers, members, search]);

  const currentMembers = useMemo(() => {
    return members.map(m => ({
      ...m,
      user: availableUsers.find(u => u.id === m.userId)!
    })).filter(m => m.user);
  }, [members, availableUsers]);

  const addMember = (userId: string) => {
    onChange([...members, {
      userId,
      penalty: 0,
      skills: [],
      wrapUpSec: 30,
      loginMode: "dynamic"
    }]);
  };

  const removeMember = (userId: string) => {
    onChange(members.filter(m => m.userId !== userId));
  };

  const updateMember = (userId: string, updates: Partial<QueueMember>) => {
    onChange(members.map(m => m.userId === userId ? { ...m, ...updates } : m));
  };

  const addSkill = (userId: string) => {
    const skill = newSkill[userId]?.trim();
    if (!skill) return;
    
    const member = members.find(m => m.userId === userId);
    if (!member) return;
    
    const skills = [...(member.skills || []), skill];
    updateMember(userId, { skills });
    setNewSkill({ ...newSkill, [userId]: "" });
  };

  const removeSkill = (userId: string, skillToRemove: string) => {
    const member = members.find(m => m.userId === userId);
    if (!member) return;
    
    const skills = (member.skills || []).filter(s => s !== skillToRemove);
    updateMember(userId, { skills });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-slate-900">Available Users</Label>
            <span className="text-xs text-slate-500">{availableToAdd.length} available</span>
          </div>
          
          <div className="relative">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto">
              {availableToAdd.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  {search ? "No users found" : "All users assigned"}
                </div>
              ) : (
                availableToAdd.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        <User size={16} weight="bold" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">{user.name}</div>
                      <div className="text-xs text-slate-500 truncate">{user.email}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => addMember(user.id)}
                      className="shrink-0"
                    >
                      <Plus size={16} weight="bold" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-slate-900">Queue Members</Label>
            <span className="text-xs text-slate-500">{currentMembers.length} assigned</span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="max-h-[380px] overflow-y-auto">
              {currentMembers.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No members assigned
                </div>
              ) : (
                currentMembers.map((member) => (
                  <div key={member.userId} className="p-4 border-b border-slate-100 last:border-0 space-y-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={member.user.avatarUrl} alt={member.user.name} />
                        <AvatarFallback className="text-xs">
                          <User size={16} weight="bold" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">{member.user.name}</div>
                        <div className="text-xs text-slate-500 truncate">{member.user.email}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeMember(member.userId)}
                        className="shrink-0 text-slate-400 hover:text-destructive"
                      >
                        <Trash size={16} weight="bold" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-slate-600">Penalty</Label>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={member.penalty ?? 0}
                          onChange={(e) => updateMember(member.userId, { penalty: parseInt(e.target.value) || 0 })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600">Wrap-Up (sec)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="600"
                          value={member.wrapUpSec ?? 30}
                          onChange={(e) => updateMember(member.userId, { wrapUpSec: parseInt(e.target.value) || 30 })}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-slate-600">Login Mode</Label>
                      <Select
                        value={member.loginMode ?? "dynamic"}
                        onValueChange={(value) => updateMember(member.userId, { loginMode: value as "dynamic" | "static" })}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dynamic">Dynamic</SelectItem>
                          <SelectItem value="static">Static</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs text-slate-600 mb-2 block">Skills</Label>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {(member.skills || []).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs gap-1">
                            {skill}
                            <button
                              onClick={() => removeSkill(member.userId, skill)}
                              className="ml-1 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <Input
                          placeholder="Add skill..."
                          value={newSkill[member.userId] || ""}
                          onChange={(e) => setNewSkill({ ...newSkill, [member.userId]: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && addSkill(member.userId)}
                          className="h-8 text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addSkill(member.userId)}
                          className="shrink-0 h-8"
                        >
                          <Plus size={14} weight="bold" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
