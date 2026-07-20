"use client";

import clsx from "clsx";
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { Label } from "../label";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectType = {
  options: SelectOption[];
  isLoading?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  classes?: string;
  value?: string;
  onChange?: (value: string, isCustom?: boolean) => void;
  id?: string;
  name?: string;
  label?: string;
  error?: string;
  allowCustom?: boolean;
  customOptionLabel?: string;
  searchable?: boolean; // ← новий параметр
};

export type SelectProps = {
  input: SelectType;
};

const MENU_MAX_HEIGHT = 280;
const MENU_MAX_HEIGHT_COMPACT = 240;

export const Select = forwardRef<HTMLDivElement, SelectProps>(({ input }, _ref) => {
  const {
    options,
    isLoading,
    placeholder = "Input..",
    searchPlaceholder = "Пошук...",
    emptyText = "Нічого не знайдено",
    classes,
    value,
    onChange,
    id,
    name,
    label,
    error,
    allowCustom = false,
    customOptionLabel = "Використати «{value}»",
    searchable = true,
  } = input;

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openUpward, setOpenUpward] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const selectedOption = options.find((option) => option.value === value);
  const displayLabel = selectedOption?.label ?? value;

  const trimmedSearch = search.trim();
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(trimmedSearch.toLowerCase()),
      )
    : options;

  const showCustomOption =
    searchable && allowCustom && trimmedSearch.length > 0 && filteredOptions.length === 0;

  const handleAcceptCustom = () => {
    onChange?.(trimmedSearch || "", true);
    setIsOpen(false);
    setSearch("");
  };

  const handleSelect = (option: SelectOption) => {
    onChange?.(option.value, false);
    setIsOpen(false);
    setSearch("");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const menuHeight = searchable ? MENU_MAX_HEIGHT : MENU_MAX_HEIGHT_COMPACT;

    setOpenUpward(spaceBelow < menuHeight && spaceAbove > spaceBelow);
  }, [isOpen, searchable]);

  useEffect(() => {
    if (isOpen && searchable) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [isOpen, searchable]);

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (typeof _ref === "function") _ref(node);
        else if (_ref) (_ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}>
      {label && ( <Label label={{ text: label, for: id || "select" }} /> )}

      <div ref={triggerRef} className="relative">
        <div className="flex items-center gap-2">
          <button
            type="button"
            id={id || "select"}
            name={name}
            onClick={() => setIsOpen((prev) => !prev)}
            className={clsx(
              "flex w-full items-center justify-between rounded-xl bg-secondary px-4 py-3 text-left text-foreground focus:outline-none",
              !selectedOption && "text-muted-foreground",
              error && "ring-2 ring-red-500",
              classes,
            )}>
            <span className="truncate text-sm">
              {isLoading ? "Завантаження..." : displayLabel || placeholder}
            </span>
            <IconChevronDown
              stroke={2}
              className={clsx(
                "size-6 shrink-0 text-muted-foreground transition-transform",
                isOpen && !openUpward && "rotate-180",
              )}
            />
          </button>

          {allowCustom && (
            <button
              type="button"
              onClick={handleAcceptCustom}
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
              aria-label="Додати">
              <IconPlus className="size-6" />
            </button>
          )}
        </div>

        {isOpen && (
          <div
            className={clsx(
              "absolute z-20 w-full overflow-hidden rounded-xl border border-border bg-secondary shadow-lg",
              openUpward ? "bottom-full mb-1" : "top-full mt-1",
            )}>
            {searchable && (
              <div className="p-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && showCustomOption) {
                      e.preventDefault();
                      handleAcceptCustom();
                    }
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-lg bg-background px-3 py-2 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <div className="max-h-60 overflow-y-auto p-1">
              {isLoading ? (
                <div className="px-3 py-3 text-sm text-muted-foreground">Завантаження вправ...</div>
              ) : filteredOptions.length === 0 ? (
                showCustomOption ? (
                  <button
                    type="button"
                    onClick={handleAcceptCustom}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-primary hover:bg-primary/10">
                    {customOptionLabel.replace("{value}", trimmedSearch)}
                  </button>
                ) : (
                  <div className="px-3 py-3 text-sm text-muted-foreground">{emptyText}</div>
                )
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={clsx(
                      "w-full rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-primary/10",
                      option.value === value && "bg-primary/15 font-medium",
                    )}>
                    {option.label}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

Select.displayName = "Select";