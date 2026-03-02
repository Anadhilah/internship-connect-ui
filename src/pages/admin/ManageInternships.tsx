import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Eye, Trash2 } from "lucide-react";
import { useState } from "react";

const internships = [
  { id: 1, title: "Software Engineering Intern", company: "Google", applicants: 45, status: "Active", posted: "2026-02-28" },
  { id: 2, title: "Product Design Intern", company: "Apple", applicants: 22, status: "Active", posted: "2026-02-20" },
  { id: 3, title: "Data Analyst Intern", company: "Microsoft", applicants: 18, status: "Closed", posted: "2026-01-15" },
  { id: 4, title: "Marketing Intern", company: "Netflix", applicants: 30, status: "Active", posted: "2026-02-25" },
];

export default function AdminManageInternships() {
  const [search, setSearch] = useState("");
  const filtered = internships.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.company.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold">Manage Internships</h2>
        <p className="text-muted-foreground">Oversee all internship postings on the platform.</p>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search internships…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead className="hidden sm:table-cell">Posted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.company}</TableCell>
                  <TableCell>{item.applicants}</TableCell>
                  <TableCell className="hidden sm:table-cell">{item.posted}</TableCell>
                  <TableCell><Badge variant={item.status === "Active" ? "default" : "secondary"}>{item.status}</Badge></TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
