"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const coupongroup = [
  {
    value: "assicat1",
    label: "25",
  },
  {
    value: "assicat2",
    label: "30",
  },
  {
    value: "assicat3",
    label: "35",
  },
]

function CouponGroup() {
const [open, setOpen] = React.useState(false)
const [value, setValue] = React.useState("")
  return (
     <div>
       <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? coupongroup.find((couponitem) => couponitem.value === value)?.label
            : "Select coupongroup..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {coupongroup.map((couponitem) => (
                <CommandItem
                  key={couponitem.value}
                  value={couponitem.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {couponitem.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === couponitem.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
     </div>
  )
}

export default CouponGroup
