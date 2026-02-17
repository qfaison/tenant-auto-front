"use client";

import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useTheme } from "@/core/hooks/useTheme";
import { useLogin } from "../hooks/useLogin";
import { useTranslations } from "next-intl";
import { getLoginCardStyles } from "@/core/utils/theme.utils";
import { LOGIN_CONSTANTS } from "@/core/utils/login.constants";
import { LoginFormField } from "./LoginFormField";

type FormValues = {
  username: string;
  password: string;
};

export function LoginForm() {
  const t = useTranslations("auth");
  const { theme } = useTheme();
  const { submitLogin, loading } = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { username: "", password: "" },
  });

  const cardStyles = useMemo(() => getLoginCardStyles(theme), [theme]);

  const onSubmit = useCallback(
    ({ username, password }: FormValues) => {
      submitLogin({ username, password });
    },
    [submitLogin],
  );

  return (
    <Card className="w-full shadow-lg relative z-10" styles={cardStyles}>
      <div className="text-center mb-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGIN_CONSTANTS.LOGO.PATH}
          alt={t("logoAlt")}
          className={LOGIN_CONSTANTS.LOGO.CLASSES}
        />
        <h1 className="text-xl font-semibold mt-6 mb-4 text-foreground">
          {t("welcomeBack")}
        </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Form layout="vertical" component="div">
          <LoginFormField
            name="username"
            label={t("username")}
            placeholder={t("usernamePlaceholder")}
            icon={<UserOutlined />}
            control={control}
            errors={errors}
            requiredMessage={t("usernameRequired")}
          />
          <LoginFormField
            name="password"
            label={t("password")}
            placeholder={t("passwordPlaceholder")}
            icon={<LockOutlined />}
            isPassword
            control={control}
            errors={errors}
            requiredMessage={t("passwordRequired")}
          />
          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
            >
              {t("login")}
            </Button>
          </Form.Item>
        </Form>
      </form>
    </Card>
  );
}
