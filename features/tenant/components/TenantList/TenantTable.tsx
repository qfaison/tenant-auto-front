"use client";

import { useCallback } from "react";
import { Table, Tag, Empty } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "@/core/lib/hash-router";
import { useTranslations } from "next-intl";
import type { Tenant } from "@/shared/types/tenant";
import dayjs from "dayjs";
import { APP_CONSTANT, TENANT_CONSTANTS } from "@/core/utils/constants";

interface TenantTableProps {
  tenants: Tenant[];
  loading: boolean;
}

export function TenantTable({ tenants, loading }: TenantTableProps) {
  const router = useRouter();
  const t = useTranslations("tenant.list.table");
  const { COLUMN_WIDTHS } = TENANT_CONSTANTS.TABLE;

  const handleRowClick = useCallback(
    (tenantId: string) => {
      router.push(
        `/${APP_CONSTANT.ROUTES.TENANT.DETAIL}?tenantId=${encodeURIComponent(tenantId)}`,
      );
    },
    [router],
  );

  const columns: ColumnsType<Tenant> = [
    {
      title: t("tenantId"),
      dataIndex: "tenantId",
      key: "tenantId",
      width: COLUMN_WIDTHS.TENANT_ID,
      render: (text: string, record: Tenant) => (
        <a
          onClick={() => handleRowClick(record.tenantId)}
          style={{ cursor: "pointer" }}
        >
          {text}
        </a>
      ),
    },
    {
      title: t("tenantName"),
      dataIndex: "tenantName",
      key: "tenantName",
      width: COLUMN_WIDTHS.TENANT_NAME,
      ellipsis: true,
    },
    {
      title: t("customDomain"),
      dataIndex: "customDomain",
      key: "customDomain",
      width: COLUMN_WIDTHS.CUSTOM_DOMAIN,
      ellipsis: true,
      render: (val: string) => val || t("na"),
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
      width: COLUMN_WIDTHS.EMAIL,
      ellipsis: true,
      render: (val: string) => val || t("na"),
    },
    {
      title: t("cancelRequest"),
      dataIndex: "cancelRequestStatus",
      key: "cancelRequestStatus",
      width: COLUMN_WIDTHS.CANCEL_REQUEST,
      render: (val: string) =>
        val ? (
          <Tag color={val === "APPROVED" ? "success" : "warning"}>{val}</Tag>
        ) : (
          <Tag color="default">{t("na")}</Tag>
        ),
    },
    {
      title: t("bankeloOnboarding"),
      key: "bankeloOnboarding",
      align: "end",
      width: COLUMN_WIDTHS.BANKELO_ONBOARDING,
      render: (_: unknown, record: Tenant) => {
        const bankelo = record.bankelo as
          | { status?: string; createdAt?: string }
          | undefined;
        if (!bankelo?.createdAt) return t("na");
        const dateStr = dayjs(bankelo.createdAt).format("DD-MM-YYYY");
        if (
          bankelo.status === "SUBMITTED_FOR_CUSTOMER" ||
          bankelo.status === "SUBMITTED_FOR_PARTY"
        ) {
          return <Tag color="success">✓ {dateStr}</Tag>;
        }
        if (bankelo.status === "PENDING") {
          return <Tag color="warning">⏳ {dateStr}</Tag>;
        }
        return <span>{dateStr}</span>;
      },
    },
  ];

  return (
    <Table
      rowKey="tenantId"
      columns={columns}
      dataSource={tenants}
      loading={loading}
      pagination={false}
      bordered
      size="middle"
      scroll={{ x: "max-content" }}
      locale={{
        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />,
      }}
      style={{ background: "transparent" }}
    />
  );
}
