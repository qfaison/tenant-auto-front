"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button, Result } from "antd";

export function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Result
        status="404"
        title={t("title")}
        subTitle={t("subTitle")}
        extra={
          <Link href="/tenant/list">
            <Button type="primary">{t("backHome")}</Button>
          </Link>
        }
      />
    </div>
  );
}
