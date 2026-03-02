import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const applications = [
  { id: 1, role: "Software Engineering Intern", company: "Google", date: "2026-02-28", status: "pending" as const },
  { id: 2, role: "Data Science Intern", company: "Microsoft", date: "2026-02-25", status: "accepted" as const },
  { id: 3, role: "Cloud Engineering Intern", company: "Amazon", date: "2026-02-20", status: "rejected" as const },
  { id: 4, role: "Product Design Intern", company: "Meta", date: "2026-02-18", status: "reviewing" as const },
  { id: 5, role: "Marketing Intern", company: "Netflix", date: "2026-02-15", status: "pending" as const },
];

export default function MyApplications() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold">My Applications</h2>
        <p className="text-muted-foreground">Track the status of your internship applications.</p>
      </div>
      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="hidden sm:table-cell">Date Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.role}</TableCell>
                  <TableCell>{app.company}</TableCell>
                  <TableCell className="hidden sm:table-cell">{app.date}</TableCell>
                  <TableCell><StatusBadge status={app.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
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
