import React from "react";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const InProgress = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="p-6 rounded-full bg-primary/10 animate-bounce">
        <Construction className="w-16 h-16 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Page In Progress</h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          We're working hard to bring you this feature. Please check back soon!
        </p>
      </div>
      <Button onClick={() => navigate(-1)} variant="outline" size="lg">
        Go Back
      </Button>
    </div>
  );
};

export default InProgress;
