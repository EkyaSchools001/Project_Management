import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Checkbox } from '../../../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

interface TableWidgetProps {
  config: {
    columns?: string[];
    sortable?: boolean;
    pageSize?: number;
    grouping?: string[];
    aggregations?: string[];
  };
  data: any[];
  onChange?: (config: any) => void;
}

export default function TableWidget({ config, data, onChange }: TableWidgetProps) {
  const { columns = [], sortable = true, pageSize = 10, grouping = [] } = config;
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns);

  const tableData = data.length > 0 ? data : [
    { name: 'John Doe', grade: 'A', score: 95 },
    { name: 'Jane Smith', grade: 'B+', score: 87 },
    { name: 'Bob Johnson', grade: 'A-', score: 91 },
    { name: 'Alice Brown', grade: 'B', score: 84 },
    { name: 'Charlie Wilson', grade: 'A', score: 96 },
    { name: 'Diana Lee', grade: 'B+', score: 88 },
    { name: 'Eve Davis', grade: 'A-', score: 92 },
    { name: 'Frank Miller', grade: 'C+', score: 79 },
  ];

  const availableColumns = tableData.length > 0 ? Object.keys(tableData[0]) : ['name', 'value'];

  const handleSort = (field: string) => {
    if (!sortable) return;
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedData = [...tableData].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return sortOrder === 'asc' 
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const displayedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(sortedData.length / pageSize);

  const displayColumns = selectedColumns.length > 0 ? selectedColumns : availableColumns;

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-4 h-4 ml-1 text-blue-500" />
      : <ArrowDown className="w-4 h-4 ml-1 text-blue-500" />;
  };

  return (
    <div className="w-full h-full flex flex-col">
      {onChange && (
        <div className="mb-4 flex gap-2 flex-wrap">
          <Select value={String(pageSize)} onValueChange={(v) => onChange({ ...config, pageSize: Number(v) })}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 rows</SelectItem>
              <SelectItem value="10">10 rows</SelectItem>
              <SelectItem value="20">20 rows</SelectItem>
              <SelectItem value="50">50 rows</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortable ? 'true' : 'false'} onValueChange={(v) => onChange({ ...config, sortable: v === 'true' })}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Sortable</SelectItem>
              <SelectItem value="false">Fixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {displayColumns.map((col) => (
                <th
                  key={col}
                  className="px-3 py-2 text-left font-medium text-gray-600 border-b cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(col)}
                >
                  <div className="flex items-center">
                    {col.charAt(0).toUpperCase() + col.slice(1).replace(/_/g, ' ')}
                    {sortable && getSortIcon(col)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedData.map((row, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                {displayColumns.map((col) => (
                  <td key={col} className="px-3 py-2">
                    {row[col] !== undefined ? String(row[col]) : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t mt-2">
          <span className="text-xs text-gray-500">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}