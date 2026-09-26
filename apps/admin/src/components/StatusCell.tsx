import { memo, useCallback } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const STATUS_OPTIONS = ["pending", "processing", "completed", "cancelled"];


const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-700",
  processing: "bg-blue-500/20 text-blue-700",
  shipped: "bg-purple-500/20 text-purple-700",
  completed: "bg-green-500/20 text-green-700",
  cancelled: "bg-red-500/20 text-red-700",
};


const StatusCell = memo(({ getValue, row, column, table }: any) => {
  const value = getValue();

  const onChange = useCallback(
    (val: string) => {
      table.options.meta?.updateData(row.index, column.id, val);
    },
    [row.index, column.id, table]
  );

  return (
    <>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Badge className={statusColors[value]}>{value}</Badge></>
  );
});

export default StatusCell;
