import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2 } from 'lucide-react';
import { useInviteSystem } from '@/hooks/useInviteSystem';

export function ConnectPartnerForm() {
  const [inviteCode, setInviteCode] = useState('');
  const { connectPartner, loading } = useInviteSystem();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    
    const success = await connectPartner(inviteCode);
    if (success) {
      setInviteCode('');
    }
  };

  return (
    <Card className="fitness-card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Connect with Partner</h3>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="partnerCode">Partner's Invite Code</Label>
          <Input
            id="partnerCode"
            type="text"
            placeholder="Enter their invite code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            className="uppercase"
            disabled={loading}
          />
        </div>
        
        <Button type="submit" disabled={!inviteCode.trim() || loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            'Connect Partner'
          )}
        </Button>
      </form>
    </Card>
  );
}