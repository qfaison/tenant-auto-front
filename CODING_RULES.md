# Coding Rules & Standards

This document outlines the coding standards and best practices for maintaining DRY, reusable, and centralized code with proper theme and internationalization support.

---

## Table of Contents

1. [DRY (Don't Repeat Yourself) Principles](#1-dry-dont-repeat-yourself-principles)
2. [Reusability Patterns](#2-reusability-patterns)
3. [Centralization](#3-centralization)
4. [Theme Support (Light/Dark)](#4-theme-support-lightdark)
5. [Internationalization (Multi-language)](#5-internationalization-multi-language)
6. [File Structure & Organization](#6-file-structure--organization)
7. [Code Quality Standards](#7-code-quality-standards)
8. [Specific Patterns](#8-specific-patterns)

---

## 1. DRY (Don't Repeat Yourself) Principles

### Rules

- **Extract repeated logic** into utilities, hooks, or components
- **Use constants** for magic numbers, strings, and paths
- **Create reusable components** for repeated UI patterns
- **Avoid duplicating styles** - use theme utilities or CSS variables
- **Memoize expensive computations** to prevent unnecessary recalculations

### Examples

#### ✅ Good: Reusable Component

```tsx
// features/auth/components/LoginFormField.tsx
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
  // Single component handles both username and password fields
  return (
    <Form.Item label={label} validateStatus={errors[name] ? 'error' : undefined}>
      <Controller
        name={name}
        control={control}
        rules={{ required: requiredMessage }}
        render={({ field }) =>
          isPassword ? (
            <Input.Password placeholder={placeholder} prefix={icon} {...field} />
          ) : (
            <Input placeholder={placeholder} prefix={icon} {...field} />
          )
        }
      />
    </Form.Item>
  );
}
```

#### ❌ Bad: Duplicated Code

```tsx
// Don't repeat Form.Item structure for each field
<Form.Item label="Username">
  <Controller name="username" control={control} render={({ field }) => <Input {...field} />} />
</Form.Item>
<Form.Item label="Password">
  <Controller name="password" control={control} render={({ field }) => <Input.Password {...field} />} />
</Form.Item>
```

#### ✅ Good: Constants for Magic Values

```tsx
// core/utils/login.constants.ts
export const LOGIN_CONSTANTS = {
  CARD: {
    BORDER_RADIUS: 12,
    PADDING: '48px 32px',
  },
  LOGO: {
    PATH: '/vercado.png',
    CLASSES: 'h-16 w-auto object-contain md:h-20 mx-auto',
  },
} as const;
```

#### ❌ Bad: Hard-coded Values

```tsx
// Don't hard-code values directly in components
<Card styles={{ borderRadius: 12, padding: '48px 32px' }}>
  <img src="/vercado.png" className="h-16 w-auto object-contain md:h-20 mx-auto" />
</Card>
```

#### ✅ Good: Theme Utility Function

```tsx
// core/utils/theme.utils.ts
export function getLoginCardStyles(theme: ThemeMode) {
  const isLight = theme === 'light';
  return {
    root: {
      background: isLight ? '#ffffff' : '#1f1f1f',
      color: isLight ? '#171717' : 'rgba(255, 255, 255, 0.85)',
      borderRadius: LOGIN_CONSTANTS.CARD.BORDER_RADIUS,
      border: isLight ? '1px solid #e5e7eb' : '1px solid transparent',
    },
    body: {
      padding: LOGIN_CONSTANTS.CARD.PADDING,
    },
  };
}
```

#### ❌ Bad: Inline Theme Logic

```tsx
// Don't duplicate theme logic in every component
const cardStyles = {
  root: {
    background: theme === 'light' ? '#ffffff' : '#1f1f1f',
    color: theme === 'light' ? '#171717' : 'rgba(255, 255, 255, 0.85)',
    // ... repeated in multiple components
  },
};
```

---

## 2. Reusability Patterns

### Component Reusability

Extract common UI patterns into reusable components.

**Location**: `features/[feature]/components/` or `shared/components/` for cross-feature components

**Example**: `LoginFormField` component used for both username and password fields

### Hook Reusability

Create custom hooks for shared logic.

**Location**: `core/hooks/` for app-wide hooks, `features/[feature]/hooks/` for feature-specific hooks

**Examples**:
- `useTheme()` - Theme management
- `useAuth()` - Authentication state
- `useLogin()` - Login logic

```tsx
// core/hooks/useTheme.tsx
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
```

### Utility Functions

Pure functions for shared logic.

**Location**: `core/utils/`

**Example**: `getLoginCardStyles()` - Theme-aware style generation

### Service Pattern

Singleton services for cross-cutting concerns.

**Location**: `core/services/`

**Examples**:
- `toastService` - Toast notifications
- `apiService` - HTTP client wrapper
- `storageService` - LocalStorage wrapper

```tsx
// core/services/toast.service.ts
export class ToastService {
  private messageApi: MessageInstance | null = null;

  setMessageApi(api: MessageInstance | null): void {
    this.messageApi = api;
  }

  showSuccess(msg: string): void {
    this.messageApi?.success(msg);
  }
}

export const toastService = new ToastService();
```

---

## 3. Centralization

### Constants

**Rule**: All magic numbers, strings, paths, and configuration values must be centralized.

**Locations**:
- App-wide constants: `core/utils/constants.ts`
- Feature-specific constants: `features/[feature]/constants.ts` or `core/utils/[feature].constants.ts`

**Example**:

```tsx
// core/utils/constants.ts
export const APP_CONSTANT = {
  ROUTES: {
    USER: {
      LOGIN: 'login',
    },
    TENANT: {
      LIST: 'tenant/list',
    },
  },
  LOCAL_STORAGE: {
    TOKEN: '__token',
  },
  AUTH_COOKIE_NAME: 'tenant-dashboard-auth',
  LIMIT: 10,
} as const;
```

**Usage**:

```tsx
// ✅ Good
router.push(`/${APP_CONSTANT.ROUTES.TENANT.LIST}`);

// ❌ Bad
router.push('/tenant/list');
```

### Services

**Rule**: Shared services must be in `core/services/`

**Examples**:
- `core/services/api.service.ts` - HTTP client
- `core/services/toast.service.ts` - Notifications
- `core/services/storage.service.ts` - Storage utilities

### Theme Configuration

**Rule**: Theme configuration centralized in:
- `core/styles/antd-theme.ts` - Ant Design theme config
- `core/utils/theme.utils.ts` - Component-specific theme utilities
- `app/globals.css` - CSS variables

**Example**:

```tsx
// core/styles/antd-theme.ts
export const getAntdTheme = (isDark: boolean): ThemeConfig => {
  return {
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
      colorBgContainer: isDark ? '#1f1f1f' : undefined,
      colorBgLayout: isDark ? '#141414' : undefined,
    },
    algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
  };
};
```

### API Configuration

**Rule**: API configuration centralized in `core/lib/api/`

**Files**:
- `core/lib/api/axios.ts` - Axios instance
- `core/lib/api/endpoints.ts` - API endpoints
- `core/lib/api/interceptors.ts` - Request/response interceptors

### Translation Keys

**Rule**: All user-facing strings in `core/locale/[locale].json`

**Structure**: Organized by feature/domain

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "auth": {
    "login": "Login",
    "username": "Username",
    "usernamePlaceholder": "Enter your username"
  }
}
```

---

## 4. Theme Support (Light/Dark)

### Rules

1. **Always use `useTheme()` hook** for theme-aware components
2. **Use CSS variables** (`--background`, `--foreground`) from `globals.css` for layout styles
3. **Use Ant Design `ConfigProvider` theme** for component styles
4. **Create theme utilities** (`theme.utils.ts`) for component-specific theme logic
5. **Use `data-theme` attribute** for CSS-based theming
6. **Never hard-code colors** - use theme utilities or CSS variables
7. **Memoize theme-dependent styles** with `useMemo` to prevent unnecessary re-renders

### Implementation

#### CSS Variables (globals.css)

```css
:root,
[data-theme="light"] {
  --background: #ffffff;
  --foreground: #171717;
  --header-bg: #ffffff;
  --header-border: #f0f0f0;
}

[data-theme="dark"] {
  --background: #141414;
  --foreground: rgba(255, 255, 255, 0.85);
  --header-bg: #1f1f1f;
  --header-border: #303030;
}
```

#### Using Theme Hook

```tsx
// ✅ Good
export function MyComponent() {
  const { theme } = useTheme();
  const cardStyles = useMemo(() => getLoginCardStyles(theme), [theme]);
  
  return <Card styles={cardStyles}>...</Card>;
}
```

#### Theme Utilities

```tsx
// core/utils/theme.utils.ts
export function getLoginCardStyles(theme: ThemeMode) {
  const isLight = theme === 'light';
  return {
    root: {
      background: isLight ? '#ffffff' : '#1f1f1f',
      color: isLight ? '#171717' : 'rgba(255, 255, 255, 0.85)',
      borderRadius: LOGIN_CONSTANTS.CARD.BORDER_RADIUS,
      border: isLight ? '1px solid #e5e7eb' : '1px solid transparent',
    },
    body: {
      padding: LOGIN_CONSTANTS.CARD.PADDING,
    },
  };
}
```

#### Using CSS Variables in Tailwind

```tsx
// ✅ Good - Uses CSS variable
<div className="bg-background text-foreground">
  Content
</div>

// ❌ Bad - Hard-coded color
<div className="bg-white dark:bg-gray-900">
  Content
</div>
```

### Do's and Don'ts

#### ✅ Do

- Use `useTheme()` hook to access theme
- Memoize theme-dependent styles with `useMemo`
- Use CSS variables for layout colors
- Create theme utilities for component-specific styles
- Use `data-theme` attribute for CSS selectors

#### ❌ Don't

- Hard-code colors in components
- Duplicate theme logic across components
- Forget to memoize theme-dependent styles
- Mix Tailwind dark: variants with CSS variables (prefer CSS variables)

---

## 5. Internationalization (Multi-language)

### Rules

1. **All user-facing strings** must use `useTranslations()` from `next-intl`
2. **Translation keys organized** by feature/domain in `core/locale/[locale].json`
3. **Use descriptive, hierarchical keys** (e.g., `auth.usernamePlaceholder`, `common.save`)
4. **Never hard-code user-facing text**
5. **Placeholders, validation messages, and labels** must be translatable
6. **Use `useTranslations('namespace')`** with appropriate namespace

### Implementation

#### Translation File Structure

```json
// core/locale/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "switchToLight": "Switch to light",
    "switchToDark": "Switch to dark"
  },
  "auth": {
    "login": "Login",
    "welcomeBack": "Welcome Back!",
    "username": "Username",
    "password": "Password",
    "usernamePlaceholder": "Enter your username",
    "passwordPlaceholder": "Enter your password",
    "usernameRequired": "Username is required",
    "passwordRequired": "Password is required"
  }
}
```

#### Using Translations

```tsx
// ✅ Good
export function LoginForm() {
  const t = useTranslations('auth');
  
  return (
    <>
      <h1>{t('welcomeBack')}</h1>
      <Form.Item label={t('username')}>
        <Input placeholder={t('usernamePlaceholder')} />
      </Form.Item>
      <Button>{t('login')}</Button>
    </>
  );
}
```

```tsx
// ✅ Good - Validation messages
const rules = {
  required: t('usernameRequired'),
};
```

```tsx
// ❌ Bad - Hard-coded strings
export function LoginForm() {
  return (
    <>
      <h1>Welcome Back!</h1>
      <Form.Item label="Username">
        <Input placeholder="Enter your username" />
      </Form.Item>
      <Button>Login</Button>
    </>
  );
}
```

### Translation Key Naming Convention

- Use **camelCase** for keys
- Use **hierarchical structure** (feature/domain → specific key)
- Be **descriptive** (`usernamePlaceholder` not `placeholder`)
- Group related keys together (`username`, `usernamePlaceholder`, `usernameRequired`)

### Examples

```tsx
// ✅ Good - Descriptive keys
t('usernamePlaceholder')
t('usernameRequired')
t('passwordPlaceholder')

// ❌ Bad - Generic keys
t('placeholder')
t('required')
t('error')
```

---

## 6. File Structure & Organization

### Directory Structure

```
tenant-dashboard/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Route groups
│   ├── (tenant)/
│   ├── layout.tsx         # Root layout
│   └── providers.tsx      # Provider composition
├── core/                   # Core utilities and shared code
│   ├── hooks/             # App-wide hooks (useTheme, useAuth)
│   ├── lib/               # Third-party library configs
│   │   ├── api/          # API configuration
│   │   └── i18n/         # i18n configuration
│   ├── locale/            # Translation files
│   ├── providers/         # Context providers
│   ├── services/         # Shared services (toast, api, storage)
│   ├── styles/            # Theme and global styles
│   └── utils/            # Utility functions and constants
├── features/              # Feature-based modules
│   ├── auth/
│   │   ├── components/   # Feature-specific components
│   │   ├── hooks/        # Feature-specific hooks
│   │   └── services/     # Feature-specific services
│   └── tenant/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── store/        # Feature-specific state management
├── shared/                # Shared across features
│   ├── components/       # Cross-feature components (Navbar)
│   └── types/           # Shared TypeScript types
└── public/               # Static assets
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `LoginForm.tsx`, `TenantList.tsx`)
- **Hooks**: camelCase starting with `use` (e.g., `useLogin.ts`, `useTheme.tsx`)
- **Services**: camelCase ending with `.service.ts` (e.g., `toast.service.ts`, `api.service.ts`)
- **Utils**: camelCase ending with `.utils.ts` (e.g., `theme.utils.ts`)
- **Constants**: camelCase ending with `.constants.ts` (e.g., `login.constants.ts`, `constants.ts`)
- **Types**: camelCase ending with `.ts` (e.g., `tenant.ts`)

### Feature Structure

Each feature should follow this structure:

```
features/[feature-name]/
├── components/          # Feature-specific components
├── hooks/              # Feature-specific hooks
├── services/           # Feature-specific API/services
├── store/              # Feature-specific state (if using Zustand)
└── types.ts           # Feature-specific types (optional)
```

### Import Paths

Use absolute imports with `@/` alias:

```tsx
// ✅ Good
import { useTheme } from '@/core/hooks/useTheme';
import { toastService } from '@/core/services/toast.service';
import { APP_CONSTANT } from '@/core/utils/constants';
import { LoginForm } from '@/features/auth/components/LoginForm';

// ❌ Bad - Relative imports
import { useTheme } from '../../../core/hooks/useTheme';
```

---

## 7. Code Quality Standards

### TypeScript

- **Always type props, return types, and function parameters**
- Use `as const` for constant objects to ensure type safety
- Prefer interfaces for component props, types for utilities

```tsx
// ✅ Good
interface LoginFormFieldProps {
  name: string;
  label: string;
  placeholder: string;
  control: Control<FormValues>;
}

export function LoginFormField(props: LoginFormFieldProps): JSX.Element {
  // ...
}
```

### React Hooks

- **Use `useMemo`** for expensive computations and theme-dependent styles
- **Use `useCallback`** for functions passed as props or in dependency arrays

```tsx
// ✅ Good
const cardStyles = useMemo(() => getLoginCardStyles(theme), [theme]);

const handleSubmit = useCallback((data: FormValues) => {
  submitLogin(data);
}, [submitLogin]);
```

### Forms

- **Use React Hook Form** with Ant Design `Form.Item` and `Controller`
- Extract form fields into reusable components when duplicated

```tsx
// ✅ Good
const { control, handleSubmit, formState: { errors } } = useForm<FormValues>();

<form onSubmit={handleSubmit(onSubmit)}>
  <Form layout="vertical">
    <Form.Item label={t('username')}>
      <Controller
        name="username"
        control={control}
        rules={{ required: t('usernameRequired') }}
        render={({ field }) => <Input {...field} />}
      />
    </Form.Item>
  </Form>
</form>
```

### Error Handling

- **Use `toastService`** for user feedback
- Handle errors gracefully with try-catch blocks
- Provide meaningful error messages

```tsx
// ✅ Good
try {
  const result = await apiCall();
  toastService.showSuccess(t('successMessage'));
} catch (err) {
  const errorMessage = getErrorMessage(err);
  toastService.showError(errorMessage);
}
```

### ESLint

- **Fix all warnings** before committing
- Use `eslint-disable-next-line` comments sparingly and with justification
- Follow Next.js and React best practices

### Component Structure

- **Client components** must be marked with `'use client'`
- **Server components** are default (no directive needed)
- Keep components focused and single-purpose

```tsx
// ✅ Good - Client component
'use client';

import { useState } from 'react';

export function InteractiveComponent() {
  const [state, setState] = useState();
  // ...
}
```

---

## 8. Specific Patterns

### Forms Pattern

**Structure**: `<form>` wraps `<Form layout="vertical">`

```tsx
// ✅ Good - Correct nesting
<form onSubmit={handleSubmit(onSubmit)}>
  <Form layout="vertical">
    <Form.Item label={t('username')}>
      <Controller name="username" control={control} render={({ field }) => <Input {...field} />} />
    </Form.Item>
  </Form>
</form>

// ❌ Bad - Incorrect nesting
<Form layout="vertical" component="div">
  <form onSubmit={handleSubmit(onSubmit)}>
    {/* ... */}
  </form>
</Form>
```

### API Calls Pattern

**Use `apiService`** or feature-specific service functions

```tsx
// ✅ Good
import { apiService } from '@/core/services/api.service';

const response = await apiService.post('/user/login', { body: credentials });

// ✅ Good - Feature-specific service
import { login } from '../services/auth.service';

const result = await login(credentials);
```

### Navigation Pattern

**Use `APP_CONSTANT.ROUTES`** for route paths

```tsx
// ✅ Good
import { APP_CONSTANT } from '@/core/utils/constants';
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push(`/${APP_CONSTANT.ROUTES.TENANT.LIST}`);

// ❌ Bad
router.push('/tenant/list');
```

### Styling Pattern

- **Prefer Tailwind utility classes** for layout and spacing
- **Use CSS variables** for theme colors (`bg-background`, `text-foreground`)
- **Use Ant Design `styles` prop** for component-specific theme styles
- **Avoid inline styles** except for dynamic values

```tsx
// ✅ Good
<div className="w-full shadow-lg relative z-10">
  <Card styles={cardStyles}>
    {/* ... */}
  </Card>
</div>

// ❌ Bad
<div style={{ width: '100%', boxShadow: '...', position: 'relative' }}>
  <Card style={{ background: theme === 'light' ? '#fff' : '#000' }}>
    {/* ... */}
  </Card>
</div>
```

### Toast Notifications Pattern

**Always use `toastService`** for user feedback

```tsx
// ✅ Good
import { toastService } from '@/core/services/toast.service';

toastService.showSuccess(t('loginSuccess'));
toastService.showError(t('loginError'));
toastService.showWarning(t('warningMessage'));
```

---

## Checklist

Before submitting code, ensure:

- [ ] No hard-coded strings (all user-facing text uses translations)
- [ ] No hard-coded colors (uses theme utilities or CSS variables)
- [ ] No magic numbers (uses constants)
- [ ] No duplicated code (extracted to reusable components/hooks/utils)
- [ ] Theme-dependent styles are memoized with `useMemo`
- [ ] Functions passed as props are wrapped with `useCallback`
- [ ] All TypeScript types are properly defined
- [ ] ESLint warnings are resolved
- [ ] Components follow the correct file structure
- [ ] Imports use absolute paths with `@/` alias
- [ ] Forms use React Hook Form with proper nesting (`<form><Form>`)
- [ ] API calls use `apiService` or feature-specific services
- [ ] Navigation uses `APP_CONSTANT.ROUTES`
- [ ] Error handling uses `toastService` for user feedback

---

## Summary

Following these rules ensures:

- **DRY Code**: No repetition, everything reusable
- **Maintainability**: Centralized configuration, easy to update
- **Consistency**: Standard patterns across the codebase
- **Theme Support**: Proper light/dark theme implementation
- **Internationalization**: All text translatable
- **Type Safety**: Full TypeScript coverage
- **Performance**: Optimized with memoization and proper hooks usage

---

**Last Updated**: January 2026
