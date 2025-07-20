import React from 'react';
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const RunButton = () => {
    const handleRun = () => {
        // Logic to run the execution graph
    };

    return (
        <Button onClick={handleRun} size="sm">
            <Play className="mr-2 h-4 w-4" />
            Run
        </Button>
    );
};

export default RunButton;
