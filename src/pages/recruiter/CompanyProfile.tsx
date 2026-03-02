import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function CompanyProfile() {
  const { user } = useAuth();
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="text-2xl font-display font-bold">Company Profile</h2>
        <p className="text-muted-foreground">Update your company information.</p>
      </div>
      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Company Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Company Name</Label><Input placeholder="Acme Inc." /></div>
            <div className="space-y-2"><Label>Industry</Label><Input placeholder="Technology" /></div>
            <div className="space-y-2"><Label>Website</Label><Input placeholder="https://example.com" /></div>
            <div className="space-y-2"><Label>Location</Label><Input placeholder="San Francisco, CA" /></div>
            <div className="space-y-2"><Label>Company Size</Label><Input placeholder="50-200" /></div>
            <div className="space-y-2"><Label>Contact Email</Label><Input defaultValue={user?.email} /></div>
          </div>
          <div className="space-y-2"><Label>About</Label><Textarea placeholder="Describe your company…" rows={4} /></div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
