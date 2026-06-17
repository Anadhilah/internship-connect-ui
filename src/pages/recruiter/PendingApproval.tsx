import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ShieldCheck, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function PendingApproval() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const check = async () => {
      const { data } = await supabase
        .from("recruiter_orgs")
        .select("status")
        .eq("owner_id", user.id)
        .maybeSingle();
      if (!cancelled && data?.status === "approved") {
        navigate("/recruiter", { replace: true });
      }
    };

    check();
    const interval = setInterval(check, 10000);

    const channel = supabase
      .channel(`recruiter-org-${user.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "recruiter_orgs", filter: `owner_id=eq.${user.id}` },
        (payload) => {
          if ((payload.new as any)?.status === "approved") {
            navigate("/recruiter", { replace: true });
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-elevated text-center">
        <CardContent className="p-8 space-y-6">
          <div className="h-16 w-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto">
            <Clock className="h-8 w-8 text-warning" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-display font-bold">Account Pending Approval</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your recruiter account has been submitted for verification. Our admin team will review your business registration details and approve your account shortly.
            </p>
          </div>
          <div className="space-y-3 text-sm text-left">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <ShieldCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Verification in Progress</p>
                <p className="text-xs text-muted-foreground">Business documents are being reviewed</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Email Notification</p>
                <p className="text-xs text-muted-foreground">You'll receive an email once approved</p>
              </div>
            </div>
          </div>
          <div className="pt-2">
            <Button variant="outline" asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
