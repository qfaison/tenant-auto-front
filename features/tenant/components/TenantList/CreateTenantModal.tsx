"use client";

import { useEffect, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Form, Input, Select, Button, Typography, Divider } from "antd";
import {
  GlobalOutlined,
  UserOutlined,
  KeyOutlined,
  MailOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { CreateTenantParams } from "../../services/tenant.service";
import { TENANT_CONSTANTS } from "@/core/utils/constants";

type FormValues = {
  domainName: string | undefined;
  tenantName: string;
  customDomain?: string;
  apiKey: string;
  email?: string;
};

interface CreateTenantModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (params: CreateTenantParams) => Promise<void>;
  loading?: boolean;
}

export function CreateTenantModal({
  open,
  onClose,
  onSubmit,
  loading,
}: CreateTenantModalProps) {
  const t = useTranslations("tenant.create");
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: {
      domainName: undefined,
      tenantName: "",
      customDomain: "",
      apiKey: "",
      email: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        domainName: undefined,
        tenantName: "",
        customDomain: "",
        apiKey: "",
        email: "",
      });
    }
  }, [open, reset]);

  const onOk = useCallback(
    async (data: FormValues) => {
      if (!data.domainName) {
        return; // Validation should prevent this, but TypeScript safety
      }
      await onSubmit({
        domainName: data.domainName,
        tenantName: data.tenantName,
        customDomain: data.customDomain || undefined,
        apiKey: data.apiKey,
        email: data.email || undefined,
      });
      reset();
      onClose();
    },
    [onSubmit, reset, onClose],
  );

  const domainOptions = useMemo(
    () => TENANT_CONSTANTS.DOMAINS.map((d) => ({ label: d, value: d })),
    [],
  );

  const { SPACING } = TENANT_CONSTANTS;

  return (
    <Modal
      title={
        <>
          <Typography.Title
            level={3}
            style={{ margin: 0, marginBottom: SPACING.TITLE_MARGIN_BOTTOM }}
          >
            {t("title")}
          </Typography.Title>
          <Divider style={{ margin: 0 }} />
        </>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
      styles={{ body: { paddingTop: `${SPACING.FORM_ITEM_MARGIN_TOP}px` } }}
    >
      <form onSubmit={handleSubmit(onOk)}>
        <Form layout="vertical" component="div">
          <Form.Item
            label={
              <>
                <GlobalOutlined style={{ marginRight: SPACING.ICON_MARGIN }} />{" "}
                {t("domainName")}
              </>
            }
            required
            validateStatus={errors.domainName ? "error" : undefined}
            help={errors.domainName?.message}
          >
            <Controller
              name="domainName"
              control={control}
              rules={{ required: t("domainNameRequired") }}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || undefined}
                  placeholder={t("domainNamePlaceholder")}
                  options={domainOptions}
                  style={{ width: "100%" }}
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label={
              <>
                <UserOutlined style={{ marginRight: SPACING.ICON_MARGIN }} />{" "}
                {t("tenantName")}
              </>
            }
            required
            validateStatus={errors.tenantName ? "error" : undefined}
            help={errors.tenantName?.message}
          >
            <Controller
              name="tenantName"
              control={control}
              rules={{ required: t("tenantNameRequired") }}
              render={({ field }) => (
                <Input placeholder={t("tenantNamePlaceholder")} {...field} />
              )}
            />
          </Form.Item>
          <Form.Item
            label={
              <>
                <KeyOutlined style={{ marginRight: SPACING.ICON_MARGIN }} />{" "}
                {t("apiKey")}
              </>
            }
            required
            validateStatus={errors.apiKey ? "error" : undefined}
            help={errors.apiKey?.message}
          >
            <Controller
              name="apiKey"
              control={control}
              rules={{ required: t("apiKeyRequired") }}
              render={({ field }) => (
                <Input placeholder={t("apiKeyPlaceholder")} {...field} />
              )}
            />
          </Form.Item>
          <Form.Item
            label={
              <>
                <MailOutlined style={{ marginRight: SPACING.ICON_MARGIN }} />{" "}
                {t("email")}
              </>
            }
            validateStatus={errors.email ? "error" : undefined}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                  message: t("emailInvalid"),
                },
              }}
              render={({ field }) => (
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  {...field}
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label={
              <>
                <LinkOutlined style={{ marginRight: SPACING.ICON_MARGIN }} />{" "}
                {t("customDomain")}
              </>
            }
          >
            <Controller
              name="customDomain"
              control={control}
              render={({ field }) => (
                <Input placeholder={t("customDomainPlaceholder")} {...field} />
              )}
            />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
              >
                {t("submit")}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </form>
    </Modal>
  );
}
