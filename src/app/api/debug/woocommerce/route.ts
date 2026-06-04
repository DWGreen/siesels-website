import { NextResponse } from "next/server";

import { menuConfig } from "@/config/menuConfig";
import { getWooCommerceApi } from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

function getWpApiUrl(): string | null {
  return process.env.WP_API_URL ?? process.env.NEXT_PUBLIC_WP_URL ?? null;
}

function toDebugError(error: unknown) {
  const value = error as {
    name?: string;
    message?: string;
    response?: {
      status?: number;
      data?: unknown;
    };
  };

  return {
    name: value?.name ?? "UnknownError",
    message: value?.message ?? "Unknown error",
    status: value?.response?.status ?? null,
    responsePreview: value?.response?.data
      ? JSON.stringify(value.response.data).slice(0, 300)
      : null,
  };
}

export async function GET() {
  const wpApiUrl = getWpApiUrl();

  const env = {
    hasWpApiUrl: Boolean(wpApiUrl),
    hasWcKey: Boolean(process.env.WC_KEY),
    hasWcSecret: Boolean(process.env.WC_SECRET),
    nodeEnv: process.env.NODE_ENV ?? "unknown",
  };

  try {
    const api = getWooCommerceApi();

    const rootResponse = await api.get(
      `products/categories?slug=${encodeURIComponent(menuConfig.mainMenuCategorySlug)}`
    );

    const rootCategory =
      Array.isArray(rootResponse.data) && rootResponse.data.length > 0
        ? rootResponse.data[0]
        : null;

    let childCategoryCount = 0;
    let childCategorySample: Array<{ id: number; name: string; slug: string }> = [];

    if (rootCategory?.id) {
      const childResponse = await api.get(
        `products/categories?parent=${rootCategory.id}&per_page=100`
      );

      const children = Array.isArray(childResponse.data) ? childResponse.data : [];

      childCategoryCount = children.length;
      childCategorySample = children.slice(0, 5).map((child: { id: number; name: string; slug: string }) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
      }));
    }

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      wpApiUrl,
      menuRootSlug: menuConfig.mainMenuCategorySlug,
      env,
      connection: {
        apiClientInitialized: true,
        rootCategoryFound: Boolean(rootCategory),
        rootCategory: rootCategory
          ? {
              id: rootCategory.id,
              name: rootCategory.name,
              slug: rootCategory.slug,
            }
          : null,
        childCategoryCount,
        childCategorySample,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        timestamp: new Date().toISOString(),
        wpApiUrl,
        menuRootSlug: menuConfig.mainMenuCategorySlug,
        env,
        error: toDebugError(error),
      },
      { status: 500 }
    );
  }
}
