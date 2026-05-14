import MenuCard from "./MenuCard";

type Props = {
  products: any[];
};

export default function MenuGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <MenuCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}