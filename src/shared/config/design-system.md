# 해먹 디자인 시스템 (Haemeok Design System)

프로젝트 전체에서 일관되게 사용할 색상, 스타일, 컴포넌트 규칙을 정의합니다.

---

## Color Palette

### Brand Colors (Tailwind Custom)

| Name           | Hex       | CSS Variable      | Usage                           |
| -------------- | --------- | ----------------- | ------------------------------- |
| `olive`        | `#526c04` | `olive-DEFAULT`   | Primary dark accent             |
| `olive-light`  | `#91c788` | `olive-light`     | Primary action, CTA buttons     |
| `olive-medium` | `#609966` | `olive-medium`    | Secondary accent                |
| `olive-mint`   | `#43c278` | `olive-mint`      | Success, positive actions       |
| `dark`         | `#2a2229` | `dark-DEFAULT`    | Text primary                    |
| `dark-light`   | `#393a40` | `dark-light`      | Text secondary, checkbox active |
| `beige`        | `#f7f4ee` | `beige`           | Warm background                 |
| `brown`        | `#806f5c` | `brown`           | Subtle accent                   |

### Semantic Colors (Standard Tailwind)

| Role           | Classes                   | Usage                              |
| -------------- | ------------------------- | ---------------------------------- |
| Background     | `white`, `gray-50`        | Page, card backgrounds             |
| Surface        | `gray-50`, `gray-100`     | Input backgrounds, elevated areas  |
| Border         | `gray-200`, `gray-300`    | Dividers, input borders            |
| Text Primary   | `gray-900`, `dark`        | Headings, body text                |
| Text Secondary | `gray-500`, `gray-600`    | Labels, placeholders, hints        |
| Error          | `red-500`                 | Error states, validation messages  |
| Warning        | `yellow-500`              | Warning states                     |
| Success        | `olive-mint`, `green-500` | Success states                     |

---

## Typography

### Font Family

- Primary: `Noto Sans KR` (font-noto-sans-kr)
- Fallback: `sans-serif`

### Font Sizes

| Class     | Size   | Usage                    |
| --------- | ------ | ------------------------ |
| `text-xs` | 12px   | Captions, helper text    |
| `text-sm` | 14px   | Labels, secondary text   |
| `text-base` | 16px | Body text, inputs        |
| `text-lg` | 18px   | Subheadings              |
| `text-xl` | 20px   | Section titles           |
| `text-2xl` | 24px  | Page titles              |

---

## Form Elements

### Input / Textarea

```
기본 상태:
  bg-gray-50 border border-gray-200 rounded-lg p-3 text-base

포커스 상태:
  focus:border-olive-light focus:bg-white focus:ring-1 focus:ring-olive-light/20

에러 상태:
  border-red-500 focus:border-red-500 focus:ring-red-500/20

전환 효과:
  transition-colors
```

**Full className example:**

```tsx
className={`w-full rounded-lg border bg-gray-50 p-3 text-base transition-colors
  focus:border-olive-light focus:bg-white focus:outline-none focus:ring-1 focus:ring-olive-light/20
  ${hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200"}`}
```

### Buttons

#### Primary Button

```
bg-olive-light text-white hover:bg-olive-light/90 rounded-lg px-4 py-2 font-semibold
```

#### Secondary Button (Outline)

```
bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2 font-medium
```

#### Ghost Button

```
bg-transparent text-gray-600 hover:bg-gray-100 rounded-lg px-4 py-2
```

#### Danger Button

```
text-red-500 hover:bg-red-50 rounded-lg px-4 py-2
```

### Checkbox / Radio

```
선택됨: data-[state=checked]:bg-dark-light data-[state=checked]:border-dark-light
기본: border-gray-300 h-5 w-5 rounded cursor-pointer
```

---

## Spacing & Sizing

### Border Radius

| Class        | Size | Usage                    |
| ------------ | ---- | ------------------------ |
| `rounded`    | 4px  | Small elements           |
| `rounded-md` | 6px  | Buttons                  |
| `rounded-lg` | 8px  | Inputs, small cards      |
| `rounded-xl` | 12px | Cards, containers        |
| `rounded-2xl` | 16px | Large cards, modals      |
| `rounded-full` | 50% | Avatars, circular buttons |

### Padding

| Class | Size  | Usage              |
| ----- | ----- | ------------------ |
| `p-2` | 8px   | Compact elements   |
| `p-3` | 12px  | Inputs, small cards |
| `p-4` | 16px  | Cards, sections    |
| `p-6` | 24px  | Large containers   |
| `p-8` | 32px  | Hero sections      |

---

## Z-Index Scale

| Class        | Value | Usage                    |
| ------------ | ----- | ------------------------ |
| `z-sticky`   | 10    | Sticky headers           |
| `z-header`   | 20    | Fixed headers            |
| `z-dropdown` | 30    | Dropdowns, popovers      |
| `z-modal`    | 40    | Modals, dialogs          |
| `z-toast`    | 50    | Toast notifications      |

---

## Shadows

```
Card: shadow-sm
Elevated: shadow-md
Modal: shadow-lg, shadow-xl
Floating: shadow-2xl
```

---

## Component Patterns

### Card

```tsx
<div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
  {/* content */}
</div>
```

### Section Container

```tsx
<section className="px-4 py-6">
  <h2 className="mb-4 text-xl font-bold text-gray-900">Title</h2>
  {/* content */}
</section>
```

### Form Field

```tsx
<div className="mb-6">
  <label className="mb-1 block text-sm text-gray-600">Label</label>
  <input className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 ..." />
  <p className="mt-1 text-xs text-gray-500">Helper text</p>
</div>
```

---

## Animation

### Keyframes (defined in tailwind.config.js)

- `shake`: Error feedback
- `bounce-soft`: Attention indicator
- `accordion-down/up`: Expandable sections

### Transitions

```
Default: transition-colors (for hover states)
All: transition-all duration-200 (for complex transitions)
```
