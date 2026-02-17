"use client";

import { useTheme } from "@/core/hooks/useTheme";
import { Switch } from "antd";
import { BulbOutlined, BulbFilled } from "@ant-design/icons";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("common");
  return (
    <span className="flex items-center gap-1.5 text-sm text-foreground">
      {theme === "dark" ? <BulbFilled /> : <BulbOutlined />}
      <Switch
        checked={theme === "dark"}
        onChange={toggleTheme}
        size="small"
        title={theme === "dark" ? t("switchToLight") : t("switchToDark")}
      />
    </span>
  );
}
