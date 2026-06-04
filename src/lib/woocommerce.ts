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

  api = new WooCommerceRestApi({
    url: getRequiredEnv("WP_API_URL"),
    consumerKey: getRequiredEnv("WC_KEY"),
    consumerSecret: getRequiredEnv("WC_SECRET"),
    version: "wc/v3",
  });

  return api;
}

export default getWooCommerceApi;