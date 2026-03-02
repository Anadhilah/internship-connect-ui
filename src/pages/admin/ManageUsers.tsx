import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Ban, CheckCircle } from "lucide-react";
import { useState } from "react";

const users = [
  { id: 1, name: "Alex Johnson", email: "alex@uni.edu", role: "student", status: "active" },
  { id: 2, name: "Sarah Chen", email: "sarah@company.com", role: "recruiter", status: "active" },
  { id: 3, name: "Maria Garcia", email: "maria@uni.edu", role: "student", status: "suspended" },
  { id: 4, name: "James Lee", email: "james@uni.edu", role: "student", status: "active" },
  { id: 5, name: "Tech Corp", email: "hr@techcorp.com", role: "recruiter", status: "active" },
];

export default function ManageUsers() {
  const [search, setSearch] = useState("");
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold">Manage Users</h2>
        <p className="text-muted-foreground">View and manage all platform users.</p>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search users…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell><Badge variant="secondary" className="capitalize">{user.role}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "destructive"} className="capitalize">{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {user.status === "active" ? (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Ban className="h-4 w-4" /></Button>
                    ) : (
                      <Button variant="ghost" size="sm" className="text-success hover:text-success"><CheckCircle className="h-4 w-4" /></Button>
                    )}
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
