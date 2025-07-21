# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands

- `npm run dev` - Start development server with Turbopack for faster builds
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

### Project Structure

This is a Next.js 15 project using App Router with TypeScript and Feature-Sliced Design (FSD) architecture.

## Architecture

### Feature-Sliced Design (FSD)

Follow strict layer dependency order: `shared` → `entities` → `features` → `widgets` → `app`

- **shared**: Common utilities, UI components, API clients, and configuration
- **entities**: Business entities (user, recipe, ingredient, comment, notification)
- **features**: Feature implementations (auth, recipe-create, comment-like, etc.)
- **widgets**: Complex UI compositions (RecipeGrid, Header, Footer, etc.)
- **app**: Pages, layouts, and routing

### Component Patterns

- All components use arrow functions with `const` declaration
- Use `type` instead of `interface` for TypeScript
- Server components for SEO/initial data, client components (`"use client"`) for interactions
- Controlled components for modals/drawers (receive `isOpen`, `onOpenChange` props)

### Import Order (ESLint enforced)

1. React/Next.js imports
2. Third-party libraries
3. `@/shared` imports
4. `@/entities` imports
5. `@/features` imports
6. `@/widgets` imports
7. Other `@/` imports
8. Relative imports

## State Management

### Data Fetching

- **Server**: Next.js built-in `fetch` for SSR/SSG
- **Client**: Custom `apiClient` with automatic 401 handling and token refresh
- **State**: TanStack Query for server state, Zustand for client state
- **Hydration**: Use `initialData` in TanStack Query to sync server/client state

### Key Libraries

- **UI**: Radix UI components with custom styling
- **Styling**: Tailwind CSS with custom color scheme (olive, dark, beige, brown)
- **Forms**: React Hook Form with validation
- **Animation**: Framer Motion and GSAP
- **Monitoring**: Sentry integration for error tracking

## API Configuration

### Backend Integration

- API base URL: `https://api.haemeok.com`
- All `/api/*` requests are proxied to backend
- WebSocket endpoints via `/ws/*`
- OAuth2 flows via `/oauth2/*` and `/login/*`
- Image domains: S3 bucket, Google user content, starwalk.space

### Authentication

- Cookie-based authentication with automatic refresh
- 401 errors trigger token refresh in `apiClient`
- Server-side user info fetching in `getMyInfoOnServer`

## Key Features

### PWA Support

- Progressive Web App with offline capabilities
- Service worker registration (disabled in development)
- App install prompts and first-login flows

### Real-time Features

- WebSocket integration for notifications
- SockJS/STOMP protocol implementation
- Real-time recipe interactions and comments

### Code Quality

- ESLint with Next.js, TypeScript, and Prettier configurations
- Simple import sorting enforced
- Magic numbers should be named constants
- Complex conditions should be extracted to named variables

## Development Notes

### Component Guidelines

- Single responsibility principle: one component, one role
- Separate conditional rendering into distinct components
- No prop drilling beyond 3 levels - use composition or Context
- Extract complex interactions into dedicated components

### File Organization

- Group related files by feature/domain, not just by type
- Use barrel exports (`index.ts`) for clean imports
- Keep constants near related logic or use clear naming

### Performance

- TanStack Query caching with 5min stale time, 30min GC
- Image optimization for S3, Google, and external sources
- Bundle optimization with automatic tree-shaking

# 페르소나 및 핵심 목표 (Persona & Core Goal)

당신은 Next.js, TypeScript, 그리고 Feature-Sliced Design (FSD) 아키텍처에 능숙한 시니어 프론트엔드 개발자입니다. 당신의 최우선 목표는 가독성, 유지보수성, 확장성이 뛰어난 코드를 작성하는 것입니다.

# 1. 아키텍처 (Architecture)

- 이 프로젝트는 **Next.js App Router**와 **Feature-Sliced Design (FSD)** 원칙을 엄격히 따릅니다.
- **레이어 구조:** `shared` (공유자원) → `entities` (데이터 명사) → `features` (기능 동사) → `widgets` (기능 조합) → `app` (라우팅/레이아웃) 순서의 의존성을 반드시 지켜주세요.
- **서버/클라이언트 분리:** 서버 컴포넌트에서는 훅(hook)을 사용하지 않으며, 클라이언트 상호작용이 필요한 부분은 반드시 `"use client"`를 사용한 클라이언트 컴포넌트로 분리합니다.

# 2. 코드 스타일 및 네이밍 (Code Style & Naming)

- **가장 중요한 규칙:** 프로젝트 내 **기존 코드의 스타일과 일관성을 최우선**으로 따릅니다.
- **컴포넌트 선언:** 컴포넌트는 항상 화살표 함수와 `const`로 선언합니다. `function ComponentName() {}` 형식은 사용하지 않습니다.
  - Good: `const MyComponent = () => { ... }; export default MyComponent`
  - Bad: `export default function MyComponent() { ... }`
- **타입 선언:** TypeScript 타입은 `interface` 대신 `type`을 사용합니다.
- **Magic Number 금지:** 의미를 알 수 없는 숫자는 항상 의미있는 이름을 가진 상수로 선언하세요.
- **복잡한 조건식:** 2개 이상의 논리 연산자가 포함된 조건문은 `isUserActive`, `canSubmit` 등 의미있는 이름을 가진 변수에 할당하여 가독성을 높입니다.

# 3. 상태 관리 및 데이터 Fetching (State & Fetching)

- **상태 관리:** 클라이언트 전역 상태는 **Zustand**, 서버 상태는 **TanStack Query (React Query)**를 사용합니다.
- **데이터 Fetching:**
  - **서버:** SEO가 필요하거나 초기 데이터가 중요한 페이지는 서버 컴포넌트 또는 `getServerSideProps`에서 Next.js 내장 `fetch`를 사용합니다.
  - **클라이언트:** 사용자의 상호작용으로 인한 데이터 요청은 인터셉터가 설정된 `axios` 인스턴스를 사용합니다.
  - **Hydration:** 서버에서 가져온 초기 데이터는 항상 TanStack Query의 `initialData` 옵션을 통해 클라이언트 상태와 동기화(Hydration)합니다.

# 4. 컴포넌트 설계 원칙 (Component Design Principles)

- **단일 책임 원칙:** 하나의 컴포넌트는 하나의 역할만 수행합니다. 렌더링 로직이 복잡하게 나뉘면, 별도의 컴포넌트로 분리하세요.
  - **Bad:** `if/else`나 삼항 연산자로 완전히 다른 UI를 하나의 컴포넌트 안에서 렌더링하지 마세요.
  - **Good:** `<SubmitButton>` 안에서 역할을 분리하여 `<ViewerSubmitButton />`과 `<AdminSubmitButton />`을 조건부로 렌더링하세요.
- **Prop Drilling 금지:** 3단계 이상 `prop`을 그대로 전달해야 한다면, 컴포넌트 조합(Composition)이나 React Context를 사용하여 구조를 개선하세요.
- **제어 컴포넌트:** 모달이나 드로어처럼 열림/닫힘 상태가 중요한 컴포넌트는, 내부에서 `useState`로 상태를 관리하지 말고, 부모로부터 `isOpen`, `onOpenChange` 같은 `prop`을 받아 제어되도록 설계하세요.

# 5. 프롬프트 작성 시 참고사항

- 이 가이드라인을 기반으로 코드를 생성하거나 리팩토링해주세요.
- 만약 가이드라인을 따르기 어려운 상황이라면, 그 이유와 함께 몇 가지 대안을 제시해주세요.

# Frontend Design Guideline

This document summarizes key frontend design principles and rules, showcasing
recommended patterns. Follow these guidelines when writing frontend code.

# Readability

Improving the clarity and ease of understanding code.

## Naming Magic Numbers

**Rule:** Replace magic numbers with named constants for clarity.

**Reasoning:**

- Improves clarity by giving semantic meaning to unexplained values.
- Enhances maintainability.

#### Recommended Pattern:

```typescript
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
  await postLike(url);
  await delay(ANIMATION_DELAY_MS); // Clearly indicates waiting for animation
  await refetchPostLike();
}
```

## Abstracting Implementation Details

**Rule:** Abstract complex logic/interactions into dedicated components/HOCs.

**Reasoning:**

- Reduces cognitive load by separating concerns.
- Improves readability, testability, and maintainability of components.

#### Recommended Pattern 1: Auth Guard

(Login check abstracted to a wrapper/guard component)

```tsx
// App structure
function App() {
  return (
    <AuthGuard>
      {" "}
      {/* Wrapper handles auth check */}
      <LoginStartPage />
    </AuthGuard>
  );
}

// AuthGuard component encapsulates the check/redirect logic
function AuthGuard({ children }) {
  const status = useCheckLoginStatus();
  useEffect(() => {
    if (status === "LOGGED_IN") {
      location.href = "/home";
    }
  }, [status]);

  // Render children only if not logged in, otherwise render null (or loading)
  return status !== "LOGGED_IN" ? children : null;
}

// LoginStartPage is now simpler, focused only on login UI/logic
function LoginStartPage() {
  // ... login related logic ONLY ...
  return <>{/* ... login related components ... */}</>;
}
```

#### Recommended Pattern 2: Dedicated Interaction Component

(Dialog logic abstracted into a dedicated `InviteButton` component)

```tsx
export function FriendInvitation() {
  const { data } = useQuery(/* ... */);

  return (
    <>
      {/* Use the dedicated button component */}
      <InviteButton name={data.name} />
      {/* ... other UI ... */}
    </>
  );
}

// InviteButton handles the confirmation flow internally
function InviteButton({ name }) {
  const handleClick = async () => {
    const canInvite = await overlay.openAsync(({ isOpen, close }) => (
      <ConfirmDialog
        title={`Share with ${name}`}
        // ... dialog setup ...
      />
    ));

    if (canInvite) {
      await sendPush();
    }
  };

  return <Button onClick={handleClick}>Invite</Button>;
}
```

## Separating Code Paths for Conditional Rendering

**Rule:** Separate significantly different conditional UI/logic into distinct
components.

**Reasoning:**

- Improves readability by avoiding complex conditionals within one component.
- Ensures each specialized component has a clear, single responsibility.

#### Recommended Pattern:

(Separate components for each role)

```tsx
function SubmitButton() {
  const isViewer = useRole() === "viewer";

  // Delegate rendering to specialized components
  return isViewer ? <ViewerSubmitButton /> : <AdminSubmitButton />;
}

// Component specifically for the 'viewer' role
function ViewerSubmitButton() {
  return <TextButton disabled>Submit</TextButton>;
}

// Component specifically for the 'admin' (or non-viewer) role
function AdminSubmitButton() {
  useEffect(() => {
    showAnimation(); // Animation logic isolated here
  }, []);

  return <Button type="submit">Submit</Button>;
}
```

## Simplifying Complex Ternary Operators

**Rule:** Replace complex/nested ternaries with `if`/`else` or IIFEs for
readability.

**Reasoning:**

- Makes conditional logic easier to follow quickly.
- Improves overall code maintainability.

#### Recommended Pattern:

(Using an IIFE with `if` statements)

```typescript
const status = (() => {
  if (ACondition && BCondition) return "BOTH";
  if (ACondition) return "A";
  if (BCondition) return "B";
  return "NONE";
})();
```

## Reducing Eye Movement (Colocating Simple Logic)

**Rule:** Colocate simple, localized logic or use inline definitions to reduce
context switching.

**Reasoning:**

- Allows top-to-bottom reading and faster comprehension.
- Reduces cognitive load from context switching (eye movement).

#### Recommended Pattern A: Inline `switch`

```tsx
function Page() {
  const user = useUser();

  // Logic is directly visible here
  switch (user.role) {
    case "admin":
      return (
        <div>
          <Button disabled={false}>Invite</Button>
          <Button disabled={false}>View</Button>
        </div>
      );
    case "viewer":
      return (
        <div>
          <Button disabled={true}>Invite</Button> {/* Example for viewer */}
          <Button disabled={false}>View</Button>
        </div>
      );
    default:
      return null;
  }
}
```

#### Recommended Pattern B: Colocated simple policy object

```tsx
function Page() {
  const user = useUser();
  // Simple policy defined right here, easy to see
  const policy = {
    admin: { canInvite: true, canView: true },
    viewer: { canInvite: false, canView: true },
  }[user.role];

  // Ensure policy exists before accessing properties if role might not match
  if (!policy) return null;

  return (
    <div>
      <Button disabled={!policy.canInvite}>Invite</Button>
      <Button disabled={!policy.canView}>View</Button>
    </div>
  );
}
```

## Naming Complex Conditions

**Rule:** Assign complex boolean conditions to named variables.

**Reasoning:**

- Makes the _meaning_ of the condition explicit.
- Improves readability and self-documentation by reducing cognitive load.

#### Recommended Pattern:

(Conditions assigned to named variables)

```typescript
const matchedProducts = products.filter((product) => {
  // Check if product belongs to the target category
  const isSameCategory = product.categories.some(
    (category) => category.id === targetCategory.id
  );

  // Check if any product price falls within the desired range
  const isPriceInRange = product.prices.some(
    (price) => price >= minPrice && price <= maxPrice
  );

  // The overall condition is now much clearer
  return isSameCategory && isPriceInRange;
});
```

**Guidance:** Name conditions when the logic is complex, reused, or needs unit
testing. Avoid naming very simple, single-use conditions.

# Predictability

Ensuring code behaves as expected based on its name, parameters, and context.

## Standardizing Return Types

**Rule:** Use consistent return types for similar functions/hooks.

**Reasoning:**

- Improves code predictability; developers can anticipate return value shapes.
- Reduces confusion and potential errors from inconsistent types.

#### Recommended Pattern 1: API Hooks (React Query)

```typescript
// Always return the Query object
import { useQuery, UseQueryResult } from "@tanstack/react-query";

// Assuming fetchUser returns Promise<UserType>
function useUser(): UseQueryResult<UserType, Error> {
  const query = useQuery({ queryKey: ["user"], queryFn: fetchUser });
  return query;
}

// Assuming fetchServerTime returns Promise<Date>
function useServerTime(): UseQueryResult<Date, Error> {
  const query = useQuery({
    queryKey: ["serverTime"],
    queryFn: fetchServerTime,
  });
  return query;
}
```

#### Recommended Pattern 2: Validation Functions

(Using a consistent type, ideally a Discriminated Union)

```typescript
type ValidationResult = { ok: true } | { ok: false; reason: string };

function checkIsNameValid(name: string): ValidationResult {
  if (name.length === 0) return { ok: false, reason: "Name cannot be empty." };
  if (name.length >= 20)
    return { ok: false, reason: "Name cannot be longer than 20 characters." };
  return { ok: true };
}

function checkIsAgeValid(age: number): ValidationResult {
  if (!Number.isInteger(age))
    return { ok: false, reason: "Age must be an integer." };
  if (age < 18) return { ok: false, reason: "Age must be 18 or older." };
  if (age > 99) return { ok: false, reason: "Age must be 99 or younger." };
  return { ok: true };
}

// Usage allows safe access to 'reason' only when ok is false
const nameValidation = checkIsNameValid(name);
if (!nameValidation.ok) {
  console.error(nameValidation.reason);
}
```

## Revealing Hidden Logic (Single Responsibility)

**Rule:** Avoid hidden side effects; functions should only perform actions
implied by their signature (SRP).

**Reasoning:**

- Leads to predictable behavior without unintended side effects.
- Creates more robust, testable code through separation of concerns (SRP).

#### Recommended Pattern:

```typescript
// Function *only* fetches balance
async function fetchBalance(): Promise<number> {
  const balance = await http.get<number>("...");
  return balance;
}

// Caller explicitly performs logging where needed
async function handleUpdateClick() {
  const balance = await fetchBalance(); // Fetch
  logging.log("balance_fetched"); // Log (explicit action)
  await syncBalance(balance); // Another action
}
```

## Using Unique and Descriptive Names (Avoiding Ambiguity)

**Rule:** Use unique, descriptive names for custom wrappers/functions to avoid
ambiguity.

**Reasoning:**

- Avoids ambiguity and enhances predictability.
- Allows developers to understand specific actions (e.g., adding auth) directly
  from the name.

#### Recommended Pattern:

```typescript
// In httpService.ts - Clearer module name
import { http as httpLibrary } from "@some-library/http";

export const httpService = {
  // Unique module name
  async getWithAuth(url: string) {
    // Descriptive function name
    const token = await fetchToken();
    return httpLibrary.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// In fetchUser.ts - Usage clearly indicates auth
import { httpService } from "./httpService";
export async function fetchUser() {
  // Name 'getWithAuth' makes the behavior explicit
  return await httpService.getWithAuth("...");
}
```

# Cohesion

Keeping related code together and ensuring modules have a well-defined, single
purpose.

## Considering Form Cohesion

**Rule:** Choose field-level or form-level cohesion based on form requirements.

**Reasoning:**

- Balances field independence (field-level) vs. form unity (form-level).
- Ensures related form logic is appropriately grouped based on requirements.

#### Recommended Pattern (Field-Level Example):

```tsx
// Each field uses its own `validate` function
import { useForm } from "react-hook-form";

export function Form() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    /* defaultValues etc. */
  });

  const onSubmit = handleSubmit((formData) => {
    console.log("Form submitted:", formData);
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        <input
          {...register("name", {
            validate: (value) =>
              value.trim() === "" ? "Please enter your name." : true, // Example validation
          })}
          placeholder="Name"
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div>
        <input
          {...register("email", {
            validate: (value) =>
              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                ? true
                : "Invalid email address.", // Example validation
          })}
          placeholder="Email"
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### Recommended Pattern (Form-Level Example):

```tsx
// A single schema defines validation for the whole form
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1, "Please enter your name."),
  email: z.string().min(1, "Please enter your email.").email("Invalid email."),
});

export function Form() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  });

  const onSubmit = handleSubmit((formData) => {
    console.log("Form submitted:", formData);
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        <input {...register("name")} placeholder="Name" />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div>
        <input {...register("email")} placeholder="Email" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Guidance:** Choose **field-level** for independent validation, async checks,
or reusable fields. Choose **form-level** for related fields, wizard forms, or
interdependent validation.

## Organizing Code by Feature/Domain

**Rule:** Organize directories by feature/domain, not just by code type.

**Reasoning:**

- Increases cohesion by keeping related files together.
- Simplifies feature understanding, development, maintenance, and deletion.

#### Recommended Pattern:

(Organized by feature/domain)

```
src/
├── components/ # Shared/common components
├── hooks/      # Shared/common hooks
├── utils/      # Shared/common utils
├── domains/
│   ├── user/
│   │   ├── components/
│   │   │   └── UserProfileCard.tsx
│   │   ├── hooks/
│   │   │   └── useUser.ts
│   │   └── index.ts # Optional barrel file
│   ├── product/
│   │   ├── components/
│   │   │   └── ProductList.tsx
│   │   ├── hooks/
│   │   │   └── useProducts.ts
│   │   └── ...
│   └── order/
│       ├── components/
│       │   └── OrderSummary.tsx
│       ├── hooks/
│       │   └── useOrder.ts
│       └── ...
└── App.tsx
```

## Relating Magic Numbers to Logic

**Rule:** Define constants near related logic or ensure names link them clearly.

**Reasoning:**

- Improves cohesion by linking constants to the logic they represent.
- Prevents silent failures caused by updating logic without updating related
  constants.

#### Recommended Pattern:

```typescript
// Constant clearly named and potentially defined near animation logic
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
  await postLike(url);
  // Delay uses the constant, maintaining the link to the animation
  await delay(ANIMATION_DELAY_MS);
  await refetchPostLike();
}
```

_Ensure constants are maintained alongside the logic they depend on or clearly
named to show the relationship._

# Coupling

Minimizing dependencies between different parts of the codebase.

## Balancing Abstraction and Coupling (Avoiding Premature Abstraction)

**Rule:** Avoid premature abstraction of duplicates if use cases might diverge;
prefer lower coupling.

**Reasoning:**

- Avoids tight coupling from forcing potentially diverging logic into one
  abstraction.
- Allowing some duplication can improve decoupling and maintainability when
  future needs are uncertain.

#### Guidance:

Before abstracting, consider if the logic is truly identical and likely to
_stay_ identical across all use cases. If divergence is possible (e.g.,
different pages needing slightly different behavior from a shared hook like
`useOpenMaintenanceBottomSheet`), keeping the logic separate initially (allowing
duplication) can lead to more maintainable, decoupled code. Discuss trade-offs
with the team. _[No specific 'good' code example here, as the recommendation is
situational awareness rather than a single pattern]._

## Scoping State Management (Avoiding Overly Broad Hooks)

**Rule:** Break down broad state management into smaller, focused
hooks/contexts.

**Reasoning:**

- Reduces coupling by ensuring components only depend on necessary state slices.
- Improves performance by preventing unnecessary re-renders from unrelated state
  changes.

#### Recommended Pattern:

(Focused hooks, low coupling)

```typescript
// Hook specifically for cardId query param
import { useQueryParam, NumberParam } from "use-query-params";
import { useCallback } from "react";

export function useCardIdQueryParam() {
  // Assuming 'query' provides the raw param value
  const [cardIdParam, setCardIdParam] = useQueryParam("cardId", NumberParam);

  const setCardId = useCallback(
    (newCardId: number | undefined) => {
      setCardIdParam(newCardId, "replaceIn"); // Or 'push' depending on desired history behavior
    },
    [setCardIdParam]
  );

  // Provide a stable return tuple
  return [cardIdParam ?? undefined, setCardId] as const;
}

// Separate hook for date range, etc.
// export function useDateRangeQueryParam() { /* ... */ }
```

Components now only import and use `useCardIdQueryParam` if they need `cardId`,
decoupling them from date range state, etc.

## Eliminating Props Drilling with Composition

**Rule:** Use Component Composition instead of Props Drilling.

**Reasoning:**

- Significantly reduces coupling by eliminating unnecessary intermediate
  dependencies.
- Makes refactoring easier and clarifies data flow in flatter component trees.

#### Recommended Pattern:

```tsx
import React, { useState } from "react";

// Assume Modal, Input, Button, ItemEditList components exist

function ItemEditModal({ open, items, recommendedItems, onConfirm, onClose }) {
  const [keyword, setKeyword] = useState("");

  // Render children directly within Modal, passing props only where needed
  return (
    <Modal open={open} onClose={onClose}>
      {/* Input and Button rendered directly */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)} // State managed here
          placeholder="Search items..."
        />
        <Button onClick={onClose}>Close</Button>
      </div>
      {/* ItemEditList rendered directly, gets props it needs */}
      <ItemEditList
        keyword={keyword} // Passed directly
        items={items} // Passed directly
        recommendedItems={recommendedItems} // Passed directly
        onConfirm={onConfirm} // Passed directly
      />
    </Modal>
  );
}

// The intermediate ItemEditBody component is eliminated, reducing coupling.
```
