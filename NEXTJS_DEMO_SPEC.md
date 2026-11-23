# Đặc Tả Dự Án: VTea POS — Next.js Seminar Demo (Bản 3 Trang Tinh Gọn)

> **Mục đích file này:** Tài liệu handoff đầy đủ cho AI Agent ở repo mới để khởi tạo và code hoàn chỉnh ứng dụng **VTea POS** bằng **Next.js (App Router)**, phục vụ **Live Demo 4 phút** bám sát toàn bộ nội dung Seminar Next.js.

---

## 1. Mục tiêu & Tech Stack

- **Framework:** Next.js 15+ (App Router, TypeScript, dùng thư mục `src/`).
- **Styling:** Tailwind CSS.
- **Icons:** `lucide-react`.
- **Dữ liệu (In-Memory Store):**
  - Toàn bộ dữ liệu nằm tập trung tại `src/lib/data.ts` (mảng trên RAM Node.js, gắn vào `globalThis` để không bị reset khi Hot Reload ở chế độ dev).
  - **Không dùng database ngoài** và **không cần Login/Auth** để tránh lỗi kết nối khi demo trực tiếp.
- **Các kiến thức Seminar bắt buộc thể hiện rõ trong code:**
  1. **App Router, Nested Route & Dynamic Route:** `/`, `/admin/menu`, `/orders/[id]`.
  2. **Server Component vs Client Component & Server–Client Boundary:** Danh sách món render ở Server (mở `View Page Source` thấy đầy đủ tên món & giá tiền), còn nút chọn món & giỏ hàng là `'use client'` (Hydration).
  3. **Data Mutation & Revalidation (Cache):** Thêm món ở `/admin/menu` → `POST /api/menu` gọi `revalidatePath('/')` → quay lại `/` thấy món mới ngay.
  4. **Route Handlers:** `src/app/api/orders/route.ts` và `src/app/api/menu/route.ts`.
  5. **Tối ưu hóa tích hợp:** `<Image />` (nén WebP, chống vỡ khung), `next/font`, `<Script strategy="afterInteractive" />`.
  6. **Vercel CI/CD:** Header có tên quán dễ sửa (`"VTea POS"` → `"VTea Express"`) để `git push` demo tự động build & deploy.

---

## 2. Cấu trúc thư mục bắt buộc

> **Lưu ý:** Thư mục `components/` và `lib/` đặt **ngoài `app/`** để minh họa đúng quy tắc của App Router.

```text
vtea-pos-demo/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root Layout: next/font, <Script>, Header ("VTea POS")
│   │   ├── globals.css
│   │   ├── page.tsx                    # [Trang 1] Màn hình Bán hàng POS (Server Component)
│   │   ├── orders/
│   │   │   └── [id]/
│   │   │       └── page.tsx            # [Trang 2] Hóa đơn Đơn hàng (Dynamic Route + SSR)
│   │   ├── admin/
│   │   │   └── menu/
│   │   │       └── page.tsx            # [Trang 3] Quản lý Thực đơn (Thêm món + Revalidate)
│   │   └── api/
│   │       ├── menu/
│   │       │   └── route.ts            # Route Handler: GET, POST (có revalidatePath)
│   │       └── orders/
│   │           └── route.ts            # Route Handler: GET, POST (tạo đơn hàng)
│   ├── components/
│   │   ├── Header.tsx                  # Navbar chung (Link tới / và /admin/menu)
│   │   ├── pos/
│   │   │   ├── CartContext.tsx         # 'use client' — Context quản lý giỏ hàng
│   │   │   ├── AddToCartButton.tsx     # 'use client' — Nút bấm nhỏ đặt trong card Server Component
│   │   │   └── PosCart.tsx             # 'use client' — Cột phải: giỏ hàng, chọn đá/đường, Thanh toán
│   │   └── admin/
│   │       └── AddMenuForm.tsx         # 'use client' — Form thêm món mới gọi POST /api/menu
│   └── lib/
│       ├── types.ts                    # TypeScript interfaces (MenuItem, Order, OrderItem)
│       └── data.ts                     # In-memory store (globalThis) + seed data
└── public/
    └── images/                         # Ảnh sản phẩm trà sữa (hoặc dùng remotePatterns ổn định)
```

---

## 3. Chi tiết từng màn hình & API

### 3.1. Root Layout (`src/app/layout.tsx`) & Header (`src/components/Header.tsx`)
- Import font `Be_Vietnam_Pro` từ `next/font/google` (`subsets: ['latin', 'vietnamese']`) và gắn vào `<body>`.
- Nhúng 1 `<Script id="vtea-analytics" strategy="afterInteractive">` chạy `console.log('[VTea] Analytics script loaded')` để minh họa tối ưu `<Script />`.
- Trong `Header.tsx`, đặt tên quán kèm comment rõ ràng:
  ```tsx
  {/* DEMO CI/CD: Đổi "VTea POS" thành "VTea Express" rồi git push */}
  <span>VTea POS</span>
  ```
- Có 2 link điều hướng gọn gàng: **Bán hàng POS (`/`)** và **Quản lý Thực đơn (`/admin/menu`)**.

---

### 3.2. Trang 1 — Màn hình Bán hàng POS (`src/app/page.tsx`)
- **Kiến trúc Server–Client Boundary chuẩn:**
  - `src/app/page.tsx` là **Server Component** (không có `'use client'`), đọc danh sách món trực tiếp từ `src/lib/data.ts`.
  - Bọc layout 2 cột bằng `<CartProvider>` (`'use client'`), nhưng truyền danh sách món (Server Component) vào qua `children` — đảm bảo toàn bộ tên món, giá tiền và ảnh vẫn được render ở Server và **hiển thị đầy đủ khi bấm `View Page Source`**.
- **Cột trái (Danh sách món — Server Component):**
  - Hiển thị dạng lưới (Grid 2–3 cột) các món trà sữa (seed sẵn ít nhất 6 món, bắt buộc có **Trà Ô Long** và **Trà Nhài Sữa** để khớp kịch bản demo).
  - Mỗi card hiển thị ảnh dùng `<Image />` (có `width`, `height` hoặc `fill` + `sizes` rõ ràng để Next.js tự nén sang WebP và không vỡ khung), tên món, giá tiền (format VNĐ), và nút `<AddToCartButton item={item} />` (`'use client'`).
- **Cột phải (Giỏ hàng — `PosCart.tsx`, `'use client'`):**
  - Hiển thị các món đã chọn, nút tăng/giảm số lượng (`+` / `-`), nút xóa.
  - Cho phép chọn nhanh **Đá** (100% / 50% / Ít đá) và **Đường** (100% / 70% / 50%).
  - Tính tổng tiền tự động.
  - Nút **"Thanh toán"**: gửi `POST /api/orders` → nhận `order.id` → dùng `useRouter().push(\`/orders/\${order.id}\`)` chuyển ngay sang Trang 2.

---

### 3.3. Trang 2 — Hóa đơn Đơn hàng (`src/app/orders/[id]/page.tsx`)
- **Mô hình:** Dynamic Route `[id]` + **SSR** (`export const dynamic = 'force-dynamic'`).
- **Yêu cầu:**
  - Server Component nhận `params: Promise<{ id: string }>`.
  - Tìm đơn hàng theo `id` trong `src/lib/data.ts`. Nếu không tìm thấy → gọi `notFound()`.
  - Hiển thị giao diện hóa đơn (Receipt) đẹp, rõ ràng:
    - Mã đơn hàng (ví dụ: `#171092`), thời gian tạo.
    - Danh sách món (tên món, tùy chọn đá/đường, số lượng, thành tiền).
    - Tổng tiền thanh toán.
    - Nút **"Quay lại bán hàng (`/`)**".

---

### 3.4. Trang 3 — Quản lý Thực đơn (`src/app/admin/menu/page.tsx`)
- **Mô hình:** Nested Route + Data Mutation & Cache Revalidation.
- **Yêu cầu:**
  - Là Server Component hiển thị bảng danh sách tất cả các món hiện có (STT, Tên món, Giá tiền).
  - Bên cạnh (hoặc phía trên) là `<AddMenuForm />` (`'use client'`) siêu gọn chỉ gồm:
    - Ô nhập **Tên món** (ví dụ placeholder: `Trà Xoài Macchiato`).
    - Ô nhập **Giá tiền** (VNĐ, ví dụ placeholder: `42000`).
    - Nút **"Thêm món"**.
  - **Không cần** làm nút Sửa / Xóa để giữ giao diện tinh gọn.
  - Khi bấm **"Thêm món"**: gọi `POST /api/menu` → hiện thông báo thành công, gọi `router.refresh()` để cập nhật bảng tại chỗ, và có link nhanh **"Về trang POS kiểm tra (`/`)**".

---

### 3.5. Route Handlers (`src/app/api/.../route.ts`)
- **`src/app/api/orders/route.ts`:**
  - `GET`: Trả về danh sách đơn hàng.
  - `POST`: Nhận `{ items, totalAmount }`, tạo `id` ngẫu nhiên 6 chữ số (ví dụ `Math.floor(100000 + Math.random() * 900000).toString()`), lưu vào `src/lib/data.ts`, trả về status `201` kèm object đơn hàng.
- **`src/app/api/menu/route.ts`:**
  - `GET`: Trả về danh sách món.
  - `POST`: Nhận `{ name, price }`, validate cơ bản, thêm món mới (kèm ảnh mặc định đẹp) vào `src/lib/data.ts`, sau đó **gọi `revalidatePath('/')` và `revalidatePath('/admin/menu')`** từ `next/cache`, trả về status `201`.

---

## 4. Tiêu chí nghiệm thu (Acceptance Criteria)

Agent sau khi code xong cần tự kiểm tra:
1. `npm run build` chạy **thành công 100%** không lỗi TypeScript/ESLint.
2. Mở `localhost:3000` (`npm run build && npm run start`):
   - `View Page Source` tại `/` thấy rõ tên các món như `"Trà Ô Long"`, `"Trà Nhài Sữa"` và giá tiền trong HTML gốc.
   - Chọn món, chỉnh đá/đường, bấm **Thanh toán** → chuyển sang `/orders/[id]` hiển thị đúng hóa đơn.
   - Vào `/admin/menu`, thêm món `"Trà Xoài Macchiato"` giá `42000` → quay lại `/` thấy món mới xuất hiện ngay lập tức.
3. Sẵn sàng deploy lên Vercel mà không cần biến môi trường (`.env`) hay database ngoài.

---

## 5. Kịch bản Live Demo 4 phút (Khớp Slide Seminar)

| Thời gian | Thao tác trên màn hình | Lý thuyết đối chứng |
| :--- | :--- | :--- |
| **0:00 – 1:00** | Mở `/` (`localhost:3000`), chọn 2 ly Ô Long, 1 ly Nhài Sữa. Mở F12 xem ảnh & `View Page Source`. | `<Image />` tự nén WebP; HTML có sẵn tên & giá món (Server Component, tốt cho SEO). |
| **1:00 – 2:00** | Chỉnh đá/đường, bấm **Thanh toán** → tự chuyển sang `/orders/[id]`. | Giỏ hàng dùng `'use client'` (Hydration); Hóa đơn dùng Dynamic Route `[id]` của App Router. |
| **2:00 – 3:00** | Vào `/admin/menu`, thêm **"Trà Xoài Macchiato"** giá `42.000đ` → quay lại `/` thấy món xuất hiện ngay. | Route Handler `POST /api/menu` + `revalidatePath('/')` tự xóa cache cũ và làm mới dữ liệu tức thì. |
| **3:00 – 4:00** | Đổi `"VTea POS"` thành `"VTea Express"` trong `Header.tsx` → `git push` → mở Vercel Dashboard & link live. | Hệ sinh thái Vercel + Next.js: tự động CI/CD 100%, tự đóng gói Route Handler thành Serverless Function. |
