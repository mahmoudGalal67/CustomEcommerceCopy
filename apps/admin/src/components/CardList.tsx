import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";

const CardList = ({ title, items }: { title: string; items: any }) => {
  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-2">
        {title === "low stock products"
          ? items.map((item: any) => (
              <Card
                key={item.id}
                className="flex-row items-center justify-between gap-4 p-4"
              >
                <div className="w-12 h-12 rounded-sm relative overflow-hidden">
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_API_URL + "/storage/" + item.image
                    }
                    alt={item.slug}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">
                    {item.slug}
                  </CardTitle>
                </CardContent>
                <CardFooter className="p-0">{item.stock}</CardFooter>
              </Card>
            ))
          : items.map((item: any) => (
              <Card
                key={item.id}
                className="flex-row items-center justify-between gap-4 p-4"
              >
                <div className="w-12 h-12 rounded-sm relative overflow-hidden">
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_API_URL + "/storage/" + item.image
                    }
                    alt={item.slug}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">
                    {item.slug}
                  </CardTitle>
                </CardContent>
                <CardFooter className="p-0">{item.sold}</CardFooter>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default CardList;
