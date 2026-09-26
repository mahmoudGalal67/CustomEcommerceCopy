import { Skeleton } from "@/components/ui/skeleton";

interface LoadingProps {
    fullWidth?: boolean;
}

export default function Loading({ fullWidth }: LoadingProps) {
    return (
        <div className={`py-8 px-2 space-y-3 justify-center items-center `}>
            <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
    );
}
