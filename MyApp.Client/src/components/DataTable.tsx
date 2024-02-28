import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import type { TableOptions } from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { cn } from "@/utils"

import { toPascalCase, splitTitleCase } from "@servicestack/client"

type DataTableProps<TData, TValue> = TableOptions<TData> & {
    columns: ColumnDef<TData, TValue>[]
    stripedRows?: boolean
}

export { getCoreRowModel }

export function columnDefs<T>(names:string[], configure?: (name:{ [name:string]: ColumnDef<T> }) => void): ColumnDef<T>[] {
    const to = names.map(name => ({
        accessorKey: name,
        header: splitTitleCase(toPascalCase(name)).join(' '),
    }))
    if (configure != null) {
        const map = to.reduce((acc,x) => {
            acc[x.accessorKey] = x
            return acc
        }, {} as { [name:string]: ColumnDef<T> })
        configure(map)
    }
    return to
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
    const { enableRowSelection } = props
    const stripedRows = props.stripedRows ?? true

    const table = useReactTable({
        ...props,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-900">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <tr className={cn("border-b transition-colors",
                                (enableRowSelection ? "cursor-pointer " : ""),
                                enableRowSelection && row.getIsSelected() 
                                    ? "bg-indigo-100 dark:bg-blue-800" 
                                    : (enableRowSelection ? "hover:bg-yellow-50 dark:hover:bg-blue-900 " : "") +
                                        (stripedRows
                                            ? (row.index % 2 == 0 ? "bg-white dark:bg-black" : "bg-gray-50 dark:bg-gray-800")
                                            : "bg-white dark:bg-black"))}
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                onClick={row.getToggleSelectedHandler()}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={props.columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
export default DataTable