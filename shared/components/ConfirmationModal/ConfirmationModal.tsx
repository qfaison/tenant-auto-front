"use client";

import React, { useCallback } from "react";
import { useTranslations } from "next-intl";
import { Modal, Button, theme } from "antd";
import { CONFIRMATION_MODAL_CONSTANTS } from "@/core/utils/confirmation-modal.constants";

export interface ConfirmationModalProps {
  // Core props
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;

  // Title configuration
  title?: string;

  // Content configuration
  message?: string | React.ReactNode;
  warningMessage?: string | React.ReactNode;
  additionalInfo?: Array<{ label: string; value: string | React.ReactNode }>;
  children?: React.ReactNode; // For custom content (forms, etc.)

  // Button configuration
  confirmText?: string;
  cancelText?: string;
  confirmButtonType?: "primary" | "default" | "dashed" | "link" | "text";
  cancelButtonType?: "primary" | "default" | "dashed" | "link" | "text";
  buttonSize?: "small" | "middle" | "large";

  // Behavior
  loading?: boolean;
  closable?: boolean;
  centered?: boolean;
  width?: number | string;
}

export function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  warningMessage,
  additionalInfo,
  children,
  confirmText,
  cancelText,
  confirmButtonType = "primary",
  cancelButtonType = "default",
  buttonSize = "middle",
  loading = false,
  closable = true,
  centered = true,
  width,
}: ConfirmationModalProps) {
  const { token } = theme.useToken();
  const t = useTranslations("common");

  const resolvedConfirmText = confirmText ?? t("confirm");
  const resolvedCancelText = cancelText ?? t("cancel");

  const handleConfirm = useCallback(async () => {
    await onConfirm();
  }, [onConfirm]);

  const renderContent = () => {
    // If children are provided, render them (for custom content like forms)
    if (children) {
      return <div style={{ color: token.colorText }}>{children}</div>;
    }

    // Default content rendering
    const { CONTENT, WARNING, ADDITIONAL_INFO } = CONFIRMATION_MODAL_CONSTANTS;
    return (
      <div className="text-center">
        {message && (
          <p
            style={{
              fontSize: CONTENT.MESSAGE_FONT_SIZE,
              marginBottom: CONTENT.MESSAGE_MARGIN_BOTTOM,
              color: token.colorText,
            }}
          >
            {message}
          </p>
        )}

        {warningMessage && (
          <p
            style={{
              fontSize: WARNING.FONT_SIZE,
              color: token.colorWarning,
              marginBottom: additionalInfo
                ? WARNING.MARGIN_BOTTOM_WITH_INFO
                : WARNING.MARGIN_BOTTOM_WITHOUT_INFO,
            }}
          >
            {warningMessage}
          </p>
        )}

        {additionalInfo && additionalInfo.length > 0 && (
          <div style={{ marginTop: ADDITIONAL_INFO.MARGIN_TOP }}>
            {additionalInfo.map((info, index) => (
              <p
                key={index}
                style={{
                  fontSize: WARNING.FONT_SIZE,
                  color: token.colorWarning,
                  marginBottom:
                    index < additionalInfo.length - 1
                      ? ADDITIONAL_INFO.ITEM_MARGIN_BOTTOM
                      : ADDITIONAL_INFO.LAST_ITEM_MARGIN_BOTTOM,
                }}
              >
                {info.label}: {info.value}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  const { MODAL } = CONFIRMATION_MODAL_CONSTANTS;
  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        key="cancel"
        onClick={onClose}
        type={cancelButtonType}
        size={buttonSize}
      >
        {resolvedCancelText}
      </Button>
      <Button
        key="confirm"
        type={confirmButtonType}
        onClick={handleConfirm}
        loading={loading}
        size={buttonSize}
      >
        {resolvedConfirmText}
      </Button>
    </div>
  );

  return (
    <Modal
      className="confirmation-modal"
      title={title}
      open={open}
      onCancel={onClose}
      footer={footer}
      closable={closable}
      centered={centered}
      width={width ?? CONFIRMATION_MODAL_CONSTANTS.DEFAULT_WIDTH}
      styles={{
        header: {
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          paddingBottom: MODAL.HEADER_PADDING_BOTTOM,
        },
        body: {
          padding: MODAL.BODY_PADDING,
          background: token.colorBgContainer,
          color: token.colorText,
        },
        footer: {
          background: token.colorBgContainer,
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          paddingTop: MODAL.FOOTER_PADDING_TOP,
        },
      }}
    >
      {renderContent()}
    </Modal>
  );
}
