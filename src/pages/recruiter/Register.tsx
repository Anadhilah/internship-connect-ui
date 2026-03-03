import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Building2, ArrowRight, ArrowLeft, Upload, ShieldCheck,
  CheckCircle, AlertTriangle, User, FileText
} from "lucide-react";

const STEPS = [
  { label: "Account", icon: User },
  { label: "Company", icon: Building2 },
  { label: "Verification", icon: ShieldCheck },
  { label: "Review", icon: CheckCircle },
];

export default function RecruiterRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const progress = ((step + 1) / STEPS.length) * 100;

  const updateField = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField("proofFile", e.target.files?.[0] || null);
  };

  const canNext = () => {
    switch (step) {
      case 0: return !!(formData.name && formData.email && formData.password && formData.password === formData.confirmPassword);
      case 1: return !!(formData.companyName && formData.industry);
      case 2: return !!(formData.registrationNumber && captchaChecked);
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, "recruiter");
      navigate("/recruiter/pending");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex">
            <div className="h-12 w-12 rounded-xl gradient-hero flex items-center justify-center mx-auto">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="text-2xl font-display font-bold">Register Your Organization</h1>
          <p className="text-muted-foreground text-sm">Create a verified recruiter account</p>
        </div>

        {/* Progress Indicator */}
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
              {step === 0 && "Create your account credentials"}
              {step === 1 && "Tell us about your company"}
              {step === 2 && "Submit business registration proof for verification"}
              {step === 3 && "Review and submit your application"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step 0: Account */}
            {step === 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={formData.name} onChange={(e) => updateField("name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Password *</Label>
                  <Input type="password" value={formData.password} onChange={(e) => updateField("password", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password *</Label>
                  <Input type="password" value={formData.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 1: Company Info */}
            {step === 1 && (
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

            {/* Step 2: Verification */}
            {step === 2 && (
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
                  <Label>Upload Proof of Registration *</Label>
                  <label
                    htmlFor="proof-upload"
                    className={cn(
                      "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
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

                {/* CAPTCHA Placeholder */}
                <div className="rounded-lg border p-4 flex items-center gap-3">
                  <Checkbox
                    id="captcha"
                    checked={captchaChecked}
                    onCheckedChange={(v) => setCaptchaChecked(!!v)}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <Label htmlFor="captcha" className="cursor-pointer text-sm">I'm not a robot</Label>
                    <div className="ml-auto flex items-center gap-1.5">
                      <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground leading-tight">reCAPTCHA<br />Privacy · Terms</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(v) => updateField("agreeTerms", !!v)}
                  />
                  <Label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">
                    I agree to the Terms of Service and certify that the provided business information is accurate.
                  </Label>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
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
                  <ReviewItem label="Name" value={formData.name} />
                  <ReviewItem label="Email" value={formData.email} />
                  <ReviewItem label="Company" value={formData.companyName} />
                  <ReviewItem label="Industry" value={formData.industry} />
                  <ReviewItem label="Registration #" value={formData.registrationNumber} />
                  <ReviewItem label="Tax ID" value={formData.taxId || "—"} />
                  <ReviewItem label="Proof Document" value={formData.proofFile?.name || "Not uploaded"} />
                  <ReviewItem label="CAPTCHA" value={captchaChecked ? "Verified" : "Not verified"} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => step === 0 ? navigate("/register") : setStep((s) => s - 1)}>
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

        <p className="text-center text-xs text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
        </p>
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
