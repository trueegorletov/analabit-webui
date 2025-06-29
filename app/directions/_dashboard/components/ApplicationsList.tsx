'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useApplications,
  type Application,
  OrigCeltStatus,
  AdmissionDecision,
} from '@/hooks/useDashboardStats';
import { CircleCheck, Circle, Check, GripHorizontal } from 'lucide-react';

const MIN_TABLE_HEIGHT = 150; // pixels
const MAX_TABLE_HEIGHT = 700; // pixels
const INITIAL_TABLE_HEIGHT = 320; // pixels
const CLICK_DRAG_THRESHOLD = 5; // pixels to differentiate click from drag

export default function ApplicationsList() {
  const { applications } = useApplications();
  const [currentHeight, setCurrentHeight] = useState(INITIAL_TABLE_HEIGHT);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const resizableDivRef = useRef<HTMLDivElement>(null);

  const dragStateRef = useRef({
    isResizing: false,
    isPotentialDrag: false,
    initialMouseY: 0,
    initialHeight: 0,
  });

  const toggleTableHeight = useCallback(() => {
    if (currentHeight < MAX_TABLE_HEIGHT - 1) {
      setCurrentHeight(MAX_TABLE_HEIGHT);
    } else {
      setCurrentHeight(INITIAL_TABLE_HEIGHT);
    }
  }, [currentHeight]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!dragStateRef.current.isPotentialDrag || !resizableDivRef.current)
      return;

    const deltaY = event.clientY - dragStateRef.current.initialMouseY;

    if (
      !dragStateRef.current.isResizing &&
      Math.abs(deltaY) > CLICK_DRAG_THRESHOLD
    ) {
      dragStateRef.current.isResizing = true;
      document.body.style.userSelect = 'none';
    }

    if (dragStateRef.current.isResizing) {
      let newHeight = dragStateRef.current.initialHeight + deltaY;
      newHeight = Math.max(
        MIN_TABLE_HEIGHT,
        Math.min(newHeight, MAX_TABLE_HEIGHT),
      );
      setCurrentHeight(newHeight);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!dragStateRef.current.isPotentialDrag) return;

    if (!dragStateRef.current.isResizing) {
      toggleTableHeight();
    }

    if (dragStateRef.current.isResizing) {
      document.body.style.userSelect = '';
    }

    dragStateRef.current.isResizing = false;
    dragStateRef.current.isPotentialDrag = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, toggleTableHeight]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (!resizableDivRef.current) return;

      dragStateRef.current = {
        isResizing: false,
        isPotentialDrag: true,
        initialMouseY: event.clientY,
        initialHeight: resizableDivRef.current.offsetHeight,
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [handleMouseMove, handleMouseUp],
  );

  useEffect(() => {
    return () => {
      if (
        dragStateRef.current.isPotentialDrag ||
        dragStateRef.current.isResizing
      ) {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      }
    };
  }, [handleMouseMove, handleMouseUp]);

  const renderOrigCelt = (status: OrigCeltStatus) => {
    if (status === OrigCeltStatus.YES) {
      return <CircleCheck className="w-5 h-5 text-green-500 mx-auto" />;
    }
    return <Circle className="w-5 h-5 text-yellow-500 mx-auto" />;
  };

  const renderOtherUnlv = (value?: number | 'check') => {
    if (value === 'check') {
      return (
        <Check className="w-5 h-5 text-gray-300 mx-auto" strokeWidth={2} />
      );
    }
    if (typeof value === 'number') {
      return <span className="text-gray-200">{value}</span>;
    }
    return <span className="text-gray-500">-</span>;
  };

  const renderAdmission = (app: Application) => {
    switch (app.admission) {
      case AdmissionDecision.ADMITTED_TEXT:
        return <span className="text-green-400 font-medium">Зачислен</span>;
      case AdmissionDecision.NOT_COMPETING_TEXT:
        return (
          <span className="text-yellow-500 font-medium">Не конкурсует</span>
        );
      case AdmissionDecision.ADMITTED_GREEN_CHECK:
        return (
          <Check className="w-5 h-5 text-green-500 mx-auto" strokeWidth={2.5} />
        );
      default:
        return <span className="text-gray-500">-</span>;
    }
  };

  const columns: ColumnDef<Application>[] = [
    {
      accessorKey: 'rank',
      header: 'Ранг',
      cell: ({ getValue, row }) => {
        const isCurrentUser = row.original.isCurrentUser;
        return (
          <span
            className={`text-xs sm:text-sm ${
              isCurrentUser ? 'text-green-400 font-bold' : 'text-gray-200'
            }`}
          >
            {String(getValue())}
          </span>
        );
      },
    },
    {
      accessorKey: 'studentId',
      header: 'ID',
      cell: ({ getValue }) => (
        <span className="text-xs sm:text-sm text-gray-200 truncate max-w-0">
          {String(getValue())}
        </span>
      ),
      meta: {
        className: 'hidden xs:table-cell',
      },
    },
    {
      accessorKey: 'priority',
      header: 'Прио',
      cell: ({ getValue }) => (
        <span className="text-xs sm:text-sm text-gray-200 text-right">
          {String(getValue())}
        </span>
      ),
      meta: {
        className: 'hidden sm:table-cell',
      },
    },
    {
      accessorKey: 'score',
      header: 'Балл',
      cell: ({ getValue }) => (
        <span className="text-xs sm:text-sm text-gray-200 text-right">
          {String(getValue())}
        </span>
      ),
    },
    {
      accessorKey: 'origCelt',
      header: 'О,Ц',
      cell: ({ getValue }) => renderOrigCelt(getValue() as OrigCeltStatus),
      enableSorting: false,
      meta: {
        className: 'hidden xs:table-cell',
      },
    },
    {
      accessorKey: 'otherUnlv',
      header: 'Др',
      cell: ({ getValue }) =>
        renderOtherUnlv(getValue() as number | 'check' | undefined),
      enableSorting: false,
      meta: {
        className: 'hidden sm:table-cell',
      },
    },
    {
      accessorKey: 'admission',
      header: 'Зач',
      cell: ({ row }) => renderAdmission(row.original),
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: applications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">
        Список заявлений
      </h2>
      <div
        ref={resizableDivRef}
        className="overflow-x-auto overflow-y-auto border border-gray-600 rounded-t-md relative bg-[#1C1C22] applications-scrollbar"
        style={{ height: `${currentHeight}px` }}
      >
        <Table className="w-full text-sm">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-gray-700"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`py-1.5 px-0.5 sm:py-2 sm:px-1 font-medium text-gray-400 sticky top-0 bg-[#1C1C22] z-10 text-xs sm:text-sm ${
                      header.column.id === 'rank' ||
                      header.column.id === 'studentId'
                        ? 'text-left'
                        : header.column.id === 'priority' ||
                            header.column.id === 'score'
                          ? 'text-right'
                          : 'text-center'
                    } ${header.column.getCanSort() ? 'cursor-pointer' : ''} ${
                      header.column.columnDef.meta && 'className' in header.column.columnDef.meta 
                        ? header.column.columnDef.meta.className 
                        : ''
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    {{
                      asc: ' ↑',
                      desc: ' ↓',
                    }[header.column.getIsSorted() as string] ?? null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                className={`border-b border-gray-700 hover:bg-gray-700/30 ${
                  index % 2 === 0 ? '' : 'bg-black/10'
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`py-1.5 px-0.5 sm:py-2 sm:px-1 ${
                      cell.column.id === 'rank' ||
                      cell.column.id === 'studentId'
                        ? 'text-left'
                        : cell.column.id === 'priority' ||
                            cell.column.id === 'score'
                          ? 'text-right'
                          : 'text-center'
                    } ${
                      cell.column.columnDef.meta && 'className' in cell.column.columnDef.meta 
                        ? cell.column.columnDef.meta.className 
                        : ''
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div
        className="w-full h-4 bg-gray-700 hover:bg-gray-600 cursor-ns-resize flex items-center justify-center select-none rounded-b-md border-x border-b border-gray-600"
        onMouseDown={handleMouseDown}
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize table height. Click to toggle between max and default height. Drag to resize."
        tabIndex={0}
      >
        <GripHorizontal className="w-6 h-4 text-gray-400" />
      </div>
    </div>
  );
}
