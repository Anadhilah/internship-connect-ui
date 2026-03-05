import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

type CallState = "ringing" | "connected" | "ended";

interface CallWindowProps {
  callerName: string;
  callerInitial: string;
  mode: "video" | "voice";
  onEnd: () => void;
  compact?: boolean;
}

export default function CallWindow({ callerName, callerInitial, mode, onEnd, compact = false }: CallWindowProps) {
  const [state, setState] = useState<CallState>("ringing");
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(mode === "video");
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Auto-connect after 2s ringing
  useEffect(() => {
    if (state === "ringing") {
      const t = setTimeout(() => setState("connected"), 2000);
      return () => clearTimeout(t);
    }
  }, [state]);

  // Timer when connected
  useEffect(() => {
    if (state === "connected") {
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state]);

  const handleEnd = () => {
    setState("ended");
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(onEnd, 1200);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md",
      compact && "rounded-xl inset-auto bottom-20 right-6 w-80 h-[28rem] shadow-2xl border"
    )}>
      {/* Simulated video background */}
      {mode === "video" && cameraOn && state === "connected" && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-muted to-accent/20 animate-pulse opacity-30" />
      )}

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Avatar */}
        <div className={cn(
          "rounded-full bg-primary/10 border-4 flex items-center justify-center font-bold text-primary transition-all",
          state === "ringing" ? "h-28 w-28 text-4xl border-primary/40 animate-pulse" : "h-24 w-24 text-3xl border-primary/20"
        )}>
          {callerInitial}
        </div>

        {/* Name & Status */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold">{callerName}</h2>
          <p className="text-sm text-muted-foreground">
            {state === "ringing" && (mode === "video" ? "Video calling…" : "Calling…")}
            {state === "connected" && formatTime(elapsed)}
            {state === "ended" && "Call ended"}
          </p>
        </div>

        {/* Mode badge */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {mode === "video" ? <Video className="h-3.5 w-3.5" /> : <Phone className="h-3.5 w-3.5" />}
          {mode === "video" ? "Video Call" : "Voice Call"}
        </div>

        {/* Controls */}
        {state !== "ended" && (
          <div className="flex items-center gap-4 mt-4">
            <Button
              variant={muted ? "destructive" : "secondary"}
              size="icon"
              className="h-14 w-14 rounded-full"
              onClick={() => setMuted(!muted)}
            >
              {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            {mode === "video" && (
              <Button
                variant={!cameraOn ? "destructive" : "secondary"}
                size="icon"
                className="h-14 w-14 rounded-full"
                onClick={() => setCameraOn(!cameraOn)}
              >
                {cameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
            )}

            <Button
              variant="destructive"
              size="icon"
              className="h-14 w-14 rounded-full"
              onClick={handleEnd}
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
