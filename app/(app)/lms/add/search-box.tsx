"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

interface DebouncedComboboxProps {
  placeholder: string;
  emptyMessage: string;
  name: string;
  fetchItems: (
    query: string,
  ) => Promise<{ items: string[]; error: string | null }>;
  val?: string;
}

export function DebouncedCombobox({
  placeholder,
  emptyMessage,
  fetchItems,
  name,
  val,
}: DebouncedComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(val ?? "");
  const [inputValue, setInputValue] = React.useState(val ?? "");
  const [items, setItems] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const debouncedInputValue = useDebounce(inputValue, 200);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      if (!debouncedInputValue) {
        setItems([]);
        return;
      }

      setIsLoading(true);
      try {
        const result = await fetchItems(debouncedInputValue);
        if (isMounted) {
          setItems(result.items || []);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        if (isMounted) {
          setItems([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    React.startTransition(() => {
      fetchData();
    });

    return () => {
      isMounted = false;
    };
  }, [debouncedInputValue, fetchItems]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[250px] justify-between overflow-hidden overflow-ellipsis"
          >
            {value || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              {isLoading ? (
                <CommandEmpty>Loading...</CommandEmpty>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <CommandGroup key={item}>
                    <CommandItem
                      value={item}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {item}
                    </CommandItem>
                  </CommandGroup>
                ))
              ) : (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input
        name={name}
        value={value ?? ""}
        className="h-0 w-0 border-0 opacity-0"
        required
      />
    </>
  );
}
