import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

/**
 * Column definition for MasterTable.
 * Provide either `accessor` (string key or function) or a `cell` renderer.
 */
export type ColumnDefinition<TItem> = {
  header: React.ReactNode;
  accessor?: keyof TItem | ((item: TItem) => React.ReactNode);
  cell?: (item: TItem) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  align?: 'left' | 'right' | 'center';
};

/**
 * Generic, reusable table for Masters pages.
 * Handles loading, error, empty states, and per-row actions.
 */
export interface MasterTableProps<TItem> {
  columns: Array<ColumnDefinition<TItem>>;
  data: TItem[];
  rowKey: (item: TItem, index?: number) => string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  actionsHeader?: React.ReactNode;
  renderActions?: (item: TItem) => React.ReactNode;
  tableProps?: React.HTMLAttributes<HTMLTableElement>;
  headerClassName?: string;
}

export function MasterTable<TItem>(props: MasterTableProps<TItem>) {
  const {
    columns,
    data,
    rowKey,
    loading = false,
    error,
    onRetry,
    actionsHeader = 'Actions',
    renderActions,
    tableProps,
    headerClassName,
  } = props;

  const computedColSpan = columns.length + (renderActions ? 1 : 0);

  const renderCellContent = (item: TItem, col: ColumnDefinition<TItem>) => {
    if (col.cell) return col.cell(item);
    if (typeof col.accessor === 'function') return col.accessor(item);
    if (typeof col.accessor === 'string') return (item as any)[col.accessor];
    return null;
  };

  const getAlignClass = (align?: 'left' | 'right' | 'center') => {
    switch (align) {
      case 'right':
        return 'text-right';
      case 'center':
        return 'text-center';
      default:
        return 'text-left';
    }
  };

  return (
    <Table {...tableProps}>
      <TableHeader className={headerClassName}>
        <TableRow>
          {columns.map((col, index) => (
            <TableHead
              key={index}
              className={`${getAlignClass(col.align)} ${col.headerClassName || ''}`.trim()}
            >
              {col.header}
            </TableHead>
          ))}
          {renderActions && (
            <TableHead className="text-right">{actionsHeader}</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={computedColSpan} className="h-24 text-center">
              <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                <Loader2 className="h-8 w-8 mb-2 animate-spin" />
                <p>Loading...</p>
              </div>
            </TableCell>
          </TableRow>
        ) : error ? (
          <TableRow>
            <TableCell colSpan={computedColSpan} className="h-24 text-center">
              <div className="flex flex-col items-center justify-center text-red-500 py-6 gap-2">
                <p className="font-medium">Error loading data</p>
                <p className="text-sm text-red-400">{error}</p>
                {onRetry && (
                  <Button variant="outline" onClick={onRetry} className="mt-2">
                    Try Again
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={computedColSpan} className="h-24 text-center">
              <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                <p>No records found.</p>
                <p className="text-sm">Try adjusting your search or filter criteria.</p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          data.map((item, index) => (
            <TableRow key={rowKey(item, index)}>
              {columns.map((col, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={`${getAlignClass(col.align)} ${col.className || ''}`.trim()}
                >
                  {renderCellContent(item, col)}
                </TableCell>
              ))}
              {renderActions && (
                <TableCell className="text-right">
                  {renderActions(item)}
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default MasterTable;