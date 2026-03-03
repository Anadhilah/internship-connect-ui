import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MapPin, Clock, Building2, Calendar, DollarSign, Upload, CheckCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const internshipData: Record<string, any> = {
  "1": {
    title: "Software Engineering Intern", company: "Google", location: "Mountain View, CA",
    type: "Full-time", duration: "3 months", salary: "$8,000/month",
    tags: ["React", "TypeScript", "Node.js"],
    description: "Join Google's engineering team and work on products used by billions. You'll collaborate with experienced engineers, participate in code reviews, and ship features to production.",
    requirements: ["Currently pursuing a CS degree", "Experience with JavaScript/TypeScript", "Strong problem-solving skills", "Good communication skills"],
    posted: "Feb 26, 2026",
  },
};

export default function InternshipDetails() {
  const { id } = useParams();
  const internship = internshipData[id || "1"] || internshipData["1"];
  const [applyOpen, setApplyOpen] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleApply = () => {
    // Mock submission
    setSubmitted(true);
    setTimeout(() => {
      setApplyOpen(false);
      setSubmitted(false);
      setCvFile(null);
      setCoverLetter("");
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <Link to="/student/internships" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to listings
      </Link>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold">{internship.title}</h2>
            <p className="text-muted-foreground">{internship.company}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{internship.location}</span>
        <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{internship.duration}</span>
        <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />{internship.salary}</span>
        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Posted {internship.posted}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {internship.tags.map((tag: string) => (
          <Badge key={tag} variant="secondary">{tag}</Badge>
        ))}
      </div>
      <Card className="shadow-card">
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="font-display font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{internship.description}</p>
          </div>
          <div>
            <h3 className="font-display font-semibold mb-2">Requirements</h3>
            <ul className="space-y-1.5">
              {internship.requirements.map((req: string, i: number) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
      <Button size="lg" onClick={() => setApplyOpen(true)}>Apply Now</Button>

      {/* Apply Dialog */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="max-w-md">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle className="h-12 w-12 text-success mx-auto" />
              <h3 className="text-lg font-display font-bold">Application Submitted!</h3>
              <p className="text-sm text-muted-foreground">Your CV has been sent to {internship.company}.</p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Apply for {internship.title}</DialogTitle>
                <DialogDescription>Upload your CV to apply. It will be shared with {internship.company}.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Resume / CV</Label>
                  <label
                    htmlFor="apply-cv"
                    className={cn(
                      "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all block",
                      cvFile ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}
                  >
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    {cvFile ? (
                      <p className="text-sm font-medium">{cvFile.name}</p>
                    ) : (
                      <>
                        <p className="text-sm font-medium">Upload your CV</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, DOC — max 5MB</p>
                      </>
                    )}
                    <input id="apply-cv" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setCvFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
                <div className="space-y-2">
                  <Label>Cover Letter (optional)</Label>
                  <Textarea rows={3} placeholder="Why are you interested in this role?" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setApplyOpen(false)}>Cancel</Button>
                <Button onClick={handleApply} disabled={!cvFile}>Submit Application</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
