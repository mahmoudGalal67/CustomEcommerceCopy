"use client";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import RefetchButton from "@/components/RefetchButton";

interface TablesToolbarProps {
    options?: any;
    search: string;
    onSearchChange: (value: string) => void;
    role?: string;
    onRoleChange?: (value: string) => void;
    selectedCount: number;
    onDeleteClick: () => void;
    isFetching: boolean;
    onRefetch: () => void;
    title?: string;
    Sellectable?: boolean;
}

const defaultOptions = ["pending", "processing", "completed", "cancelled"];

export default function TablesToolbar({
    title = "Orders",
    options = defaultOptions,
    search,
    onSearchChange,
    role,
    onRoleChange,
    selectedCount,
    onDeleteClick,
    isFetching,
    onRefetch,
    Sellectable = true,
}: TablesToolbarProps) {
    return (
        <div className="space-y-3">
            {/* Top filters */}
            <div className="flex items-center gap-2">
                <Input
                    placeholder={`Search by Name / ${title} ID`}
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-64"
                />

                {
                    Sellectable && (<Select value={role} onValueChange={onRoleChange}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder={title} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="undefined">All</SelectItem>
                            {options.map((option: any) => (
                                <SelectItem key={option} value={option?.name ? option?.name : option}>
                                    {option?.name ? option?.name : option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>)
                }

                {isFetching && (
                    <span className="text-sm text-muted-foreground">Searching…</span>
                )}
            </div>

            {/* Actions bar */}
            <div className="flex justify-between items-center bg-secondary px-4 py-2 rounded-md">
                <h1 className="font-semibold">All {title}</h1>

                <div className="flex items-center gap-2">
                    {selectedCount > 0 && (
                        <button
                            onClick={onDeleteClick}
                            className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 text-sm rounded-md"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete ({selectedCount})
                        </button>
                    )}

                    <RefetchButton
                        onClick={onRefetch}
                        isRefetching={isFetching}
                    />
                </div>
            </div>
        </div>
    );
}
