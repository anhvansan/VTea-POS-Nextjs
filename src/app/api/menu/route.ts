import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { addMenuItem, getMenuItems, updateMenuItem } from "@/lib/data";

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

async function persistImage(value: unknown): Promise<string | undefined> {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (trimmed.startsWith("/images/")) {
    return trimmed;
  }

  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(trimmed);
  if (!match) return undefined;

  const mime = match[1].toLowerCase();
  const base64Data = match[2];
  const ext = MIME_TO_EXT[mime] ?? "png";
  const fileName = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;

  try {
    const imagesDir = path.join(process.cwd(), "public", "images");
    await mkdir(imagesDir, { recursive: true });
    await writeFile(
      path.join(imagesDir, fileName),
      Buffer.from(base64Data, "base64")
    );
    return `/images/${fileName}`;
  } catch {
    // Fallback an toàn khi chạy trên môi trường read-only (ví dụ Vercel)
    return trimmed;
  }
}

export async function GET() {
  return NextResponse.json({ items: getMenuItems() });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: unknown;
      price?: unknown;
      category?: unknown;
      description?: unknown;
      image?: unknown;
    };

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const price = Number(body.price);

    if (!name) {
      return NextResponse.json(
        { error: "Tên món không được để trống." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: "Giá tiền phải là số dương hợp lệ." },
        { status: 400 }
      );
    }

    const savedImage = await persistImage(body.image);

    const created = addMenuItem({
      name,
      price,
      category: typeof body.category === "string" ? body.category : undefined,
      description:
        typeof body.description === "string" ? body.description : undefined,
      image: savedImage,
    });

    revalidatePath("/");
    revalidatePath("/admin/menu");

    return NextResponse.json({ item: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Dữ liệu gửi lên không hợp lệ." },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: unknown;
      name?: unknown;
      price?: unknown;
      image?: unknown;
    };

    const id = typeof body.id === "string" ? body.id.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const price = Number(body.price);

    if (!id) {
      return NextResponse.json(
        { error: "Thiếu mã món cần cập nhật." },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Tên món không được để trống." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: "Giá tiền phải là số dương hợp lệ." },
        { status: 400 }
      );
    }

    const savedImage = await persistImage(body.image);

    const updated = updateMenuItem(id, {
      name,
      price,
      image: savedImage,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Không tìm thấy món cần chỉnh sửa." },
        { status: 404 }
      );
    }

    revalidatePath("/");
    revalidatePath("/admin/menu");

    return NextResponse.json({ item: updated }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Dữ liệu cập nhật không hợp lệ." },
      { status: 400 }
    );
  }
}
