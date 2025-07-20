import React from 'react';
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ShareButton: React.FC = () => {
  const handleShare = () => {
    // Logic to share the current state
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      // TODO: Show toast notification
      console.log('URL copied to clipboard');
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="w-9 px-0"
          >
            <Share className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Share this graph</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ShareButton;
