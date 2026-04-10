// @ts-nocheck
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function Certificate({ 
  certificate,
  onDownload,
  onShare 
}: { 
  certificate: any; 
  onDownload?: () => void; 
  onShare?: () => void;
}) {
  const certificateRef = useRef<HTMLDivElement>(null);
  
  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = certificateRef.current;
      const opt = {
        margin: 10,
        filename: `certificate-${certificate.certificateNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };
      await html2pdf().set(opt).from(element).save();
      onDownload?.();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  const handleShare = async () => {
    const shareData = {
      title: `Certificate of Completion - ${certificate.course?.title}`,
      text: `I completed ${certificate.course?.title} on SchoolOS!`,
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      onShare?.();
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Certificate</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </Button>
          <Button onClick={handleDownload}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </Button>
        </div>
      </div>
      
      <div ref={certificateRef} className="bg-white p-8 rounded-lg border-4 border-amber-500 shadow-xl">
        <div className="text-center space-y-6">
          <div className="border-b-2 border-amber-500 pb-4">
            <h2 className="text-amber-700 text-2xl font-semibold tracking-wider">SCHOOLOS</h2>
            <p className="text-amber-600">Learning Management System</p>
          </div>
          
          <div className="py-4">
            <p className="text-lg text-gray-600">This is to certify that</p>
            <h1 className="text-4xl font-bold text-gray-900 py-4">
              {certificate.user?.name || 'Student'}
            </h1>
            <p className="text-lg text-gray-600">has successfully completed the course</p>
          </div>
          
          <div className="py-4">
            <h2 className="text-3xl font-bold text-amber-700">
              {certificate.course?.title || 'Course Title'}
            </h2>
          </div>
          
          <div className="py-4">
            <p className="text-gray-600">
              Issued on {new Date(certificate.issuedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Certificate Number: {certificate.certificateNumber}
            </p>
          </div>
          
          <div className="flex justify-between items-end pt-8 border-t border-gray-300">
            <div className="text-center">
              <div className="w-32 border-b border-gray-400 mb-2"></div>
              <p className="text-sm text-gray-600">Instructor Signature</p>
              <p className="text-sm text-gray-500">{certificate.course?.instructor?.name}</p>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-gray-400 mb-2"></div>
              <p className="text-sm text-gray-600">Program Director</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Certificate;