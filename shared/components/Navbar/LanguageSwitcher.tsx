"use client";

import { Select } from "antd";

/**
 * Language Switcher Component
 * Placeholder for future multi-language support
 * Currently shows English only
 */
export function LanguageSwitcher() {
  return (
    <Select
      defaultValue="en"
      style={{ width: 120 }}
      disabled
      options={[{ label: "English", value: "en" }]}
    />
  );
}
