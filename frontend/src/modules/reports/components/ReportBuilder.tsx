import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { Save, Eye, Download, Clock, Plus, X, Layout, BarChart3, Table, Gauge, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/badge';
import ChartWidget from '../components/ChartWidget';
import TableWidget from '../components/TableWidget';
import KPIWidget from '../components/KPIWidget';
import ReportPreview from '../components/ReportPreview';
import ScheduleReportModal from '../components/ScheduleReportModal';
import reportService from '../../../services/report.service';

const generateId = () => Math.random().toString(36).substr(2, 9);

const WIDGET_TYPES = [
  { type: 'chart', icon: BarChart3, label: 'Chart', description: 'Bar, Line, Pie, Area charts' },
  { type: 'table', icon: Table, label: 'Table', description: 'Data tables with sorting' },
  { type: 'kpi', icon: Gauge, label: 'KPI', description: 'Key performance indicators' },
];

export default function ReportBuilder() {
  const navigate = useNavigate();
  const [reportName, setReportName] = useState('');
  const [description, setDescription] = useState('');
  const [dataSource, setDataSource] = useState('');
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [widgets, setWidgets] = useState<any[]>([]);
  const [filters, setFilters] = useState<any[]>([]);
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  React.useEffect(() => {
    loadDataSources();
    loadTemplates();
  }, []);

  const loadDataSources = async () => {
    try {
      const response = await reportService.getDataSources();
      setDataSources(response.data.dataSources);
    } catch (error) {
      console.error('Error loading data sources:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await reportService.getTemplates();
      setTemplates(response.data.templates);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const type = event.active.data.current?.type;
    if (type) {
      setDraggedItem({ type });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedItem(null);
    const { over } = event;
    if (over?.id === 'canvas') {
      const newWidget = {
        id: generateId(),
        type: draggedItem?.type,
        title: `New ${draggedItem?.type}`,
        config: getDefaultConfig(draggedItem?.type),
        position: { x: 0, y: widgets.length, w: 6, h: 3 }
      };
      setWidgets([...widgets, newWidget]);
    }
  };

  const getDefaultConfig = (type: string) => {
    switch (type) {
      case 'chart':
        return { chartType: 'bar', dataField: 'value', groupBy: 'name' };
      case 'table':
        return { columns: [], sortable: true, pageSize: 10 };
      case 'kpi':
        return { metric: 'count', comparison: null };
      default:
        return {};
    }
  };

  const updateWidget = (id: string, updates: any) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  const addFilter = () => {
    setFilters([...filters, { field: '', operator: 'equals', value: '' }]);
  };

  const updateFilter = (index: number, updates: any) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    setFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!reportName || !dataSource) {
      alert('Please fill in report name and select data source');
      return;
    }

    setLoading(true);
    try {
      const reportData = {
        name: reportName,
        description,
        dataSource,
        filters,
        widgets,
        groupBy,
        createdBy: user?.id || 'current-user'
      };

      await reportService.createReport(reportData);
      alert('Report saved successfully!');
      navigate('/reports');
    } catch (error) {
      console.error('Error saving report:', error);
      alert('Failed to save report');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await reportService.generateReport({
        dataSource,
        filters,
        widgets,
        groupBy
      });
      setPreviewData(response.data);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setReportName(template.name);
      setDescription(template.description);
      setWidgets(template.widgets.map((w: any) => ({ ...w, id: generateId() })));
      setFilters(template.defaultFilters);
      setSelectedTemplate(templateId);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Report Builder</h1>
          <p className="text-sm text-gray-500">Design your custom report</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSchedule(true)}>
            <Clock className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" onClick={handleGenerate} disabled={loading}>
            <FileText className="w-4 h-4 mr-2" />
            Generate
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
          <div className="w-64 bg-white border-r p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">Widget Toolbox</h3>
            <div className="space-y-2">
              {WIDGET_TYPES.map((item) => (
                <div
                  key={item.type}
                  className="p-3 border rounded-lg cursor-grab hover:bg-gray-50 transition-colors"
                  draggable
                  data-type={item.type}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                </div>
              ))}
            </div>

            <h3 className="font-semibold mt-6 mb-4">Templates</h3>
            <div className="space-y-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${selectedTemplate === template.id ? 'border-red-500 bg-red-50' : ''}`}
                  onClick={() => applyTemplate(template.id)}
                >
                  <div className="font-medium text-sm">{template.name}</div>
                  <p className="text-xs text-gray-500">{template.category}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex">
            <div className="flex-1 p-6 overflow-y-auto">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Report Configuration</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Report Name</Label>
                      <Input
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                        placeholder="My Report"
                      />
                    </div>
                    <div>
                      <Label>Data Source</Label>
                      <Select value={dataSource} onValueChange={setDataSource}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select data source" />
                        </SelectTrigger>
                        <SelectContent>
                          {dataSources.map((ds) => (
                            <SelectItem key={ds.id} value={ds.id}>{ds.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Report description"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <Button variant="outline" size="sm" onClick={addFilter}>
                    <Plus className="w-4 h-4 mr-1" /> Add Filter
                  </Button>
                </div>
                {filters.map((filter, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-center">
                    <Select value={filter.field} onValueChange={(v) => updateFilter(index, { field: v })}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Field" />
                      </SelectTrigger>
                      <SelectContent>
                        {dataSources.find(ds => ds.id === dataSource)?.fields.map((f: string) => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filter.operator} onValueChange={(v) => updateFilter(index, { operator: v })}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="gt">Greater than</SelectItem>
                        <SelectItem value="lt">Less than</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={filter.value}
                      onChange={(e) => updateFilter(index, { value: e.target.value })}
                      placeholder="Value"
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeFilter(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-4">Report Canvas</h3>
                <div
                  id="canvas"
                  className="min-h-96 bg-white border-2 border-dashed rounded-lg p-4"
                  style={{ minHeight: '400px' }}
                >
                  {widgets.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-gray-400">
                      <div className="text-center">
                        <Layout className="w-12 h-12 mx-auto mb-2" />
                        <p>Drag widgets here to build your report</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-6 gap-4">
                      {widgets.map((widget) => (
                        <div
                          key={widget.id}
                          className={`col-span-${widget.position.w} row-span-${widget.position.h} border rounded-lg overflow-hidden ${activeWidget === widget.id ? 'ring-2 ring-red-500' : ''}`}
                          style={{ gridColumn: `span ${widget.position.w}`, gridRow: `span ${widget.position.h}` }}
                          onClick={() => setActiveWidget(widget.id)}
                        >
                          <div className="bg-gray-100 px-3 py-2 flex items-center justify-between">
                            <span className="font-medium text-sm">{widget.title}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); removeWidget(widget.id); }}>
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="p-2 bg-white h-full">
                            {widget.type === 'chart' && (
                              <ChartWidget
                                config={widget.config}
                                data={previewData?.chartData?.[widget.id] || []}
                                onChange={(config) => updateWidget(widget.id, { config })}
                              />
                            )}
                            {widget.type === 'table' && (
                              <TableWidget
                                config={widget.config}
                                data={previewData?.aggregatedData || []}
                                onChange={(config) => updateWidget(widget.id, { config })}
                              />
                            )}
                            {widget.type === 'kpi' && (
                              <KPIWidget
                                config={widget.config}
                                data={previewData?.kpiData?.[widget.id]}
                                onChange={(config) => updateWidget(widget.id, { config })}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {activeWidget && (
              <div className="w-80 bg-white border-l p-4 overflow-y-auto">
                <h3 className="font-semibold mb-4">Widget Properties</h3>
                {(() => {
                  const widget = widgets.find(w => w.id === activeWidget);
                  if (!widget) return null;
                  return (
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={widget.title}
                          onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
                        />
                      </div>
                      {widget.type === 'chart' && (
                        <>
                          <div>
                            <Label>Chart Type</Label>
                            <Select value={widget.config.chartType} onValueChange={(v) => updateWidget(widget.id, { config: { ...widget.config, chartType: v } })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bar">Bar</SelectItem>
                                <SelectItem value="line">Line</SelectItem>
                                <SelectItem value="pie">Pie</SelectItem>
                                <SelectItem value="area">Area</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Data Field</Label>
                            <Select value={widget.config.dataField} onValueChange={(v) => updateWidget(widget.id, { config: { ...widget.config, dataField: v } })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {dataSources.find(ds => ds.id === dataSource)?.fields.map((f: string) => (
                                  <SelectItem key={f} value={f}>{f}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                      {widget.type === 'kpi' && (
                        <div>
                          <Label>Metric</Label>
                          <Select value={widget.config.metric} onValueChange={(v) => updateWidget(widget.id, { config: { ...widget.config, metric: v } })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="count">Count</SelectItem>
                              <SelectItem value="sum">Sum</SelectItem>
                              <SelectItem value="average">Average</SelectItem>
                              <SelectItem value="min">Minimum</SelectItem>
                              <SelectItem value="max">Maximum</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div>
                        <Label>Width</Label>
                        <Select value={String(widget.position.w)} onValueChange={(v) => updateWidget(widget.id, { position: { ...widget.position, w: Number(v) } })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">Small (3)</SelectItem>
                            <SelectItem value="6">Medium (6)</SelectItem>
                            <SelectItem value="12">Large (12)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          <DragOverlay>
            {draggedItem && (
              <div className="p-3 bg-white border rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  {draggedItem.type === 'chart' && <BarChart3 className="w-4 h-4" />}
                  {draggedItem.type === 'table' && <Table className="w-4 h-4" />}
                  {draggedItem.type === 'kpi' && <Gauge className="w-4 h-4" />}
                  <span className="text-sm">{draggedItem.type}</span>
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {showPreview && (
        <ReportPreview
          reportName={reportName}
          widgets={widgets}
          data={previewData}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showSchedule && (
        <ScheduleReportModal
          reportId={null}
          onClose={() => setShowSchedule(false)}
        />
      )}
    </div>
  );
}