import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const applicants = [
  { id: 1, name: "Alex Johnson", email: "alex@uni.edu", role: "Software Engineering Intern", status: "pending" as const },
  { id: 2, name: "Maria Garcia", email: "maria@uni.edu", role: "Software Engineering Intern", status: "accepted" as const },
  { id: 3, name: "James Lee", email: "james@uni.edu", role: "Product Design Intern", status: "reviewing" as const },
  { id: 4, name: "Emma Wilson", email: "emma@uni.edu", role: "Data Analyst Intern", status: "rejected" as const },
];

export default function Applicants() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold">Applicants</h2>
        <p className="text-muted-foreground">Review and manage applicants for your internships.</p>
      </div>
      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">{app.email}</TableCell>
                  <TableCell>{app.role}</TableCell>
                  <TableCell><StatusBadge status={app.status} /></TableCell>
                  <TableCell className="text-right">
                    <Select>
                      <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Action" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accepted">Accept</SelectItem>
                        <SelectItem value="rejected">Reject</SelectItem>
                        <SelectItem value="reviewing">Review</SelectItem>
                      </SelectContent>
                    </Select>
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
