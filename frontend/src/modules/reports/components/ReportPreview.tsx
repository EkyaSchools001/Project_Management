import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, Download, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent } from '../../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import ChartWidget from './ChartWidget';
import TableWidget from './TableWidget';
import KPIWidget from './KPIWidget';

interface ReportPreviewProps {
  reportName: string;
  widgets: any[];
  data: any;
  onClose: () => void;
}

export default function ReportPreview({ reportName, widgets, data, onClose }: ReportPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [activeTab, setActiveTab] = useState('preview');
  const [currentPage, setCurrentPage] = useState(1);
  const [exportFormat, setExportFormat] = useState<string | null>(null);

  const handleZoomIn = () => setZoom(Math.min(200, zoom + 25));
  const handleZoomOut = () => setZoom(Math.max(50, zoom - 25));

  const handleExportPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    pdf.setFontSize(18);
    pdf.text(reportName || 'Report', margin, margin + 10);

    pdf.setFontSize(10);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, margin + 20);

    let yPos = margin + 30;

    widgets.forEach((widget, index) => {
      if (yPos > pageHeight - 40) {
        pdf.addPage();
        yPos = margin;
      }

      pdf.setFontSize(12);
      pdf.text(widget.title || `Widget ${index + 1}`, margin, yPos);
      yPos += 8;

      if (widget.type === 'kpi' && data?.kpiData?.[widget.id]) {
        pdf.setFontSize(24);
        const value = data.kpiData[widget.id].value;
        pdf.text(String(value), margin, yPos + 10);
        yPos += 25;
      } else if (widget.type === 'chart' && data?.chartData?.[widget.id]) {
        yPos += 40;
      } else if (widget.type === 'table' && data?.aggregatedData) {
        yPos += 30;
      }
    });

    pdf.save(`${reportName || 'report'}.pdf`);
    setExportFormat(null);
  };

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();

    if (data?.rawData && data.rawData.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(data.rawData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    }

    if (data?.aggregatedData && data.aggregatedData.length > 0) {
      const aggSheet = XLSX.utils.json_to_sheet(data.aggregatedData);
      XLSX.utils.book_append_sheet(workbook, aggSheet, 'Aggregated');
    }

    if (widgets.some(w => w.type === 'kpi')) {
      const kpiData = widgets
        .filter(w => w.type === 'kpi')
        .map(w => ({
          Name: w.title,
          Value: data?.kpiData?.[w.id]?.value || 0,
          Change: data?.kpiData?.[w.id]?.comparison?.change || 'N/A'
        }));
      const kpiSheet = XLSX.utils.json_to_sheet(kpiData);
      XLSX.utils.book_append_sheet(workbook, kpiSheet, 'KPIs');
    }

    XLSX.writeFile(workbook, `${reportName || 'report'}.xlsx`);
    setExportFormat(null);
  };

  const widgetsPerPage = 4;
  const totalPages = Math.ceil(widgets.length / widgetsPerPage) || 1;
  const currentWidgets = widgets.slice(
    (currentPage - 1) * widgetsPerPage,
    currentPage * widgetsPerPage
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h2 className="text-xl font-bold">{reportName || 'Report Preview'}</h2>
            <p className="text-sm text-gray-500">Live preview of your report</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm w-16 text-center">{zoom}%</span>
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => setExportFormat('pdf')}>
              <FileText className="w-4 h-4 mr-1" />
              PDF
            </Button>
            <Button variant="outline" onClick={() => setExportFormat('excel')}>
              <Download className="w-4 h-4 mr-1" />
              Excel
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="self-start mt-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 overflow-auto mt-4">
            <div 
              className="bg-white p-8 min-h-[600px] transition-transform"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
            >
              <div className="mb-6">
                <h1 className="text-2xl font-bold">{reportName || 'Untitled Report'}</h1>
                <p className="text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
              </div>

              <div className="grid grid-cols-12 gap-4">
                {currentWidgets.map((widget) => (
                  <div
                    key={widget.id}
                    className="col-span-12 border rounded-lg overflow-hidden"
                    style={{ gridColumn: `span ${widget.position?.w || 6}` }}
                  >
                    <div className="bg-gray-100 px-4 py-2 font-medium">
                      {widget.title}
                    </div>
                    <div className="p-4" style={{ height: `${(widget.position?.h || 3) * 80}px` }}>
                      {widget.type === 'chart' && (
                        <ChartWidget
                          config={widget.config}
                          data={data?.chartData?.[widget.id] || []}
                        />
                      )}
                      {widget.type === 'table' && (
                        <TableWidget
                          config={widget.config}
                          data={data?.aggregatedData || []}
                        />
                      )}
                      {widget.type === 'kpi' && (
                        <KPIWidget
                          config={widget.config}
                          data={data?.kpiData?.[widget.id]}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="data" className="flex-1 overflow-auto mt-4">
            {data?.rawData ? (
              <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto">
                {JSON.stringify(data.rawData, null, 2)}
              </pre>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No data available. Click "Generate" to fetch data.
              </div>
            )}
          </TabsContent>
        </Tabs>

        {exportFormat && (
          <div className="fixed inset-0 bg-backgroundlack/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Export Report</h3>
              <p className="mb-4">Export this report as {exportFormat.toUpperCase()}?</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setExportFormat(null)}>
                  Cancel
                </Button>
                {exportFormat === 'pdf' ? (
                  <Button onClick={handleExportPDF}>Export PDF</Button>
                ) : (
                  <Button onClick={handleExportExcel}>Export Excel</Button>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}