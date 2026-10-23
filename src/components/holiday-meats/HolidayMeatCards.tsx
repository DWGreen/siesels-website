import Image from "next/image";
import Link from "next/link";

type Meat = { title: string; href: string; image: string; description: string };

export default function HolidayMeatCards({ meats }: { meats: Meat[] }) {
  return (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-4">

              {meats.map((meat) => (
                <li key={meat.href} className="min-w-0">
                  <Link
                    href={meat.href}
                    className="group flex h-full flex-col overflow-hidden border border-[#b8aa97] bg-[#faf8f3] p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9d321e]"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={meat.image}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 240px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5 xl:p-2 text-sm font-medium text-gray-700">
                      <h3 className="mb-2 font-heading text-[23px] font-bold uppercase tracking-[0.08em] text-brand-black xl:text-[21px] xl:tracking-[0.02em]">{meat.title}</h3>
                      <span aria-hidden="true" className="mb-3 block h-0.5 w-10 bg-[#9d321e]" />
                      <p className="mb-5 font-serif text-base font-normal leading-6 text-brand-black xl:text-sm xl:leading-5">{meat.description}</p>
                      <span className="mt-auto inline-flex min-h-11 items-center self-start bg-brand-black px-5 font-heading text-sm font-bold uppercase tracking-[0.15em] text-white xl:px-3 xl:text-xs xl:tracking-[0.1em] transition-colors group-hover:bg-[#9d321e]">
                        {meat.href === "/turducken" ? "Call to Order" : "Reserve Now"} &gt;
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
  );
}
