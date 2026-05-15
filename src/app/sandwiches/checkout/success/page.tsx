type Props = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  return (
    <main
      className="
        min-h-screen
        bg-[#e6e6e6]
        px-6
        py-20
        text-neutral-950
      "
    >
      <div
        className="
          mx-auto
          max-w-3xl
          border-2
          border-neutral-950
          bg-white
          p-10
          text-center
        "
      >
        <h1
          className="
            text-4xl
            font-black
            uppercase
            tracking-[0.22em]
          "
        >
          Order Received
        </h1>

        <p
          className="
            mt-6
            text-sm
            font-semibold
            leading-relaxed
          "
        >
          Thank you. Your payment was completed successfully.
        </p>

        {params.session_id && (
          <p
            className="
              mt-6
              break-all
              text-xs
              text-neutral-600
            "
          >
            Session ID: {params.session_id}
          </p>
        )}
      </div>
    </main>
  );
}