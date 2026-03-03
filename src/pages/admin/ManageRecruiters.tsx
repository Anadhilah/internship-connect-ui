import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Search, CheckCircle, XCircle, Ban, Eye, FileText, Building2 } from "lucide-react";
import { useState } from "react";

type RecruiterStatus = "pending" | "approved" | "rejected" | "suspended";

interface Recruiter {
  id: number;
  name: string;
  email: string;
  company: string;
  industry: string;
  registrationNumber: string;
  proofDoc: string;
  status: RecruiterStatus;
  submittedDate: string;
}

const initialRecruiters: Recruiter[] = [
  { id: 1, name: "Sarah Chen", email: "sarah@techcorp.com", company: "TechCorp", industry: "Technology", registrationNumber: "BRN-2024-001", proofDoc: "techcorp_reg.pdf", status: "pending", submittedDate: "2026-02-28" },
  { id: 2, name: "James Wilson", email: "james@innovate.io", company: "InnovateIO", industry: "SaaS", registrationNumber: "BRN-2024-002", proofDoc: "innovate_cert.pdf", status: "pending", submittedDate: "2026-02-27" },
  { id: 3, name: "Lisa Park", email: "lisa@globalfin.com", company: "GlobalFin", industry: "Finance", registrationNumber: "BRN-2024-003", proofDoc: "globalfin_reg.pdf", status: "approved", submittedDate: "2026-02-20" },
  { id: 4, name: "Tom Brown", email: "tom@startup.co", company: "StartupCo", industry: "E-commerce", registrationNumber: "BRN-2024-004", proofDoc: "startup_reg.pdf", status: "rejected", submittedDate: "2026-02-15" },
  { id: 5, name: "Amy Davis", email: "amy@bigcorp.com", company: "BigCorp", industry: "Manufacturing", registrationNumber: "BRN-2024-005", proofDoc: "bigcorp_cert.pdf", status: "suspended", submittedDate: "2026-01-10" },
];

const statusConfig: Record<RecruiterStatus, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
  pending: { variant: "outline", label: "Pending" },
  approved: { variant: "default", label: "Approved" },
  rejected: { variant: "destructive", label: "Rejected" },
  suspended: { variant: "secondary", label: "Suspended" },
};

export default function ManageRecruiters() {
  const [search, setSearch] = useState("");
  const [recruiters, setRecruiters] = useState(initialRecruiters);
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = recruiters.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.company.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id: number, status: RecruiterStatus) => {
    setRecruiters((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setDetailOpen(false);
  };

  const viewDetails = (r: Recruiter) => {
    setSelectedRecruiter(r);
    setDetailOpen(true);
  };

  const pendingCount = recruiters.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-display font-bold">Manage Recruiters</h2>
          <p className="text-muted-foreground">Review and verify recruiter accounts.</p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">
            {pendingCount} pending review
          </Badge>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search recruiters…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recruiter</TableHead>
                <TableHead className="hidden md:table-cell">Company</TableHead>
                <TableHead className="hidden lg:table-cell">Industry</TableHead>
                <TableHead className="hidden sm:table-cell">Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => {
                const cfg = statusConfig[r.status];
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{r.company}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">{r.industry}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{r.submittedDate}</TableCell>
                    <TableCell>
                      <Badge variant={cfg.variant} className="capitalize">{cfg.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => viewDetails(r)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {r.status === "pending" && (
                        <>
                          <Button variant="ghost" size="sm" className="text-success hover:text-success" onClick={() => updateStatus(r.id, "approved")}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => updateStatus(r.id, "rejected")}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {r.status === "approved" && (
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => updateStatus(r.id, "suspended")}>
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}
                      {r.status === "suspended" && (
                        <Button variant="ghost" size="sm" className="text-success hover:text-success" onClick={() => updateStatus(r.id, "approved")}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recruiter Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          {selectedRecruiter && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {selectedRecruiter.company}
                </DialogTitle>
                <DialogDescription>Recruiter verification details</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <DetailItem label="Contact" value={selectedRecruiter.name} />
                <DetailItem label="Email" value={selectedRecruiter.email} />
                <DetailItem label="Industry" value={selectedRecruiter.industry} />
                <DetailItem label="Registration #" value={selectedRecruiter.registrationNumber} />
                <DetailItem label="Submitted" value={selectedRecruiter.submittedDate} />
                <DetailItem label="Status" value={statusConfig[selectedRecruiter.status].label} />
                <div className="col-span-2 flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm">{selectedRecruiter.proofDoc}</span>
                  <Button variant="ghost" size="sm" className="ml-auto text-xs">Download</Button>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                {selectedRecruiter.status === "pending" && (
                  <>
                    <Button variant="outline" className="text-destructive" onClick={() => updateStatus(selectedRecruiter.id, "rejected")}>
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                    <Button onClick={() => updateStatus(selectedRecruiter.id, "approved")}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Approve
                    </Button>
                  </>
                )}
                {selectedRecruiter.status === "approved" && (
                  <Button variant="destructive" onClick={() => updateStatus(selectedRecruiter.id, "suspended")}>
                    <Ban className="h-4 w-4 mr-1" /> Suspend
                  </Button>
                )}
                {selectedRecruiter.status === "suspended" && (
                  <Button onClick={() => updateStatus(selectedRecruiter.id, "approved")}>
                    <CheckCircle className="h-4 w-4 mr-1" /> Reactivate
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
