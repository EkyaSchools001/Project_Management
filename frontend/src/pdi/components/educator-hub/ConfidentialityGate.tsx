import React, { useState, useEffect } from "react";
import { ShieldCheck, Warning, Fingerprint } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { motion, AnimatePresence } from "framer-motion";

interface ConfidentialityGateProps {
  children: React.ReactNode;
  moduleId: string;
  moduleName: string;
}

export function ConfidentialityGate({ children, moduleId, moduleName }: ConfidentialityGateProps) {
  const [accepted, setAccepted] = useState<boolean>(false);
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const storageKey = `confidentiality_accepted_${moduleId}`;

  useEffect(() => {
    const hasAccepted = localStorage.getItem(storageKey);
    if (hasAccepted === "true") {
      setAccepted(true);
    }
  }, [storageKey]);

  const handleAccept = () => {
    if (isAgreed) {
      localStorage.setItem(storageKey, "true");
      setAccepted(true);
    }
  };

  if (accepted) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-card border border-border rounded-xl p-8 shadow-2xl text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full">
            <Fingerprint className="w-12 h-12 text-primary" weight="duotone" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Access Controlled</h2>
          <p className="text-muted-foreground">
            The <span className="text-foreground font-semibold subrayado decoration-primary/30">{moduleName}</span> module contains sensitive institutional data and proprietary content.
          </p>
        </div>

        <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-lg flex gap-3 text-left">
          <Warning className="w-5 h-5 text-destructive shrink-0 mt-0.5" weight="fill" />
          <p className="text-xs text-destructive font-medium">
            By accessing this module, you agree to maintain strict confidentiality. Unauthorized reproduction or sharing of this content is prohibited.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-left bg-muted/50 p-3 rounded-md">
          <Checkbox 
            id="agreement" 
            checked={isAgreed} 
            onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
          />
          <Label 
            htmlFor="agreement" 
            className="text-sm cursor-pointer select-none leading-tight"
          >
            I verify that I have read the policy and agree to maintain confidentiality.
          </Label>
        </div>

        <Button 
          className="w-full flex items-center gap-2" 
          disabled={!isAgreed}
          onClick={handleAccept}
        >
          <ShieldCheck className="w-4 h-4" weight="bold" />
          Authorize Access
        </Button>
      </motion.div>
    </div>
  );
}
