import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Share, Check, Loader2, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStore } from '@nanostores/react';
import { $nodes, $edges } from '@/stores/graph';
import { encodeStateToURL, isStateTooLargeForURL } from '@/utils/urlState';

const ShareButton: React.FC = () => {
  const nodes = useStore($nodes);
  const edges = useStore($edges);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');

  const handleShare = useCallback(async () => {
    if (shareStatus === 'copying') return;
    
    setShareStatus('copying');
    
    try {
      // Check if the graph is too large for URL sharing
      if (isStateTooLargeForURL(nodes, edges)) {
        throw new Error('Graph is too large for URL sharing. Try reducing the number of nodes.');
      }
      
      const shareURL = encodeStateToURL(nodes, edges);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareURL);
      
      setShareStatus('copied');
      
      // Reset status after 3 seconds
      setTimeout(() => setShareStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to share:', error);
      setShareStatus('error');
      
      // Reset error status after 3 seconds
      setTimeout(() => setShareStatus('idle'), 3000);
    }
  }, [nodes, edges, shareStatus]);

  const isEmpty = nodes.length === 0 && edges.length === 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            disabled={shareStatus === 'copying' || isEmpty}
            className={`h-8 w-8 ${
              shareStatus === 'copied' ? 'text-green-600' :
              shareStatus === 'error' ? 'text-red-600' : ''
            }`}
          >
            {shareStatus === 'copying' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : shareStatus === 'copied' ? (
              <Check className="h-4 w-4" />
            ) : shareStatus === 'error' ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <Share className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {shareStatus === 'copying' ? 'Copying link...' :
             shareStatus === 'copied' ? 'Link copied to clipboard!' :
             shareStatus === 'error' ? 'Failed to create link' :
             isEmpty ? 'Create some nodes to share' :
             'Share this graph'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ShareButton;
