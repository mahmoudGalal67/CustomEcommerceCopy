"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"

type Option = {
    id: string
    name: string
}

interface MultiSelectProps {
    options: Option[]
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
}

export function MultiSelect({
    options = [],
    value,
    onChange,
    placeholder = "Select items",
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)

    const toggleOption = (val: string) => {
        if (value.includes(val)) {
            onChange(value.filter((v) => v !== val))
        } else {
            onChange([...value, val])
        }
    }

    const removeOption = (val: string) => {
        onChange(value.filter((v) => v !== val))
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full min-h-[44px] h-auto px-3 py-2"
                >
                    <div className="flex w-full items-center gap-2">

                        {/* LEFT — selected items */}
                        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                            {(value.length > 0) ? (
                                value.map((val) => {
                                    const option = options.find((o) => o.id === val)
                                    if (!option) return
                                    return (
                                        <Badge
                                            key={val}
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            {option?.name}

                                            <button
                                                type="button"
                                                className="ml-1 rounded-sm hover:bg-muted p-0.5"
                                                onPointerDown={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                }}
                                                onClick={() => removeOption(val)}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    )
                                })
                            ) : (
                                <span className="text-muted-foreground truncate">
                                    {placeholder}
                                </span>
                            )}
                        </div>

                        {/* RIGHT — chevron */}
                        <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
                    </div>
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search..." />

                    <CommandEmpty>No results.</CommandEmpty>

                    <CommandGroup>
                        {options.map((option) => (
                            <CommandItem
                                key={option.id}
                                onSelect={() => toggleOption(option.id)}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value.includes(option.id)
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {option.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}