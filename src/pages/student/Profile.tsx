import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Upload } from "lucide-react";

export default function StudentProfile() {
  const { user } = useAuth();
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="text-2xl font-display font-bold">My Profile</h2>
        <p className="text-muted-foreground">Update your personal information and CV.</p>
      </div>
      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Personal Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue={user?.name} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={user?.email} type="email" />
            </div>
            <div className="space-y-2">
              <Label>University</Label>
              <Input placeholder="e.g. MIT" />
            </div>
            <div className="space-y-2">
              <Label>Major</Label>
              <Input placeholder="e.g. Computer Science" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea placeholder="Tell recruiters about yourself…" rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Upload CV</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
              <p className="text-xs text-muted-foreground">PDF, DOC up to 5MB</p>
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
