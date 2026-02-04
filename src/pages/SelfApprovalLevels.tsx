import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  User, 
  Edit2, 
  Save,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { demoUsers } from '@/data/mockData';
import { mockApprovalEntitlements, getUserApprovalLevel } from '@/data/stylesData';
import { cn } from '@/lib/utils';
import { ApprovalLevel } from '@/types/styles';

export default function SelfApprovalLevels() {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, ApprovalLevel>>({});

  const approvalMatrix = {
    None: { care: false, base: false, bulk: false, garment: false },
    Bronze: { care: true, base: false, bulk: false, garment: false },
    Silver: { care: true, base: true, bulk: true, garment: false },
    Gold: { care: true, base: true, bulk: true, garment: true }
  };

  const getLevelColor = (level: ApprovalLevel) => {
    const colors: Record<ApprovalLevel, string> = {
      None: 'bg-gray-100 text-gray-700',
      Bronze: 'bg-amber-100 text-amber-700',
      Silver: 'bg-slate-200 text-slate-700',
      Gold: 'bg-yellow-100 text-yellow-700'
    };
    return colors[level];
  };

  const handleLevelChange = (userId: string, newLevel: ApprovalLevel) => {
    setPendingChanges(prev => ({ ...prev, [userId]: newLevel }));
  };

  const handleSave = (userId: string) => {
    // In a real app, this would save to the backend
    console.log('Saving level for user:', userId, pendingChanges[userId]);
    setEditingUserId(null);
    setPendingChanges(prev => {
      const { [userId]: _, ...rest } = prev;
      return rest;
    });
  };

  const getCurrentLevel = (userId: string): ApprovalLevel => {
    return pendingChanges[userId] || getUserApprovalLevel(userId);
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Self-Approval Levels</h1>
        <p className="text-muted-foreground">Configure user permissions for self-approval actions</p>
      </div>

      {/* Info Alert */}
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Approval Entitlement Matrix</AlertTitle>
        <AlertDescription>
          Users can only approve items at or below their entitlement level. The matrix below shows what each level can approve.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* User Entitlements Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">User Entitlements</CardTitle>
              <CardDescription>Manage approval levels for each user</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Approval Level</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoUsers.map((user) => {
                    const currentLevel = getCurrentLevel(user.id);
                    const isEditing = editingUserId === user.id;
                    const hasChanges = pendingChanges[user.id] !== undefined;

                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                              {user.avatar}
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role.replace('_', ' ')}</Badge>
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Select
                              value={currentLevel}
                              onValueChange={(value) => handleLevelChange(user.id, value as ApprovalLevel)}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="None">None</SelectItem>
                                <SelectItem value="Bronze">Bronze</SelectItem>
                                <SelectItem value="Silver">Silver</SelectItem>
                                <SelectItem value="Gold">Gold</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge className={getLevelColor(currentLevel)}>
                              {currentLevel}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                onClick={() => handleSave(user.id)}
                                disabled={!hasChanges}
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => {
                                  setEditingUserId(null);
                                  setPendingChanges(prev => {
                                    const { [user.id]: _, ...rest } = prev;
                                    return rest;
                                  });
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setEditingUserId(user.id)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Matrix Reference */}
        <div className="space-y-4">
          {/* Approval Matrix */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">Approval Matrix</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(['None', 'Bronze', 'Silver', 'Gold'] as ApprovalLevel[]).map((level) => (
                  <div key={level} className="space-y-2">
                    <Badge className={cn("w-full justify-center py-1", getLevelColor(level))}>
                      {level}
                    </Badge>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className={cn(
                        "flex items-center gap-1 p-1.5 rounded",
                        approvalMatrix[level].care ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-400"
                      )}>
                        {approvalMatrix[level].care ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        Care Codes
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 p-1.5 rounded",
                        approvalMatrix[level].base ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-400"
                      )}>
                        {approvalMatrix[level].base ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        Base
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 p-1.5 rounded",
                        approvalMatrix[level].bulk ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-400"
                      )}>
                        {approvalMatrix[level].bulk ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        Bulk
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 p-1.5 rounded",
                        approvalMatrix[level].garment ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-400"
                      )}>
                        {approvalMatrix[level].garment ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        Garment
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Entitlement Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(['Gold', 'Silver', 'Bronze', 'None'] as ApprovalLevel[]).map((level) => {
                const count = mockApprovalEntitlements.filter(e => e.level === level).length;
                return (
                  <div key={level} className="flex items-center justify-between">
                    <Badge className={getLevelColor(level)}>{level}</Badge>
                    <span className="text-sm font-medium">{count} user{count !== 1 ? 's' : ''}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Governance Note */}
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Governance Control</p>
                  <p>Changes to approval levels are logged for audit purposes. Gold level should be restricted to senior quality managers only.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
