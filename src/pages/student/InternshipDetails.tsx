import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, Building2, Calendar, DollarSign } from "lucide-react";

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
      <Button size="lg">Apply Now</Button>
    </div>
  );
}
