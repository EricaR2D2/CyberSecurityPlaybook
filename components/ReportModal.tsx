
import React from 'react';
import Card, { CardHeader, CardContent } from './common/Card';
import Button from './common/Button';

interface ReportModalProps {
  report: string;
  onClose: () => void;
}

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

const ReportModal: React.FC<ReportModalProps> = ({ report, onClose }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(report);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] flex flex-col">
        <CardHeader>Generated Incident Report</CardHeader>
        <CardContent className="flex-grow overflow-y-auto">
          <pre className="whitespace-pre-wrap bg-aw-dark p-4 rounded-md text-sm font-mono">{report}</pre>
        </CardContent>
        <div className="flex justify-end items-center mt-6 space-x-4">
            <Button onClick={handleCopy} variant="secondary" className="flex items-center space-x-2">
                <CopyIcon/>
                <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </Button>
            <Button onClick={onClose}>Close</Button>
        </div>
      </Card>
    </div>
  );
};

export default ReportModal;
