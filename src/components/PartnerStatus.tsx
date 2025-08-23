import { Users, UserCheck, UserPlus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";
import { useInviteSystem } from "@/hooks/useInviteSystem";

interface PartnerStatusProps {
  isConnected: boolean;
  partnerName?: string;
  partnerAvatar?: string;
  lastActive?: string;
}

export function PartnerStatus({ isConnected, partnerName, partnerAvatar, lastActive }: PartnerStatusProps) {
  const { profile } = useProfile();
  const { shareInviteCode } = useInviteSystem();

  const handleShareInvite = () => {
    if (profile?.invite_code) {
      shareInviteCode(profile.invite_code);
    }
  };

  if (!isConnected) {
    return (
      <Card className="fitness-card text-center animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 rounded-full bg-muted">
            <UserPlus className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Connect Your Partner</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Share your fitness journey together
            </p>
            {profile?.invite_code && (
              <p className="text-xs text-muted-foreground mb-4 font-mono bg-muted px-2 py-1 rounded">
                Your code: {profile.invite_code}
              </p>
            )}
          </div>
          <Button onClick={handleShareInvite} className="gradient-primary" disabled={!profile?.invite_code}>
            <Share2 className="w-4 h-4 mr-2" />
            Share via WhatsApp
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="fitness-card animate-fade-in">
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={partnerAvatar} alt={partnerName} />
          <AvatarFallback className="gradient-primary text-white font-semibold">
            {partnerName?.charAt(0) || 'P'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{partnerName}</h3>
            <UserCheck className="w-4 h-4 text-success" />
          </div>
          <p className="text-sm text-muted-foreground">
            {lastActive ? `Active ${lastActive}` : 'Online now'}
          </p>
        </div>
        <div className="w-3 h-3 rounded-full bg-success animate-pulse"></div>
      </div>
    </Card>
  );
}