"use client";

import { useTranslations } from "next-intl";
import { Button, Result } from "antd";
import { APP_CONSTANT } from "@/core/utils/constants";

export function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Result
        status="404"
        title={t("title")}
        subTitle={t("subTitle")}
        extra={
          <a href={`#/${APP_CONSTANT.ROUTES.TENANT.LIST}`}>
            <Button type="primary">{t("backHome")}</Button>
          </a>
        }
      />
    </div>
  );
}
