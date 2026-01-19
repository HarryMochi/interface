"use client"

import { useState, useCallback } from "react"

export function useSearch<T extends Record<string, unknown>>(items: T[], searchKeys: (keyof T)[] = []) {
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = useCallback(() => {
    if (!searchTerm || searchKeys.length === 0) return items

    return items.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key]
        return value && String(value).toLowerCase().includes(searchTerm.toLowerCase())
      }),
    )
  }, [items, searchTerm, searchKeys])

  return {
    searchTerm,
    setSearchTerm,
    results: filtered(),
    hasResults: filtered().length > 0,
  }
}
