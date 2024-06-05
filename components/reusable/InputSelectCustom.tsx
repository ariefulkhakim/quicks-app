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

type Props = {
  openSelect: boolean;
  onTriggerSelect: (v: boolean) => void;
  value: string;
  onChangeValue: (v: string) => void;
  placeholder: string;
};

export function InputSelectCustom({
  openSelect,
  onTriggerSelect,
  onChangeValue,
  value,
  placeholder,
}: Props) {
  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro1",
      label: "Astro1",
    },
    {
      value: "next.js1",
      label: "Next.js1",
    },
    {
      value: "sveltekit1",
      label: "SvelteKit1",
    },
    {
      value: "nuxt.js1",
      label: "Nuxt.js1",
    },
    {
      value: "remix1",
      label: "Remix1",
    },
    {
      value: "astro1",
      label: "Astro1",
    },
  ];
  return (
    <Popover open={openSelect} onOpenChange={(v) => onTriggerSelect(v)}>
      <PopoverTrigger className="w-full" asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openSelect}
          className="w-full justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : `Select ${placeholder}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-0">
        <Command className="w-full">
          <CommandInput placeholder={`Search ${placeholder}...`} />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {frameworks.map((framework, id) => (
                <CommandItem
                  key={id}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    onChangeValue(currentValue === value ? "" : currentValue);
                    onTriggerSelect(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
