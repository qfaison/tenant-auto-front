"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Form, Input, Button, Upload } from "antd";
import type { Tenant } from "@/shared/types/tenant";
import type { UpdateTenantParams } from "../../services/tenant.service";

type FormValues = {
  tenantId: string;
  customDomain: string;
};

interface UpdateTenantModalProps {
  open: boolean;
  tenant: Tenant | null;
  onClose: () => void;
  onSubmit: (params: UpdateTenantParams) => Promise<void>;
  loading?: boolean;
}

export function UpdateTenantModal({
  open,
  tenant,
  onClose,
  onSubmit,
  loading,
}: UpdateTenantModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { tenantId: "", customDomain: "" },
  });

  const [sslFile, setSslFile] = useState<File | null>(null);
  const [privateKeyFile, setPrivateKeyFile] = useState<File | null>(null);
  const [bundleFile, setBundleFile] = useState<File | null>(null);

  useEffect(() => {
    if (!tenant) return;
    reset({
      tenantId: tenant.tenantId,
      customDomain: tenant.customDomain || "",
    });
    queueMicrotask(() => {
      setSslFile(null);
      setPrivateKeyFile(null);
      setBundleFile(null);
    });
  }, [tenant, reset, open]);

  const onOk = async (data: FormValues) => {
    await onSubmit({
      tenantId: data.tenantId,
      customDomain: data.customDomain,
      sslCertificate: sslFile || undefined,
      privateKey: privateKeyFile || undefined,
      bundle: bundleFile || undefined,
    });
    onClose();
  };

  return (
    <Modal
      title="Update Custom Domain"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <form onSubmit={handleSubmit(onOk)}>
        <Form.Item
          label="Tenant ID"
          required
          validateStatus={errors.tenantId ? "error" : undefined}
          help={errors.tenantId?.message}
        >
          <Controller
            name="tenantId"
            control={control}
            rules={{ required: "Tenant ID is required" }}
            render={({ field }) => (
              <Input placeholder="Tenant ID" readOnly {...field} />
            )}
          />
        </Form.Item>
        <Form.Item
          label="Custom Domain"
          required
          validateStatus={errors.customDomain ? "error" : undefined}
          help={errors.customDomain?.message}
        >
          <Controller
            name="customDomain"
            control={control}
            rules={{ required: "Custom domain is required" }}
            render={({ field }) => (
              <Input placeholder="Enter custom domain" {...field} />
            )}
          />
        </Form.Item>
        <Form.Item label="SSL Certificate">
          <Upload
            maxCount={1}
            beforeUpload={(file) => {
              setSslFile(file);
              return false;
            }}
            onRemove={() => setSslFile(null)}
          >
            <Button>Select File</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="Private Key">
          <Upload
            maxCount={1}
            beforeUpload={(file) => {
              setPrivateKeyFile(file);
              return false;
            }}
            onRemove={() => setPrivateKeyFile(null)}
          >
            <Button>Select File</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="Bundle (Optional)">
          <Upload
            maxCount={1}
            beforeUpload={(file) => {
              setBundleFile(file);
              return false;
            }}
            onRemove={() => setBundleFile(null)}
          >
            <Button>Select File</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </form>
    </Modal>
  );
}
