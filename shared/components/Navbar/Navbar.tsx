"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/core/hooks/useAuth";
import { APP_CONSTANT } from "@/core/utils/constants";
import { NAVBAR_CONSTANTS } from "@/core/utils/navbar.constants";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { Button, Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import { LogoutOutlined, TeamOutlined } from "@ant-design/icons";
// import { LanguageSwitcher } from './LanguageSwitcher';

const TENANT_LIST_PATH = `/${APP_CONSTANT.ROUTES.TENANT.LIST}`;

const { Header } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const t = useTranslations("navbar");
  const tAuth = useTranslations("auth");

  const isTenantListActive =
    !!pathname &&
    (pathname === TENANT_LIST_PATH ||
      pathname.startsWith(`${TENANT_LIST_PATH}/`));

  const menuItems: MenuItem[] = [
    {
      label: t("tenants"),
      key: TENANT_LIST_PATH,
      icon: <TeamOutlined />,
    },
    // {
    //   label: 'GHL',
    //   key: '/ghl',
    //   icon: <UsbOutlined />,
    // },
  ];

  const handleLogout = useCallback(() => {
    logout();
    router.push(`/${APP_CONSTANT.ROUTES.USER.LOGIN}`);
  }, [logout, router]);

  const handleNavClick = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  return (
    <Header
      className="flex flex-wrap items-center justify-between gap-2 px-4 md:px-6 border-b"
      style={{
        background: "var(--header-bg)",
        borderColor: "var(--header-border)",
      }}
    >
      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={NAVBAR_CONSTANTS.LOGO.PATH}
            alt={t("logoAlt")}
            style={{
              height: NAVBAR_CONSTANTS.LOGO.HEIGHT,
              width: "auto",
              objectFit: NAVBAR_CONSTANTS.LOGO.OBJECT_FIT,
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={isTenantListActive ? [TENANT_LIST_PATH] : []}
          items={menuItems}
          onClick={(e) => handleNavClick(e.key as string)}
          style={{
            flex: 1,
            minWidth: 0,
            borderBottom: "none",
            background: "transparent",
          }}
        />
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
        {/* <LanguageSwitcher /> */}
        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          <span className="hidden sm:inline">{tAuth("logout")}</span>
        </Button>
      </div>
    </Header>
  );
}
