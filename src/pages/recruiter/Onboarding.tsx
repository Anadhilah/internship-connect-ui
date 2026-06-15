import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Building2, ArrowRight, ArrowLeft, ShieldCheck,
  CheckCircle, AlertTriangle, FileText,
} from "lucide-react";

const STEPS = [
  { label: "Company", icon: Building2 },
  { label: "Verification", icon: ShieldCheck },
  { label: "Review", icon: CheckCircle },
];

export default function RecruiterOnboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingOrg, setCheckingOrg] = useState(true);
  const [captchaChecked, setCaptchaChecked] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    companyWebsite: "",
    companyAddress: "",
    industry: "",
    companySize: "",
    companyDescription: "",
    registrationNumber: "",
    taxId: "",
    proofFile: null as File | null,
    agreeTerms: false,
  });

  // If recruiter already has an org row, skip onboarding
  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      const { data } = await supabase
        .from("recruiter_orgs")
        .select("id, status")
        .eq("owner_id", user.id)
        .maybeSingle();
      if (data) {
        navigate(data.status === "approved" ? "/recruiter" : "/recruiter/pending", { replace: true });
      } else {
        setCheckingOrg(false);
      }
    })();
  }, [user, authLoading, navigate]);

  const progress = ((step + 1) / STEPS.length) * 100;

  const updateField = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField("proofFile", e.target.files?.[0] || null);
  };

  const canNext = () => {
    switch (step) {
      case 0: return !!(formData.companyName && formData.industry);
      case 1: return !!(formData.registrationNumber && captchaChecked && formData.agreeTerms);
      default: return true;
    }
  };

  const uploadProof = async (): Promise<string | null> => {
    if (!formData.proofFile || !user) return null;
    const ext = formData.proofFile.name.split(".").pop();
    const path = `${user.id}/verification-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("resumes")
      .upload(path, formData.proofFile, { upsert: true });
    if (error) {
      console.error("proof upload failed", error);
      return null;
    }
    return path;
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const proofPath = await uploadProof();
      const { error } = await supabase.from("recruiter_orgs").insert({
        owner_id: user.id,
        name: formData.companyName,
        website: formData.companyWebsite || null,
        description: formData.companyDescription || null,
        industry: formData.industry || null,
        company_size: formData.companySize || null,
        address: formData.companyAddress || null,
        registration_number: formData.registrationNumber || null,
        tax_id: formData.taxId || null,
        proof_document_url: proofPath,
        status: "pending",
      });
      if (error) throw error;
      toast({ title: "Submitted for approval", description: "We'll notify you once verified." });
      navigate("/recruiter/pending");
    } catch (e: any) {
      toast({ title: "Submission failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || checkingOrg) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex">
            <div className="h-12 w-12 rounded-xl gradient-hero flex items-center justify-center mx-auto">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="text-2xl font-display font-bold">Verify Your Organization</h1>
          <p className="text-muted-foreground text-sm">Welcome {user?.name}! Complete your recruiter profile.</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center gap-1.5">
                <div className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  i < step ? "bg-primary text-primary-foreground"
                    : i === step ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                )}>
                  {i < step ? <CheckCircle className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                </div>
                <span className={cn("text-xs font-medium hidden sm:block", i <= step ? "text-foreground" : "text-muted-foreground")}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-lg">{STEPS[step].label}</CardTitle>
            <CardDescription>
              {step === 0 && "Tell us about your company"}
              {step === 1 && "Submit business registration proof for verification"}
              {step === 2 && "Review and submit your application"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 0 && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name *</Label>
                    <Input value={formData.companyName} onChange={(e) => updateField("companyName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Industry *</Label>
                    <Input placeholder="e.g. Technology, Finance" value={formData.industry} onChange={(e) => updateField("industry", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input placeholder="https://..." value={formData.companyWebsite} onChange={(e) => updateField("companyWebsite", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Company Size</Label>
                    <Input placeholder="e.g. 50-200" value={formData.companySize} onChange={(e) => updateField("companySize", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={formData.companyAddress} onChange={(e) => updateField("companyAddress", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Company Description</Label>
                  <Textarea rows={3} value={formData.companyDescription} onChange={(e) => updateField("companyDescription", e.target.value)} />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Verification Required</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      All recruiter accounts require admin approval. Your account will be marked as "Pending" until verified.
                    </p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Business Registration Number *</Label>
                    <Input value={formData.registrationNumber} onChange={(e) => updateField("registrationNumber", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax ID</Label>
                    <Input value={formData.taxId} onChange={(e) => updateField("taxId", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Upload Proof of Registration</Label>
                  <label
                    htmlFor="proof-upload"
                    className={cn(
                      "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all block",
                      formData.proofFile ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}
                  >
                    <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    {formData.proofFile ? (
                      <p className="text-sm font-medium">{formData.proofFile.name}</p>
                    ) : (
                      <>
                        <p className="text-sm font-medium">Upload business registration document</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG — max 10MB</p>
                      </>
                    )}
                    <input id="proof-upload" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>

                <div className="rounded-lg border p-4 flex items-center gap-3">
                  <Checkbox id="captcha" checked={captchaChecked} onCheckedChange={(v) => setCaptchaChecked(!!v)} />
                  <div className="flex items-center gap-2 flex-1">
                    <Label htmlFor="captcha" className="cursor-pointer text-sm">I'm not a robot</Label>
                    <div className="ml-auto flex items-center gap-1.5">
                      <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground leading-tight">reCAPTCHA<br />Privacy · Terms</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox id="terms" checked={formData.agreeTerms} onCheckedChange={(v) => updateField("agreeTerms", !!v)} />
                  <Label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">
                    I agree to the Terms of Service and certify that the provided business information is accurate.
                  </Label>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Pending Approval</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      After submission, your account will be reviewed by our admin team. You will be notified once approved.
                    </p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <ReviewItem label="Company" value={formData.companyName} />
                  <ReviewItem label="Industry" value={formData.industry} />
                  <ReviewItem label="Website" value={formData.companyWebsite || "—"} />
                  <ReviewItem label="Size" value={formData.companySize || "—"} />
                  <ReviewItem label="Registration #" value={formData.registrationNumber} />
                  <ReviewItem label="Tax ID" value={formData.taxId || "—"} />
                  <ReviewItem label="Proof Document" value={formData.proofFile?.name || "Not uploaded"} />
                  <ReviewItem label="CAPTCHA" value={captchaChecked ? "Verified" : "Not verified"} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} className="gradient-hero text-primary-foreground">
              {loading ? "Submitting…" : "Submit for Approval"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
