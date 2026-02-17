"use client";

import { useMemo } from "react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type RegisterOptions,
} from "react-hook-form";
import { Form, Input } from "antd";
import type { ReactNode } from "react";

type FormValues = { username: string; password: string };
type FieldName = "username" | "password";

interface LoginFormFieldProps {
  name: string;
  label: string;
  placeholder: string;
  icon: ReactNode;
  isPassword?: boolean;
  control: Control<{ username: string; password: string }>;
  errors: FieldErrors<{ username: string; password: string }>;
  requiredMessage: string;
}

export function LoginFormField({
  name,
  label,
  placeholder,
  icon,
  isPassword = false,
  control,
  errors,
  requiredMessage,
}: LoginFormFieldProps) {
  const fieldError = errors[name as keyof typeof errors];
  const rules = useMemo(
    (): RegisterOptions<FormValues, FieldName> => ({
      required: requiredMessage,
    }),
    [requiredMessage],
  );

  return (
    <Form.Item
      label={label}
      validateStatus={fieldError ? "error" : undefined}
      help={fieldError?.message}
      className="mb-4"
    >
      <Controller
        name={name as "username" | "password"}
        control={control}
        rules={rules}
        render={({ field }) =>
          isPassword ? (
            <Input.Password
              placeholder={placeholder}
              size="large"
              prefix={icon}
              {...field}
            />
          ) : (
            <Input
              placeholder={placeholder}
              size="large"
              prefix={icon}
              {...field}
            />
          )
        }
      />
    </Form.Item>
  );
}
