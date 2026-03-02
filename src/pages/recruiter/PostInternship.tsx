import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function PostInternship() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Internship Posted!", description: "Your internship listing is now live." });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="text-2xl font-display font-bold">Post Internship</h2>
        <p className="text-muted-foreground">Create a new internship listing.</p>
      </div>
      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Internship Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Job Title</Label><Input placeholder="e.g. Software Engineering Intern" required /></div>
              <div className="space-y-2"><Label>Location</Label><Input placeholder="e.g. Remote / New York" required /></div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent><SelectItem value="full">Full-time</SelectItem><SelectItem value="part">Part-time</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Duration</Label><Input placeholder="e.g. 3 months" /></div>
              <div className="space-y-2"><Label>Salary</Label><Input placeholder="e.g. $5,000/month" /></div>
              <div className="space-y-2"><Label>Application Deadline</Label><Input type="date" /></div>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Describe the role, responsibilities, and what interns will learn…" rows={5} required /></div>
            <div className="space-y-2"><Label>Requirements</Label><Textarea placeholder="List the skills and qualifications required…" rows={3} /></div>
            <div className="space-y-2"><Label>Tags (comma-separated)</Label><Input placeholder="React, Python, Design" /></div>
            <Button type="submit">Publish Internship</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
