type Props = {
  product: any;
};

export default function MenuCard({ product }: Props) {
  return (
    <div className="border rounded-xl p-4">
      <img
        src={product.images?.[0]?.src}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg"
      />

      <h2 className="text-xl font-bold mt-2">
        {product.name}
      </h2>

      <p className="text-gray-500">
        ${product.price}
      </p>
    </div>
  );
}