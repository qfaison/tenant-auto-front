"use client";

import { useState, useCallback } from "react";
import {
  Card,
  Input,
  Button,
  Checkbox,
  Select,
  Pagination,
  Space,
  Typography,
  Flex,
  theme,
  Spin,
  Tooltip,
} from "antd";
import { PlusOutlined, ExportOutlined } from "@ant-design/icons";
import { useTenant } from "../../hooks/useTenant";
import { TenantTable } from "./TenantTable";
import { CreateTenantModal } from "./CreateTenantModal";
import { rowOptions } from "../../store/tenantStore";
import { useTranslations } from "next-intl";
import { TENANT_CONSTANTS } from "@/core/utils/constants";

const { Title } = Typography;
const { useToken } = theme;

export function TenantList() {
  const t = useTranslations("tenant.list");
  const { token } = useToken();
  const [searchInput, setSearchInput] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    tenants,
    totalCounts,
    page,
    limit,
    isOnboarding,
    loading,
    onSearchDebounced,
    onPageChange,
    onLimitChange,
    onBankeloOnlyChange,
    handleCreateTenant,
    handleUpdateTenant,
    handleExportBankelo,
  } = useTenant();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchInput(value);
      onSearchDebounced(value);
    },
    [onSearchDebounced],
  );

  const handleOpenCreateModal = useCallback(() => {
    setCreateModalOpen(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setCreateModalOpen(false);
  }, []);

  const onCreateSubmit = useCallback(
    async (params: Parameters<typeof handleCreateTenant>[0]) => {
      setActionLoading(true);
      try {
        await handleCreateTenant(params);
        setCreateModalOpen(false);
      } finally {
        setActionLoading(false);
      }
    },
    [handleCreateTenant],
  );

  const { SPACING, SIZES } = TENANT_CONSTANTS;

  return (
    <>
      {/* Fullscreen Loader */}
      <Spin spinning={loading} fullscreen />

      <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
        <Card
          styles={{
            body: {
              padding: `${SPACING.CARD_BODY_PADDING}px`,
            },
          }}
        >
          <Space orientation="vertical" size="large" style={{ width: "100%" }}>
            {/* Page Title Section */}
            <Title
              level={2}
              style={{ margin: 0, marginBottom: SPACING.TITLE_MARGIN_BOTTOM_SMALL }}
            >
              {t("title")}
            </Title>

            {/* Toolbar Section - Search, Filters, and Action Buttons */}
            <div
              style={{
                padding: `${SPACING.TOOLBAR_PADDING}px`,
                background: token.colorFillAlter,
                borderRadius: token.borderRadius,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <Flex
                wrap="wrap"
                gap="middle"
                align="center"
                justify="space-between"
              >
                <Flex
                  wrap="nowrap"
                  gap="middle"
                  align="center"
                  style={{ flex: 1 }}
                >
                  <Input.Search
                    placeholder={t("search")}
                    value={searchInput}
                    onChange={handleSearchChange}
                    allowClear
                    style={{
                      maxWidth: SIZES.SEARCH_MAX_WIDTH,
                      minWidth: SIZES.SEARCH_MIN_WIDTH,
                    }}
                  />
                  <Checkbox
                    checked={isOnboarding}
                    onChange={(e) => onBankeloOnlyChange(e.target.checked)}
                  >
                    {t("bankeloOnly")}
                  </Checkbox>
                </Flex>
                <Flex wrap="wrap" gap="middle">
                  <Tooltip title={t("createTooltip")}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleOpenCreateModal}
                    >
                      {t("create")}
                    </Button>
                  </Tooltip>
                  <Tooltip title={t("exportTooltip")}>
                    <Button
                      type="default"
                      icon={<ExportOutlined />}
                      onClick={handleExportBankelo}
                    >
                      {t("exportBankelo")}
                    </Button>
                  </Tooltip>
                </Flex>
              </Flex>
            </div>

            {/* Table Controls - Rows Selector and Pagination */}
            {totalCounts > 0 && (
              <Flex
                wrap="wrap"
                justify="space-between"
                align="center"
                gap="middle"
              >
                <Select
                  value={limit}
                  onChange={onLimitChange}
                  options={rowOptions.map((r) => ({
                    label: `${r} ${t("rowsPerPage")}`,
                    value: r,
                  }))}
                  style={{ width: SIZES.SELECT_WIDTH }}
                />
                <Pagination
                  current={page}
                  pageSize={limit}
                  total={totalCounts}
                  onChange={onPageChange}
                  showSizeChanger={false}
                  showTotal={(total) => t("paginationTotal", { total })}
                />
              </Flex>
            )}

            {/* Tenant Table */}
            <TenantTable tenants={tenants} loading={false} />
          </Space>
        </Card>

        <CreateTenantModal
          open={createModalOpen}
          onClose={handleCloseCreateModal}
          onSubmit={onCreateSubmit}
          loading={actionLoading}
        />
      </div>
    </>
  );
}
