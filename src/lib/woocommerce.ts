const WooCommerceRestApi =
  require("@woocommerce/woocommerce-rest-api").default;

let api: InstanceType<typeof WooCommerceRestApi> | null = null;

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getWooCommerceApi() {
  if (api) {
    return api;
  }

  const wpApiUrl =
    process.env.WP_API_URL ??
    process.env.NEXT_PUBLIC_WP_URL;

  if (!wpApiUrl) {
    throw new Error(
      "Missing required environment variable: WP_API_URL (or legacy NEXT_PUBLIC_WP_URL)"
    );
  }

  api = new WooCommerceRestApi({
    url: wpApiUrl,
    consumerKey: getRequiredEnv("WC_KEY"),
    consumerSecret: getRequiredEnv("WC_SECRET"),
    version: "wc/v3",
  });

  return api;
}

export default getWooCommerceApi;