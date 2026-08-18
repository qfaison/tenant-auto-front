"use client";

import { useState, useEffect, startTransition } from "react";
import {
  Tabs,
  Card,
  Button,
  Dropdown,
  Input,
  Space,
  Descriptions,
  Upload,
  Radio,
  Tag,
  Tooltip,
  Form,
  Row,
  Col,
  theme,
} from "antd";
import type { MenuProps, UploadFile } from "antd";
import type { RcFile } from "antd/es/upload";
import { useForm, Controller } from "react-hook-form";
import {
  GlobalOutlined,
  BankOutlined,
  LinkOutlined,
  AppleOutlined,
  SettingOutlined,
  ArrowLeftOutlined,
  MailOutlined,
  LockOutlined,
  ThunderboltOutlined,
  UserOutlined,
  IdcardOutlined,
  CloudServerOutlined,
  CommentOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  CheckOutlined,
  SendOutlined,
  SafetyCertificateOutlined,
  KeyOutlined,
  FolderOutlined,
  SaveOutlined,
  FileTextOutlined,
  BuildOutlined,
  BarChartOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  FileOutlined,
  DownloadOutlined,
  ShoppingOutlined,
  FacebookOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  InstagramOutlined,
  PinterestOutlined,
  GoogleOutlined,
  PhoneOutlined,
  CameraOutlined,
  ClockCircleOutlined,
  ShareAltOutlined,
  FlagOutlined,
  UploadOutlined,
  PaperClipOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname, useSearchParams } from "@/core/lib/hash-router";
import type { Tenant } from "@/shared/types/tenant";
import { useTranslations } from "next-intl";
import type { UpdateTenantParams } from "../../services/tenant.service";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
interface TenantTabsProps {
  tenant: Tenant | null;
  webhookBaseUrl: string;
  actionLoading: boolean;
  bonanzaEntriesLoading: boolean;
  onUpdatePassword: () => void;
  onProcessMissingBonanzaEntries: () => Promise<void>;
  onBack: () => void;
  onUpdateWebhook: (baseUrl: string) => Promise<void>;
  onUpdateEmail: (email: string) => void;
  onSetupSSL: () => void;
  onUpdate3PL: (threePL: string) => void;
  onBPlannedProvision: () => void;
  onSendWelcomeEmail: () => void;
  onApproveCancelRequest: () => void;
  onQa3Initiate: () => void;
  onQa3Approve: () => void;
  onWebhook: () => void;
  onCancelAccounts: () => void;
  onBankeloOnboarding: () => void;
  onBankeloDocumentSubmission: (documentType: string) => Promise<void>;
  onUploadAppleVerification: (file: File) => Promise<void>;
  onUpdateTenant: (params: UpdateTenantParams) => Promise<void>;
  actions: {
    handleMakePublic: () => void;
    handleMakePrivate: () => void;
    handleStop: () => void;
    handleRestart: () => void;
  };
}

/**
 * Extracts the actual File object from Ant Design's Upload file parameter.
 * Handles both RcFile (File | Blob) and UploadFile (which may have originFileObj).
 */
function extractFile(file: RcFile | UploadFile): File {
  // If it's an UploadFile with originFileObj, use that
  if ('originFileObj' in file && file.originFileObj) {
    return file.originFileObj as File;
  }
  // Otherwise, it's already a File or Blob - cast to File
  return file as File;
}

const { useToken } = theme;

export function TenantTabs({
  tenant,
  webhookBaseUrl,
  actionLoading,
  bonanzaEntriesLoading,
  onUpdatePassword,
  onProcessMissingBonanzaEntries,
  onUpdateWebhook,
  onUpdateEmail,
  onSetupSSL,
  onUpdate3PL,
  onBPlannedProvision,
  onSendWelcomeEmail,
  onApproveCancelRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onQa3Initiate,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onQa3Approve,
  onWebhook,
  onCancelAccounts,
  onBankeloOnboarding,
  onBankeloDocumentSubmission,
  onUploadAppleVerification,
  onUpdateTenant,
  actions,
}: TenantTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("tenant.detail");
  const { token } = useToken();
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState(tenant?.email ?? "");
  const [threePLModalOpen, setThreePLModalOpen] = useState(false);
  const [threePLInput, setThreePLInput] = useState(tenant?.threePL ?? "");
  const [threePLConfirmModalOpen, setThreePLConfirmModalOpen] = useState(false);
  const [pendingThreePL, setPendingThreePL] = useState<string>("");
  const [isWebhookEditing, setIsWebhookEditing] = useState(false);
  const [webhookEditValue, setWebhookEditValue] = useState(webhookBaseUrl);
  const [approveCancelModalOpen, setApproveCancelModalOpen] = useState(false);
  const [emailValidationError, setEmailValidationError] = useState<string>("");
  const [makePublicModalOpen, setMakePublicModalOpen] = useState(false);
  const [makePrivateModalOpen, setMakePrivateModalOpen] = useState(false);
  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [restartModalOpen, setRestartModalOpen] = useState(false);
  const [bankeloOnboardingModalOpen, setBankeloOnboardingModalOpen] =
    useState(false);
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);

  const TAB_KEYS = [
    "tenant",
    "custom-domain",
    "bonanza-connect",
    "bankelo",
    "ghl",
    "apple",
  ];
  const [activeTab, setActiveTab] = useState<string>("tenant");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "update-password") {
      setActionsMenuOpen(true);
    } else if (tab && TAB_KEYS.includes(tab)) {
      setActiveTab(tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    const params = new URLSearchParams(searchParams);
    params.set("tab", key);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Apple Verification form state
  const [appleVerificationFile, setAppleVerificationFile] =
    useState<File | null>(null);
  const [appleVerificationTouched, setAppleVerificationTouched] =
    useState(false);

  // Custom Domain form state
  type CustomDomainFormValues = {
    tenantId: string;
    customDomain: string;
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomDomainFormValues>({
    mode: "onChange",
    defaultValues: {
      tenantId: tenant?.tenantId || "",
      customDomain: tenant?.customDomain || "",
    },
  });
  const [sslFile, setSslFile] = useState<File | null>(null);
  const [privateKeyFile, setPrivateKeyFile] = useState<File | null>(null);
  const [bundleFile, setBundleFile] = useState<File | null>(null);
  const [fileErrors, setFileErrors] = useState<{
    ssl?: string;
    privateKey?: string;
  }>({});
  const [filesTouched, setFilesTouched] = useState<{
    ssl: boolean;
    privateKey: boolean;
  }>({ ssl: false, privateKey: false });

  // Validate files immediately when they change
  useEffect(() => {
    const newFileErrors: { ssl?: string; privateKey?: string } = {};
    if (filesTouched.ssl && !sslFile) {
      newFileErrors.ssl = "*SSL Certificate is required";
    }
    if (filesTouched.privateKey && !privateKeyFile) {
      newFileErrors.privateKey = "*Private Key is required";
    }
    startTransition(() => {
      setFileErrors(newFileErrors);
    });
  }, [sslFile, privateKeyFile, filesTouched]);

  // Reset form when tenant data changes
  useEffect(() => {
    if (tenant) {
      reset({
        tenantId: tenant.tenantId || "",
        customDomain: tenant.customDomain || "",
      });
      startTransition(() => {
        setSslFile(null);
        setPrivateKeyFile(null);
        setBundleFile(null);
        setFileErrors({});
        setFilesTouched({ ssl: false, privateKey: false });
      });
    }
  }, [tenant, reset]);

  const actionItems: MenuProps["items"] = [
    {
      key: "public",
      label: "Make Public",
      icon: <GlobalOutlined />,
      onClick: () => setMakePublicModalOpen(true),
    },
    {
      key: "private",
      label: "Make Private",
      icon: <LockOutlined />,
      onClick: () => setMakePrivateModalOpen(true),
    },
    {
      key: "stop",
      label: "Stop",
      icon: <ThunderboltOutlined />,
      onClick: () => setStopModalOpen(true),
    },
    {
      key: "restart",
      label: "Restart",
      icon: <ThunderboltOutlined />,
      onClick: () => setRestartModalOpen(true),
    },
    {
      key: "welcome",
      label: !tenant?.email ? (
        <Tooltip title="No email available for this tenant">
          <span style={{ cursor: "not-allowed" }}>Send Welcome Mail</span>
        </Tooltip>
      ) : (
        "Send Welcome Mail"
      ),
      icon: <SendOutlined />,
      onClick: onSendWelcomeEmail,
      disabled: !tenant?.email,
    },
    {
      key: "updatePassword",
      label: "Update Password",
      icon: <KeyOutlined />,
      onClick: onUpdatePassword,
    },
  ];

  const handleBack = () => {
    router.push("/tenant/list");
  };

  const getDaysLeft = (expiryDate: string | Date): number => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const isSSLSetupDisabled = (): boolean => {
    if (!tenant?.customDomain) return true;
    if (tenant?.sslExpiryDate) {
      const daysLeft = getDaysLeft(tenant.sslExpiryDate);
      if (daysLeft > 5) return true;
    }
    return false;
  };

  const getSSLTooltip = (): string => {
    if (!tenant?.customDomain) {
      return "Please setup a custom domain first";
    }
    if (tenant?.sslExpiryDate) {
      const daysLeft = getDaysLeft(tenant.sslExpiryDate);
      if (daysLeft > 5) {
        return `SSL valid. ${daysLeft} days left until renewal`;
      }
      return `SSL expires in ${daysLeft} days. Click to renew.`;
    }
    return "Click to setup SSL";
  };

  const formatDate = (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  useEffect(() => {
    if (!isWebhookEditing) {
      startTransition(() => {
        setWebhookEditValue(webhookBaseUrl);
      });
    }
  }, [webhookBaseUrl, isWebhookEditing]);

  return (
    <>
      <Card
        title={
          <Space>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
            />
            <span>
              {t("title")} - {tenant?.tenantName ?? tenant?.tenantId}
            </span>
          </Space>
        }
      >
        <Tabs
          defaultActiveKey="tenant"
          items={[
            {
              key: "tenant",
              label: (
                <span>
                  <SettingOutlined /> {t("tenant")}
                </span>
              ),
              children: (
                <Card
                  title={`${t("tenant")} ${tenant?.tenantName ?? ""} Information`}
                  extra={
                    <Space>
                      <Button
                        type="primary"
                        icon={<UserOutlined />}
                        loading={bonanzaEntriesLoading}
                        onClick={onProcessMissingBonanzaEntries}
                      >
                        Create Booth &amp; Bonanza Users
                      </Button>
                      <Dropdown
                        menu={{ items: actionItems }}
                        placement="bottomRight"
                        open={actionsMenuOpen}
                        onOpenChange={setActionsMenuOpen}
                      >
                        <Button id="update-password" icon={<SettingOutlined />}>
                          Actions
                        </Button>
                      </Dropdown>
                    </Space>
                  }
                >
                  <Descriptions column={2} bordered size="small">
                    {/* Row 1: Tenant Name / Tenant ID */}
                    <Descriptions.Item
                      label={
                        <>
                          <UserOutlined style={{ marginRight: 8 }} /> Tenant
                          Name
                        </>
                      }
                    >
                      {tenant?.tenantName ?? "NA"}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <IdcardOutlined style={{ marginRight: 8 }} /> Tenant
                          ID
                        </>
                      }
                    >
                      {tenant?.tenantId}
                    </Descriptions.Item>

                    {/* Row 2: Custom Domain / Domain */}
                    <Descriptions.Item
                      label={
                        <>
                          <SettingOutlined style={{ marginRight: 8 }} /> Custom
                          Domain
                        </>
                      }
                    >
                      <Space>
                        <span>{tenant?.customDomain ?? "N/A"}</span>
                        <Tooltip title={getSSLTooltip()}>
                          <Button
                            size="small"
                            icon={<LockOutlined />}
                            onClick={onSetupSSL}
                            disabled={isSSLSetupDisabled()}
                          >
                            Setup SSL
                          </Button>
                        </Tooltip>
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <GlobalOutlined style={{ marginRight: 8 }} /> Domain
                        </>
                      }
                    >
                      {tenant?.domainName ?? "NA"}
                    </Descriptions.Item>

                    {/* Row 3: SSL Issued Date / SSL Expiry Date - CONDITIONAL */}
                    {(tenant?.sslIssuedAt || tenant?.sslExpiryDate) && (
                      <>
                        <Descriptions.Item
                          label={
                            <>
                              <CalendarOutlined style={{ marginRight: 8 }} />{" "}
                              SSL Issued Date
                            </>
                          }
                        >
                          {tenant?.sslIssuedAt
                            ? formatDate(tenant.sslIssuedAt)
                            : "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <>
                              <CalendarOutlined style={{ marginRight: 8 }} />{" "}
                              SSL Expiry Date
                            </>
                          }
                        >
                          {tenant?.sslExpiryDate
                            ? formatDate(tenant.sslExpiryDate)
                            : "N/A"}
                        </Descriptions.Item>
                      </>
                    )}

                    {/* Row 4: Ws2 Url / Erp Url */}
                    <Descriptions.Item
                      label={
                        <>
                          <LinkOutlined style={{ marginRight: 8 }} /> Ws2 Url
                        </>
                      }
                    >
                      {tenant?.ws2Url ? (
                        <a
                          href={`https://${tenant.ws2Url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {tenant.ws2Url}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <LinkOutlined style={{ marginRight: 8 }} /> Erp Url
                        </>
                      }
                    >
                      {tenant?.erpUrl ? (
                        <a
                          href={`https://${tenant.erpUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {tenant.erpUrl}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </Descriptions.Item>

                    {/* Row 5: Email / IP Address */}
                    <Descriptions.Item
                      label={
                        <>
                          <MailOutlined style={{ marginRight: 8 }} /> Email
                        </>
                      }
                    >
                      <Space>
                        <span>{tenant?.email ?? "NA"}</span>
                        <Button
                          size="small"
                          onClick={() => {
                            setEmailModalOpen(true);
                            setEmailInput(tenant?.email ?? "");
                            setEmailValidationError("");
                          }}
                        >
                          Update
                        </Button>
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <CloudServerOutlined style={{ marginRight: 8 }} /> IP
                          Address
                        </>
                      }
                    >
                      {tenant?.ipAddress ?? "N/A"}
                    </Descriptions.Item>

                    {/* Row 6: IPN Url / 3PL - Same row */}
                    <Descriptions.Item
                      label={
                        <>
                          <CloudServerOutlined style={{ marginRight: 8 }} /> IPN
                          URL
                        </>
                      }
                    >
                      {tenant?.ipnUrl ? (
                        <a
                          href={tenant.ipnUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {tenant.ipnUrl}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="3PL">
                      <Radio.Group
                        value={tenant?.threePL ?? "N"}
                        onChange={(e) => {
                          setPendingThreePL(e.target.value);
                          setThreePLConfirmModalOpen(true);
                        }}
                      >
                        <Radio value="Y">Yes</Radio>
                        <Radio value="N">No</Radio>
                      </Radio.Group>
                    </Descriptions.Item>

                    <Descriptions.Item label="Booth User ID">
                      {String(tenant?.boothUser?.userID ?? "NA")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Booth User Name">
                      {String(tenant?.boothUser?.userName ?? "NA")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Booth User Email">
                      {String(tenant?.boothUser?.email ?? "NA")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Booth ID">
                      {String(tenant?.boothUser?.boothID ?? "NA")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Booth URL">
                      {(() => {
                        const boothURL = tenant?.boothUser?.boothURL;
                        return boothURL ? <a href={String(boothURL)} target="_blank" rel="noopener noreferrer">{String(boothURL)}</a> : "NA";
                      })()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Bonanza Connect User Created">
                      <Tag color={tenant?.isBonanzaTenantCreated ? "success" : "default"}>
                        {tenant?.isBonanzaTenantCreated ? "Yes" : "No"}
                      </Tag>
                    </Descriptions.Item>
                    {/* Row 7: bPlanned */}
                    <Descriptions.Item
                      label={
                        <>
                          <SettingOutlined style={{ marginRight: 8 }} />{" "}
                          bPlanned
                        </>
                      }
                    >
                      <Space>
                        <span>{tenant?.bPlanned?.dashboard_url ?? "N/A"}</span>
                        <Button
                          size="small"
                          icon={<LockOutlined />}
                          onClick={onBPlannedProvision}
                          disabled={!!tenant?.bPlanned?.dashboard_url}
                        >
                          Provision bPlanned
                        </Button>
                      </Space>
                    </Descriptions.Item>

                    {/* Row 8: Cancel Request Status / Billing Status / Action Buttons */}
                    <Descriptions.Item label="Cancel Request Status">
                      {tenant?.cancelRequestStatus ? (
                        <Tag
                          color={
                            tenant.cancelRequestStatus === "APPROVED"
                              ? "success"
                              : "warning"
                          }
                        >
                          {tenant.cancelRequestStatus}
                        </Tag>
                      ) : (
                        <Tag color="default">NA</Tag>
                      )}
                    </Descriptions.Item>
                    {/* Billing Status - Hidden to match Angular */}
                    {false && tenant && (
                      <Descriptions.Item label="Billing Status">
                        {tenant?.billingStatus ? (
                          <Tag color="warning">{tenant?.billingStatus}</Tag>
                        ) : (
                          <Tag color="success">BILLING</Tag>
                        )}
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item
                      label={
                        <>
                          <CommentOutlined style={{ marginRight: 8 }} /> Webhook
                          configure
                        </>
                      }
                    >
                      <Space>
                        <Input
                          value={
                            isWebhookEditing ? webhookEditValue : webhookBaseUrl
                          }
                          onChange={(e) => setWebhookEditValue(e.target.value)}
                          disabled={!isWebhookEditing}
                          style={{ width: 400 }}
                        />
                        <Button
                          onClick={() => {
                            if (isWebhookEditing) {
                              onUpdateWebhook(webhookEditValue);
                              setIsWebhookEditing(false);
                            } else {
                              setWebhookEditValue(webhookBaseUrl);
                              setIsWebhookEditing(true);
                            }
                          }}
                        >
                          {isWebhookEditing ? "UPDATE" : "EDIT"}
                        </Button>
                      </Space>
                    </Descriptions.Item>

                    {/* Row 9: Cancel Request Reason */}
                    <Descriptions.Item
                      label={
                        <>
                          <CommentOutlined style={{ marginRight: 8 }} /> Cancel
                          Request Reason
                        </>
                      }
                    >
                      {tenant?.cancelRequestReason ?? "NA"}
                    </Descriptions.Item>

                    {/* Row 10: Action Buttons */}
                    <Descriptions.Item label="">
                      <Space wrap>
                        <Button
                          size="small"
                          icon={<CheckOutlined />}
                          onClick={() => setApproveCancelModalOpen(true)}
                        >
                          Approve Cancel Request
                        </Button>
                        <Button
                          size="small"
                          icon={<GlobalOutlined />}
                          onClick={onWebhook}
                        >
                          Webhook
                        </Button>
                        <Button
                          size="small"
                          icon={<UserOutlined />}
                          onClick={onCancelAccounts}
                        >
                          Cancel Accounts
                        </Button>
                      </Space>
                    </Descriptions.Item>
                  </Descriptions>

                </Card>
              ),
            },
            {
              key: "custom-domain",
              label: (
                <span>
                  <GlobalOutlined /> Custom Domain
                </span>
              ),
              children: (
                <Card
                  title={`Tenant ${tenant?.tenantName || tenant?.tenantId} Update Custom Domain`}
                >
                  <form
                    onSubmit={handleSubmit(async (data) => {
                      // Mark files as touched for validation
                      setFilesTouched({ ssl: true, privateKey: true });

                      // Validate file uploads
                      const newFileErrors: {
                        ssl?: string;
                        privateKey?: string;
                      } = {};
                      if (!sslFile) {
                        newFileErrors.ssl = "*SSL Certificate is required";
                      }
                      if (!privateKeyFile) {
                        newFileErrors.privateKey = "*Private Key is required";
                      }

                      if (Object.keys(newFileErrors).length > 0) {
                        setFileErrors(newFileErrors);
                        return;
                      }

                      setFileErrors({});
                      await onUpdateTenant({
                        tenantId: data.tenantId,
                        customDomain: data.customDomain,
                        sslCertificate: sslFile || undefined,
                        privateKey: privateKeyFile || undefined,
                        bundle: bundleFile || undefined,
                      });
                      reset();
                      setSslFile(null);
                      setPrivateKeyFile(null);
                      setBundleFile(null);
                      setFilesTouched({ ssl: false, privateKey: false });
                    })}
                    style={{ padding: "16px 0" }}
                  >
                    {/* Basic Information Section */}
                    <Card
                      type="inner"
                      title={
                        <Space>
                          <InfoCircleOutlined />
                          <span>Basic Information</span>
                        </Space>
                      }
                      style={{ marginBottom: 24 }}
                    >
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={
                              <span>
                                <UserOutlined style={{ marginRight: 8 }} />{" "}
                                Tenant ID
                              </span>
                            }
                            required
                            validateStatus={
                              errors.tenantId ? "error" : undefined
                            }
                            help={
                              errors.tenantId ? (
                                <span
                                  style={{ color: "#ff4d4f", fontSize: "14px" }}
                                >
                                  {errors.tenantId.message}
                                </span>
                              ) : undefined
                            }
                          >
                            <Controller
                              name="tenantId"
                              control={control}
                              rules={{ required: "*Tenant ID is required" }}
                              render={({ field }) => (
                                <Input
                                  placeholder="Enter tenant ID"
                                  readOnly
                                  {...field}
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={
                              <span>
                                <GlobalOutlined style={{ marginRight: 8 }} />{" "}
                                Custom Domain
                              </span>
                            }
                            required
                            validateStatus={
                              errors.customDomain ? "error" : undefined
                            }
                            help={
                              errors.customDomain ? (
                                <span
                                  style={{ color: "#ff4d4f", fontSize: "14px" }}
                                >
                                  {errors.customDomain.message}
                                </span>
                              ) : undefined
                            }
                          >
                            <Controller
                              name="customDomain"
                              control={control}
                              rules={{
                                required: "*Custom domain name is required",
                              }}
                              render={({ field }) => (
                                <Input
                                  placeholder="Enter custom domain name"
                                  {...field}
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>

                    {/* SSL Certificates Section */}
                    <Card
                      type="inner"
                      title={
                        <Space>
                          <SafetyCertificateOutlined />
                          <span>SSL Certificates</span>
                        </Space>
                      }
                      style={{ marginBottom: 24 }}
                    >
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={
                              <span>
                                <SafetyCertificateOutlined
                                  style={{ marginRight: 8 }}
                                />{" "}
                                SSL Certificate
                              </span>
                            }
                            required
                            validateStatus={
                              fileErrors.ssl ? "error" : undefined
                            }
                            help={
                              fileErrors.ssl ? (
                                <span
                                  style={{ color: "#ff4d4f", fontSize: "14px" }}
                                >
                                  {fileErrors.ssl}
                                </span>
                              ) : undefined
                            }
                          >
                            <Upload
                              maxCount={1}
                              showUploadList={false}
                              fileList={
                                sslFile
                                  ? [
                                      {
                                        uid: "ssl",
                                        name: sslFile.name,
                                        size: sslFile.size,
                                        status: "done",
                                      },
                                    ]
                                  : []
                              }
                              beforeUpload={(file) => {
                                const actualFile = extractFile(file);
                                setSslFile(actualFile);
                                setFilesTouched((prev) => ({
                                  ...prev,
                                  ssl: true,
                                }));
                                return false;
                              }}
                              onRemove={() => {
                                setSslFile(null);
                                setFilesTouched((prev) => ({
                                  ...prev,
                                  ssl: true,
                                }));
                              }}
                            >
                              <Button
                                icon={<UploadOutlined />}
                                onClick={() =>
                                  setFilesTouched((prev) => ({
                                    ...prev,
                                    ssl: true,
                                  }))
                                }
                              >
                                Choose file
                              </Button>
                            </Upload>
                            {sslFile && (
                              <div
                                style={{
                                  marginTop: 8,
                                  padding: "8px 12px",
                                  background: token.colorFillSecondary,
                                  borderRadius: 4,
                                  border: `1px solid ${token.colorPrimary}40`,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Space>
                                  <PaperClipOutlined
                                    style={{ color: token.colorPrimary }}
                                  />
                                  <span
                                    style={{
                                      fontWeight: 500,
                                      color: token.colorText,
                                    }}
                                  >
                                    {sslFile.name}
                                  </span>
                                  <span
                                    style={{
                                      color: token.colorTextSecondary,
                                      fontSize: "12px",
                                    }}
                                  >
                                    ({formatFileSize(sslFile.size)})
                                  </span>
                                </Space>
                                <Button
                                  type="text"
                                  icon={<DeleteOutlined />}
                                  onClick={() => {
                                    setSslFile(null);
                                    setFilesTouched((prev) => ({
                                      ...prev,
                                      ssl: true,
                                    }));
                                  }}
                                  style={{ color: "#ff4d4f" }}
                                  size="small"
                                />
                              </div>
                            )}
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={
                              <span>
                                <KeyOutlined style={{ marginRight: 8 }} />{" "}
                                Private Key
                              </span>
                            }
                            required
                            validateStatus={
                              fileErrors.privateKey ? "error" : undefined
                            }
                            help={
                              fileErrors.privateKey ? (
                                <span
                                  style={{ color: "#ff4d4f", fontSize: "14px" }}
                                >
                                  {fileErrors.privateKey}
                                </span>
                              ) : undefined
                            }
                          >
                            <Upload
                              maxCount={1}
                              showUploadList={false}
                              fileList={
                                privateKeyFile
                                  ? [
                                      {
                                        uid: "privateKey",
                                        name: privateKeyFile.name,
                                        size: privateKeyFile.size,
                                        status: "done",
                                      },
                                    ]
                                  : []
                              }
                              beforeUpload={(file) => {
                                const actualFile = extractFile(file);
                                setPrivateKeyFile(actualFile);
                                setFilesTouched((prev) => ({
                                  ...prev,
                                  privateKey: true,
                                }));
                                return false;
                              }}
                              onRemove={() => {
                                setPrivateKeyFile(null);
                                setFilesTouched((prev) => ({
                                  ...prev,
                                  privateKey: true,
                                }));
                              }}
                            >
                              <Button
                                icon={<UploadOutlined />}
                                onClick={() =>
                                  setFilesTouched((prev) => ({
                                    ...prev,
                                    privateKey: true,
                                  }))
                                }
                              >
                                Choose file
                              </Button>
                            </Upload>
                            {privateKeyFile && (
                              <div
                                style={{
                                  marginTop: 8,
                                  padding: "8px 12px",
                                  background: token.colorFillSecondary,
                                  borderRadius: 4,
                                  border: `1px solid ${token.colorPrimary}40`,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Space>
                                  <PaperClipOutlined
                                    style={{ color: token.colorPrimary }}
                                  />
                                  <span
                                    style={{
                                      fontWeight: 500,
                                      color: token.colorText,
                                    }}
                                  >
                                    {privateKeyFile.name}
                                  </span>
                                  <span
                                    style={{
                                      color: token.colorTextSecondary,
                                      fontSize: "12px",
                                    }}
                                  >
                                    ({formatFileSize(privateKeyFile.size)})
                                  </span>
                                </Space>
                                <Button
                                  type="text"
                                  icon={<DeleteOutlined />}
                                  onClick={() => {
                                    setPrivateKeyFile(null);
                                    setFilesTouched((prev) => ({
                                      ...prev,
                                      privateKey: true,
                                    }));
                                  }}
                                  style={{ color: "#ff4d4f" }}
                                  size="small"
                                />
                              </div>
                            )}
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={
                              <span>
                                <FolderOutlined style={{ marginRight: 8 }} />{" "}
                                Bundle (Optional)
                              </span>
                            }
                          >
                            <Upload
                              maxCount={1}
                              showUploadList={false}
                              fileList={
                                bundleFile
                                  ? [
                                      {
                                        uid: "bundle",
                                        name: bundleFile.name,
                                        size: bundleFile.size,
                                        status: "done",
                                      },
                                    ]
                                  : []
                              }
                              beforeUpload={(file) => {
                                const actualFile = extractFile(file);
                                setBundleFile(actualFile);
                                return false;
                              }}
                              onRemove={() => setBundleFile(null)}
                            >
                              <Button icon={<UploadOutlined />}>
                                Choose file
                              </Button>
                            </Upload>
                            {bundleFile && (
                              <div
                                style={{
                                  marginTop: 8,
                                  padding: "8px 12px",
                                  background: token.colorFillSecondary,
                                  borderRadius: 4,
                                  border: `1px solid ${token.colorPrimary}40`,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Space>
                                  <PaperClipOutlined
                                    style={{ color: token.colorPrimary }}
                                  />
                                  <span
                                    style={{
                                      fontWeight: 500,
                                      color: token.colorText,
                                    }}
                                  >
                                    {bundleFile.name}
                                  </span>
                                  <span
                                    style={{
                                      color: token.colorTextSecondary,
                                      fontSize: "12px",
                                    }}
                                  >
                                    ({formatFileSize(bundleFile.size)})
                                  </span>
                                </Space>
                                <Button
                                  type="text"
                                  icon={<DeleteOutlined />}
                                  onClick={() => setBundleFile(null)}
                                  style={{ color: "#ff4d4f" }}
                                  size="small"
                                />
                              </div>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>

                    {/* Update Button */}
                    <Form.Item style={{ marginTop: 32, textAlign: "center" }}>
                      <Tooltip title="Please verify that the data is correct before submitting.">
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<SaveOutlined />}
                          size="large"
                          loading={actionLoading}
                          style={{
                            minWidth: 200,
                            height: 48,
                            fontSize: 16,
                            fontWeight: 500,
                            boxShadow: "0 2px 8px rgba(24, 144, 255, 0.3)",
                          }}
                        >
                          Update Custom Domain
                        </Button>
                      </Tooltip>
                    </Form.Item>
                  </form>
                </Card>
              ),
            },
            {
              key: "bonanza-connect",
              label: (
                <span>
                  <LinkOutlined /> {t("bonanzaConnect")}
                </span>
              ),
              children: (
                <Card
                  title={`Tenant ${tenant?.tenantName || tenant?.tenantId} Bonanza Connect Information`}
                >
                  {(() => {
                    const bonanzaEmail =
                      tenant?.bonanzaConnect &&
                      typeof tenant.bonanzaConnect === "object" &&
                      "email" in tenant.bonanzaConnect
                        ? (tenant.bonanzaConnect as { email?: string }).email
                        : undefined;
                    return bonanzaEmail ? (
                      <Row>
                        <Col xs={24} md={12}>
                          <Space>
                            <MailOutlined style={{ marginRight: 8 }} />
                            <span>Email:</span>
                            <strong>{bonanzaEmail ?? "NA"}</strong>
                          </Space>
                        </Col>
                      </Row>
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <span>Data not found.</span>
                      </div>
                    );
                  })()}
                </Card>
              ),
            },
            {
              key: "bankelo",
              label: (
                <span>
                  <BankOutlined /> {t("bankelo")}
                </span>
              ),
              children: (() => {
                const bankelo = tenant?.bankelo as
                  | {
                      legalName?: string;
                      externalId?: string;
                      registrationNumber?: string;
                      side?: string;
                      organizationType?: string;
                      industry?: string;
                      lineOfBusiness?: string;
                      taxId?: string;
                      countryOfOperation?: string;
                      countryOfRegistration?: string;
                      currencyCode?: string;
                      website?: string;
                      addressLine1?: string;
                      postalCode?: string;
                      city?: string;
                      province?: string;
                      country?: string;
                      documents?: Array<{
                        label?: string;
                        identifier?: string;
                        url?: string;
                        type?: string;
                        id?: string;
                      }>;
                      id?: string;
                    }
                  | undefined;

                const handleDownloadDocument = (url?: string) => {
                  if (!url) return;
                  const BASE_URL =
                    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
                  const a = document.createElement("a");
                  a.href = `${BASE_URL}/${url}`;
                  a.target = "_blank";
                  a.click();
                };

                const handleSubmitDocument = async (documentType?: string) => {
                  if (!documentType) return;
                  await onBankeloDocumentSubmission(documentType);
                };

                return (
                  <Card
                    title={`Tenant ${tenant?.tenantName || tenant?.tenantId} Bankelo Information`}
                    extra={
                      <Button
                        onClick={() => setBankeloOnboardingModalOpen(true)}
                      >
                        Submit for Approval
                      </Button>
                    }
                  >
                    {bankelo && bankelo.externalId ? (
                      <>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} md={12}>
                            <Space
                              orientation="vertical"
                              size="small"
                              style={{ width: "100%" }}
                            >
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <UserOutlined style={{ marginRight: 8 }} />{" "}
                                  Legal Name:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {bankelo.legalName || "NA"}
                                </p>
                              </div>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <IdcardOutlined style={{ marginRight: 8 }} />{" "}
                                  External ID:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {bankelo.externalId || "NA"}
                                </p>
                              </div>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <FileTextOutlined
                                    style={{ marginRight: 8 }}
                                  />{" "}
                                  Registration Number:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {bankelo.registrationNumber || "NA"}
                                </p>
                              </div>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <InfoCircleOutlined
                                    style={{ marginRight: 8 }}
                                  />{" "}
                                  Side:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {bankelo.side || "NA"}
                                </p>
                              </div>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <BuildOutlined style={{ marginRight: 8 }} />{" "}
                                  Organization Type:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {bankelo.organizationType || "NA"}
                                </p>
                              </div>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <BarChartOutlined
                                    style={{ marginRight: 8 }}
                                  />{" "}
                                  Industry:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {bankelo.industry || "NA"}
                                </p>
                              </div>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <ShoppingOutlined
                                    style={{ marginRight: 8 }}
                                  />{" "}
                                  Line of Business:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {bankelo.lineOfBusiness || "NA"}
                                </p>
                              </div>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <IdcardOutlined style={{ marginRight: 8 }} />{" "}
                                  Tax Id:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {bankelo.taxId || "NA"}
                                </p>
                              </div>
                            </Space>
                          </Col>
                          <Col xs={24} md={12}>
                            <Space
                              orientation="vertical"
                              size="small"
                              style={{ width: "100%" }}
                            >
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <GlobalOutlined style={{ marginRight: 8 }} />{" "}
                                  Country of Operation:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {bankelo.countryOfOperation || "NA"}
                                </p>
                              </div>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <GlobalOutlined style={{ marginRight: 8 }} />{" "}
                                  Country of Registration:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {bankelo.countryOfRegistration || "NA"}
                                </p>
                              </div>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <GlobalOutlined style={{ marginRight: 8 }} />{" "}
                                  Currency Code:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {bankelo.currencyCode || "NA"}
                                </p>
                              </div>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <LinkOutlined style={{ marginRight: 8 }} />{" "}
                                  Website:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {bankelo.website || "NA"}
                                </p>
                              </div>
                            </Space>
                          </Col>
                        </Row>

                        {/* Billing Address Section */}
                        <div style={{ marginTop: 24 }}>
                          <h6
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: 16,
                            }}
                          >
                            <EnvironmentOutlined style={{ marginRight: 8 }} />{" "}
                            Billing Address
                          </h6>
                          <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <HomeOutlined style={{ marginRight: 8 }} />{" "}
                                  Address:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {bankelo.addressLine1 || "NA"}
                                </p>
                              </div>
                            </Col>
                            <Col xs={24} md={12}>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <MailOutlined style={{ marginRight: 8 }} />{" "}
                                  Postal Code:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {bankelo.postalCode || "NA"}
                                </p>
                              </div>
                            </Col>
                            <Col xs={24} md={12}>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <BuildOutlined style={{ marginRight: 8 }} />{" "}
                                  City:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {bankelo.city || "NA"}
                                </p>
                              </div>
                            </Col>
                            <Col xs={24} md={12}>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <EnvironmentOutlined
                                    style={{ marginRight: 8 }}
                                  />{" "}
                                  Province:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {bankelo.province || "NA"}
                                </p>
                              </div>
                            </Col>
                            <Col xs={24} md={12}>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <GlobalOutlined style={{ marginRight: 8 }} />{" "}
                                  Country:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {bankelo.country || "NA"}
                                </p>
                              </div>
                            </Col>
                          </Row>
                        </div>

                        {/* Documents Section */}
                        <div style={{ marginTop: 24 }}>
                          <h6
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: 16,
                            }}
                          >
                            <FileOutlined style={{ marginRight: 8 }} />{" "}
                            Documents
                          </h6>
                          {bankelo.documents && bankelo.documents.length > 0 ? (
                            <Row gutter={[16, 16]}>
                              {bankelo.documents.map((document, index) => (
                                <Col xs={24} md={12} key={index}>
                                  <Card size="small" style={{ padding: 8 }}>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div>
                                        <strong style={{ display: "block" }}>
                                          <FileTextOutlined
                                            style={{ marginRight: 8 }}
                                          />
                                          {document.label || "Untitled"}
                                        </strong>
                                        <small style={{ color: "#8c8c8c" }}>
                                          Document Number:{" "}
                                          {document.identifier || "NA"}
                                        </small>
                                      </div>
                                      <div>
                                        <Space>
                                          <Button
                                            size="small"
                                            onClick={() =>
                                              handleDownloadDocument(
                                                document.url,
                                              )
                                            }
                                            disabled={!document.url}
                                          >
                                            <DownloadOutlined /> VIEW
                                          </Button>
                                          <Button
                                            size="small"
                                            onClick={() =>
                                              handleSubmitDocument(
                                                document.type,
                                              )
                                            }
                                            disabled={
                                              !!document.id || !bankelo.id
                                            }
                                          >
                                            Submit for approval
                                          </Button>
                                        </Space>
                                      </div>
                                    </div>
                                  </Card>
                                </Col>
                              ))}
                            </Row>
                          ) : (
                            <p style={{ color: "#8c8c8c" }}>
                              No documents available
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <span>Data not found.</span>
                      </div>
                    )}
                  </Card>
                );
              })(),
            },
            {
              key: "ghl",
              label: (
                <span>
                  <SettingOutlined /> {t("ghl")}
                </span>
              ),
              children: (() => {
                const ghl = tenant?.ghl as
                  | {
                      name?: string;
                      companyId?: string;
                      address?: string;
                      city?: string;
                      state?: string;
                      country?: string;
                      postalCode?: string;
                      timezone?: string;
                      website?: string;
                      snapshotId?: string;
                      prospectInfo?: {
                        firstName?: string;
                        lastName?: string;
                        email?: string;
                      };
                      settings?: {
                        allowDuplicateContact?: boolean | string;
                        allowDuplicateOpportunity?: boolean | string;
                        allowFacebookNameMerge?: boolean | string;
                        disableContactTimezone?: boolean | string;
                      };
                      social?: {
                        facebookUrl?: string;
                        googlePlus?: string;
                        linkedIn?: string;
                        twitter?: string;
                        yelp?: string;
                        instagram?: string;
                        youtube?: string;
                        pinterest?: string;
                        blogRss?: string;
                        googlePlacesId?: string;
                      };
                      twilio?: {
                        sid?: string;
                        authToken?: string;
                      };
                      twillo?: {
                        authToken?: string;
                      };
                      mailgun?: {
                        apiKey?: string;
                        domain?: string;
                      };
                    }
                  | undefined;

                return (
                  <Card
                    title={`Tenant ${tenant?.tenantName || tenant?.tenantId} GHL Information`}
                  >
                    {ghl && ghl.companyId ? (
                      <>
                        {/* Basic Information */}
                        <Row gutter={[16, 16]}>
                          <Col xs={24} md={12}>
                            <Space
                              orientation="vertical"
                              size="small"
                              style={{ width: "100%" }}
                            >
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <InfoCircleOutlined
                                    style={{ marginRight: 8 }}
                                  />{" "}
                                  Name:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {ghl.name || "NA"}
                                </p>
                              </div>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <IdcardOutlined style={{ marginRight: 8 }} />{" "}
                                  Company ID:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {ghl.companyId || "NA"}
                                </p>
                              </div>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <HomeOutlined style={{ marginRight: 8 }} />{" "}
                                  Address:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {ghl.address || "NA"}
                                </p>
                              </div>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <BuildOutlined style={{ marginRight: 8 }} />{" "}
                                  City:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {ghl.city || "NA"}
                                </p>
                              </div>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <FlagOutlined style={{ marginRight: 8 }} />{" "}
                                  State:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {ghl.state || "NA"}
                                </p>
                              </div>
                            </Space>
                          </Col>
                          <Col xs={24} md={12}>
                            <Space
                              orientation="vertical"
                              size="small"
                              style={{ width: "100%" }}
                            >
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <GlobalOutlined style={{ marginRight: 8 }} />{" "}
                                  Country:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {ghl.country || "NA"}
                                </p>
                              </div>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <MailOutlined style={{ marginRight: 8 }} />{" "}
                                  Postal Code:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {ghl.postalCode || "NA"}
                                </p>
                              </div>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <ClockCircleOutlined
                                    style={{ marginRight: 8 }}
                                  />{" "}
                                  Timezone:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {ghl.timezone || "NA"}
                                </p>
                              </div>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <LinkOutlined style={{ marginRight: 8 }} />{" "}
                                  Website:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {ghl.website || "NA"}
                                </p>
                              </div>
                              <div>
                                <strong style={{ color: "#8c8c8c" }}>
                                  <CameraOutlined style={{ marginRight: 8 }} />{" "}
                                  Snapshot ID:
                                </strong>
                                <p
                                  style={{
                                    margin: "4px 0 0 0",
                                    color: "#1890ff",
                                  }}
                                >
                                  {ghl.snapshotId || "NA"}
                                </p>
                              </div>
                            </Space>
                          </Col>
                        </Row>

                        {/* Prospect Section */}
                        {ghl.prospectInfo && (
                          <div style={{ marginTop: 24 }}>
                            <h6
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: 16,
                              }}
                            >
                              <UserOutlined style={{ marginRight: 8 }} />{" "}
                              Prospect
                            </h6>
                            <Row gutter={[16, 16]}>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <UserOutlined style={{ marginRight: 8 }} />{" "}
                                    First Name:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.prospectInfo.firstName || "NA"}
                                  </p>
                                </div>
                              </Col>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <UserOutlined style={{ marginRight: 8 }} />{" "}
                                    Last Name:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.prospectInfo.lastName || "NA"}
                                  </p>
                                </div>
                              </Col>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <MailOutlined style={{ marginRight: 8 }} />{" "}
                                    Email:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.prospectInfo.email || "NA"}
                                  </p>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        )}

                        {/* Settings Section */}
                        {ghl.settings && (
                          <div style={{ marginTop: 24 }}>
                            <h6
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: 16,
                              }}
                            >
                              <SettingOutlined style={{ marginRight: 8 }} />{" "}
                              Settings
                            </h6>
                            <Row gutter={[16, 16]}>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <SettingOutlined
                                      style={{ marginRight: 8 }}
                                    />{" "}
                                    Allow Duplicate Contact:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.settings.allowDuplicateContact !==
                                    undefined
                                      ? String(
                                          ghl.settings.allowDuplicateContact,
                                        )
                                      : "NA"}
                                  </p>
                                </div>
                              </Col>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <SettingOutlined
                                      style={{ marginRight: 8 }}
                                    />{" "}
                                    Allow Duplicate Opportunity:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.settings.allowDuplicateOpportunity !==
                                    undefined
                                      ? String(
                                          ghl.settings
                                            .allowDuplicateOpportunity,
                                        )
                                      : "NA"}
                                  </p>
                                </div>
                              </Col>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <SettingOutlined
                                      style={{ marginRight: 8 }}
                                    />{" "}
                                    Allow Facebook Name Merge:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.settings.allowFacebookNameMerge !==
                                    undefined
                                      ? String(
                                          ghl.settings.allowFacebookNameMerge,
                                        )
                                      : "NA"}
                                  </p>
                                </div>
                              </Col>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <SettingOutlined
                                      style={{ marginRight: 8 }}
                                    />{" "}
                                    Disable Contact Timezone:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.settings.disableContactTimezone !==
                                    undefined
                                      ? String(
                                          ghl.settings.disableContactTimezone,
                                        )
                                      : "NA"}
                                  </p>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        )}

                        {/* Social Section */}
                        {ghl.social && (
                          <div style={{ marginTop: 24 }}>
                            <h6
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: 16,
                              }}
                            >
                              <ShareAltOutlined style={{ marginRight: 8 }} />{" "}
                              Social
                            </h6>
                            <Row gutter={[16, 16]}>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <FacebookOutlined
                                      style={{ marginRight: 8 }}
                                    />{" "}
                                    Facebook URL:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.social.facebookUrl || "NA"}
                                  </p>
                                </div>
                              </Col>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <GoogleOutlined
                                      style={{ marginRight: 8 }}
                                    />{" "}
                                    Google Plus:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.social.googlePlus || "NA"}
                                  </p>
                                </div>
                              </Col>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <LinkedinOutlined
                                      style={{ marginRight: 8 }}
                                    />{" "}
                                    LinkedIn:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.social.linkedIn || "NA"}
                                  </p>
                                </div>
                              </Col>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <TwitterOutlined
                                      style={{ marginRight: 8 }}
                                    />{" "}
                                    Twitter:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.social.twitter || "NA"}
                                  </p>
                                </div>
                              </Col>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <InfoCircleOutlined
                                      style={{ marginRight: 8 }}
                                    />{" "}
                                    Yelp:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.social.yelp || "NA"}
                                  </p>
                                </div>
                              </Col>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <InstagramOutlined
                                      style={{ marginRight: 8 }}
                                    />{" "}
                                    Instagram:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.social.instagram || "NA"}
                                  </p>
                                </div>
                              </Col>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <YoutubeOutlined
                                      style={{ marginRight: 8 }}
                                    />{" "}
                                    YouTube:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.social.youtube || "NA"}
                                  </p>
                                </div>
                              </Col>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <PinterestOutlined
                                      style={{ marginRight: 8 }}
                                    />{" "}
                                    Pinterest:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.social.pinterest || "NA"}
                                  </p>
                                </div>
                              </Col>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <FileTextOutlined
                                      style={{ marginRight: 8 }}
                                    />{" "}
                                    Blog RSS:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.social.blogRss || "NA"}
                                  </p>
                                </div>
                              </Col>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <GoogleOutlined
                                      style={{ marginRight: 8 }}
                                    />{" "}
                                    Google Places ID:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.social.googlePlacesId || "NA"}
                                  </p>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        )}

                        {/* Twilio Section */}
                        {(ghl.twilio || ghl.twillo) && (
                          <div style={{ marginTop: 24 }}>
                            <h6
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: 16,
                              }}
                            >
                              <PhoneOutlined style={{ marginRight: 8 }} />{" "}
                              Twilio
                            </h6>
                            <Row gutter={[16, 16]}>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <InfoCircleOutlined
                                      style={{ marginRight: 8 }}
                                    />{" "}
                                    SID:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.twilio?.sid || "NA"}
                                  </p>
                                </div>
                              </Col>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <KeyOutlined style={{ marginRight: 8 }} />{" "}
                                    Auth Token:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.twilio?.authToken ||
                                      ghl.twillo?.authToken ||
                                      "NA"}
                                  </p>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        )}

                        {/* Mailgun Section */}
                        {ghl.mailgun && (
                          <div style={{ marginTop: 24 }}>
                            <h6
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: 16,
                              }}
                            >
                              <MailOutlined style={{ marginRight: 8 }} />{" "}
                              Mailgun
                            </h6>
                            <Row gutter={[16, 16]}>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <KeyOutlined style={{ marginRight: 8 }} />{" "}
                                    API Key:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.mailgun.apiKey || "NA"}
                                  </p>
                                </div>
                              </Col>
                              <Col xs={24} md={12}>
                                <div>
                                  <strong style={{ color: "#8c8c8c" }}>
                                    <GlobalOutlined
                                      style={{ marginRight: 8 }}
                                    />{" "}
                                    Domain:
                                  </strong>
                                  <p
                                    style={{
                                      margin: "4px 0 0 0",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {ghl.mailgun.domain || "NA"}
                                  </p>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <span>Data not found.</span>
                      </div>
                    )}
                  </Card>
                );
              })(),
            },
            {
              key: "apple",
              label: (
                <span>
                  <AppleOutlined /> Apple Verification
                </span>
              ),
              children: (
                <Card
                  title={`Tenant ${tenant?.tenantName || tenant?.tenantId} Apple Verification File Upload`}
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span>
                            <FileTextOutlined style={{ marginRight: 8 }} />{" "}
                            Apple Verification File
                          </span>
                        }
                        required
                        validateStatus={
                          appleVerificationTouched && !appleVerificationFile
                            ? "error"
                            : undefined
                        }
                        help={
                          appleVerificationTouched && !appleVerificationFile ? (
                            <span
                              style={{ color: "#ff4d4f", fontSize: "14px" }}
                            >
                              *Apple Verification File is required
                            </span>
                          ) : undefined
                        }
                      >
                        <Upload
                          maxCount={1}
                          showUploadList={false}
                          beforeUpload={(file) => {
                            // Extract the actual File object from UploadFile wrapper
                            const actualFile = extractFile(file);
                            setAppleVerificationFile(actualFile);
                            setAppleVerificationTouched(true);
                            return false;
                          }}
                          onRemove={() => {
                            setAppleVerificationFile(null);
                            setAppleVerificationTouched(true);
                          }}
                        >
                          <Button icon={<UploadOutlined />}>Choose file</Button>
                        </Upload>
                        {appleVerificationFile && (
                          <div
                            style={{
                              marginTop: 8,
                              padding: "8px 12px",
                              background: token.colorFillSecondary,
                              borderRadius: 4,
                              border: `1px solid ${token.colorPrimary}40`,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Space>
                              <PaperClipOutlined
                                style={{ color: token.colorPrimary }}
                              />
                              <span
                                style={{
                                  fontWeight: 500,
                                  color: token.colorText,
                                }}
                              >
                                {appleVerificationFile.name}
                              </span>
                              <span
                                style={{
                                  color: token.colorTextSecondary,
                                  fontSize: "12px",
                                }}
                              >
                                ({formatFileSize(appleVerificationFile.size)})
                              </span>
                            </Space>
                            <Button
                              type="text"
                              icon={<DeleteOutlined />}
                              onClick={() => {
                                setAppleVerificationFile(null);
                                setAppleVerificationTouched(true);
                              }}
                              style={{ color: "#ff4d4f" }}
                              size="small"
                            />
                          </div>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
                    <Col xs={24}>
                      <div style={{ textAlign: "center" }}>
                        <Tooltip title="Please ensure that the file is correct before uploading.">
                          <Button
                            type="primary"
                            size="large"
                            onClick={async () => {
                              if (!appleVerificationFile) {
                                setAppleVerificationTouched(true);
                                return;
                              }
                              await onUploadAppleVerification(
                                appleVerificationFile,
                              );
                              setAppleVerificationFile(null);
                              setAppleVerificationTouched(false);
                            }}
                            loading={actionLoading}
                            icon={<SaveOutlined />}
                            style={{
                              minWidth: 200,
                              height: 48,
                              fontSize: 16,
                              fontWeight: 500,
                              boxShadow: "0 2px 8px rgba(24, 144, 255, 0.3)",
                            }}
                          >
                            Upload
                          </Button>
                        </Tooltip>
                      </div>
                    </Col>
                  </Row>
                </Card>
              ),
            },
          ]}
        />
      </Card>

      <ConfirmationModal
        open={emailModalOpen}
        onClose={() => {
          setEmailModalOpen(false);
          setEmailValidationError("");
        }}
        onConfirm={async () => {
          // Validate email
          if (!emailInput || !emailInput.trim()) {
            setEmailValidationError("Email is required.");
            return;
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(emailInput)) {
            setEmailValidationError("Please enter a valid email.");
            return;
          }
          setEmailValidationError("");
          onUpdateEmail(emailInput);
          setEmailModalOpen(false);
        }}
        title="Update Email"
        confirmText="Submit"
        cancelText="Cancel"
      >
        <div>
          <p
            style={{
              fontSize: "14px",
              color: token.colorTextSecondary,
              marginBottom: 16,
            }}
          >
            Update the email for tenant:
            <Tag color="default" style={{ marginLeft: 8 }}>
              {tenant?.tenantName || tenant?.tenantId}
            </Tag>
          </p>

          <Form.Item
            label={
              <Space>
                <span style={{ color: token.colorPrimary }}>@</span>
                Email
              </Space>
            }
            validateStatus={emailValidationError ? "error" : ""}
            help={emailValidationError}
          >
            <Input
              type="email"
              placeholder="Enter email..."
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                if (emailValidationError) {
                  setEmailValidationError("");
                }
              }}
            />
          </Form.Item>

          <p
            style={{
              fontSize: "12px",
              color: token.colorTextSecondary,
              marginTop: -16,
            }}
          >
            We&apos;ll use this email for tenant communication.
          </p>
        </div>
      </ConfirmationModal>
      <ConfirmationModal
        open={threePLModalOpen}
        onClose={() => setThreePLModalOpen(false)}
        onConfirm={() => {
          onUpdate3PL(threePLInput);
          setThreePLModalOpen(false);
        }}
        title="Update 3PL"
        confirmText="Save"
        cancelText="Cancel"
      >
        <Input
          placeholder="3PL"
          value={threePLInput}
          onChange={(e) => setThreePLInput(e.target.value)}
        />
      </ConfirmationModal>
      <ConfirmationModal
        open={threePLConfirmModalOpen}
        onClose={() => {
          setThreePLConfirmModalOpen(false);
          setPendingThreePL("");
        }}
        onConfirm={() => {
          onUpdate3PL(pendingThreePL);
          setThreePLConfirmModalOpen(false);
          setPendingThreePL("");
        }}
        title="Confirm 3PL Change"
        confirmText="Confirm"
        cancelText="Cancel"
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "16px",
              marginBottom: "16px",
              color: token.colorText,
            }}
          >
            You are about to update the <strong>3PL configuration</strong> for
            tenant: <strong>{tenant?.tenantName ?? tenant?.tenantId}</strong>
          </p>
          <p style={{ fontSize: "16px", color: token.colorText }}>
            Are you sure you want to set 3PL to{" "}
            <strong>{pendingThreePL === "Y" ? "Yes" : "No"}</strong>?
          </p>
        </div>
      </ConfirmationModal>
      <ConfirmationModal
        open={approveCancelModalOpen}
        onClose={() => setApproveCancelModalOpen(false)}
        onConfirm={() => {
          onApproveCancelRequest();
          setApproveCancelModalOpen(false);
        }}
        title="Confirm Approval"
        message="Are you sure you want to approve cancel request? The tenant will no longer have access to the system."
        warningMessage="Please review your decision carefully before proceeding."
        additionalInfo={[
          { label: "TenantId", value: tenant?.tenantId || "N/A" },
          { label: "Email", value: tenant?.email || "N/A" },
        ]}
        confirmText="Confirm"
        cancelText="Cancel"
      />
      <ConfirmationModal
        open={makePublicModalOpen}
        onClose={() => setMakePublicModalOpen(false)}
        onConfirm={() => {
          actions.handleMakePublic();
          setMakePublicModalOpen(false);
        }}
        title="Confirm Public Access"
        message="Are you sure you want to make this item public? Once made public, it will be visible to everyone."
        warningMessage="Please review your decision carefully before proceeding."
        confirmText="Confirm"
        cancelText="Cancel"
      />
      <ConfirmationModal
        open={makePrivateModalOpen}
        onClose={() => setMakePrivateModalOpen(false)}
        onConfirm={() => {
          actions.handleMakePrivate();
          setMakePrivateModalOpen(false);
        }}
        title="Confirm Private Access"
        message="Are you sure you want to make this item private? Once made private, it will no longer be visible to the public."
        warningMessage="Please review your decision carefully before proceeding."
        confirmText="Confirm"
        cancelText="Cancel"
      />
      <ConfirmationModal
        open={stopModalOpen}
        onClose={() => setStopModalOpen(false)}
        onConfirm={() => {
          actions.handleStop();
          setStopModalOpen(false);
        }}
        title="Confirm Stop"
        message="Are you sure you want to stop this tenant's access? Once stopped, the tenant will no longer have access to the system."
        warningMessage="Please review your decision carefully before proceeding."
        confirmText="Confirm"
        cancelText="Cancel"
      />
      <ConfirmationModal
        open={restartModalOpen}
        onClose={() => setRestartModalOpen(false)}
        onConfirm={() => {
          actions.handleRestart();
          setRestartModalOpen(false);
        }}
        title="Confirm Restart"
        message="Are you sure you want to start this tenant? This action will enable their services and make them active again."
        warningMessage="Please review your decision carefully before proceeding."
        confirmText="Confirm"
        cancelText="Cancel"
      />

      {/* Bankelo Onboarding Confirmation Modal */}
      <ConfirmationModal
        open={bankeloOnboardingModalOpen}
        onClose={() => setBankeloOnboardingModalOpen(false)}
        onConfirm={() => {
          onBankeloOnboarding();
          setBankeloOnboardingModalOpen(false);
        }}
        title="Confirmation"
        message="Are you sure you want to submit this request for approval? This action will initiate the approval process."
        warningMessage="Please review your request carefully before submitting it for approval."
        confirmText="Confirm"
        cancelText="Cancel"
        buttonSize="large"
      />
    </>
  );
}
