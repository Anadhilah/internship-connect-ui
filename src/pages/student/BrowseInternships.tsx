import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const internships = [
  { id: "1", title: "Software Engineering Intern", company: "Google", location: "Mountain View, CA", type: "Full-time", duration: "3 months", tags: ["React", "TypeScript", "Node.js"], posted: "2 days ago" },
  { id: "2", title: "Data Science Intern", company: "Microsoft", location: "Seattle, WA", type: "Full-time", duration: "6 months", tags: ["Python", "ML", "SQL"], posted: "5 days ago" },
  { id: "3", title: "UX Design Intern", company: "Apple", location: "Cupertino, CA", type: "Part-time", duration: "4 months", tags: ["Figma", "Research", "Prototyping"], posted: "1 week ago" },
  { id: "4", title: "Cloud Engineering Intern", company: "Amazon", location: "Remote", type: "Full-time", duration: "3 months", tags: ["AWS", "Docker", "Linux"], posted: "3 days ago" },
  { id: "5", title: "Marketing Intern", company: "Netflix", location: "Los Angeles, CA", type: "Part-time", duration: "6 months", tags: ["Analytics", "Content", "SEO"], posted: "1 day ago" },
  { id: "6", title: "Product Management Intern", company: "Meta", location: "Menlo Park, CA", type: "Full-time", duration: "3 months", tags: ["Strategy", "Analytics", "Agile"], posted: "4 days ago" },
];

export default function BrowseInternships() {
  const [search, setSearch] = useState("");
  const filtered = internships.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.company.toLowerCase().includes(search.toLowerCase()) ||
    i.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold">Browse Internships</h2>
        <p className="text-muted-foreground">Find your perfect internship opportunity.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by title, company, or skill…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Location" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="ca">California</SelectItem>
            <SelectItem value="wa">Washington</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full">Full-time</SelectItem>
            <SelectItem value="part">Part-time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((intern) => (
          <Card key={intern.id} className="shadow-card hover:shadow-elevated transition-shadow duration-300 group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">{intern.posted}</span>
              </div>
              <h3 className="font-display font-semibold mb-1 group-hover:text-primary transition-colors">{intern.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{intern.company}</p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{intern.location}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{intern.duration}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {intern.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
                ))}
              </div>
              <Button size="sm" className="w-full" asChild>
                <Link to={`/student/internships/${intern.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
