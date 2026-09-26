"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Trash, Plus } from "lucide-react"
import { useGetProductsNameQuery } from "@/services/ProductsApi"
import { useCMS } from "../store"
import { type CountDownOffers } from "../Types"

function formatForInput(isoString: string) {
    const date = new Date(isoString)

    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    const hh = String(date.getHours()).padStart(2, "0")
    const min = String(date.getMinutes()).padStart(2, "0")

    return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}



export default function SideBarOfferProducts() {

    const { selectedSection, updateProp } = useCMS();
    const { data: productsNames } = useGetProductsNameQuery(undefined)



    if (!selectedSection) return;

    return (
        <div className="space-y-6">
            {/* Main Input */}
            <Input
                placeholder="Main filter input..."
                value={(selectedSection.props as CountDownOffers).title}
                onChange={(e) =>
                    updateProp(selectedSection.id, "title", e.target.value)
                }
            />

            {/* Groups */}
            <div className="space-y-4">
                {(selectedSection.props as CountDownOffers).offers.map((offer: any) => (
                    <Card
                        key={offer.id}
                        className="p-4 flex flex-col  gap-4 items-center"
                    >
                        {/* Select */}
                        <Select
                            value={offer.offerProduct}
                            onValueChange={(val) => {
                                const newOffers = (selectedSection.props as CountDownOffers).offers.map((o: any) =>
                                    o.id == offer.id ? { ...o, offerProduct: val } : o
                                );
                                updateProp(selectedSection.id, "offers", newOffers);
                            }}
                        >
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                                {productsNames?.map((p: { name: string; id: string }) => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Number Input */}
                        <Input
                            type="number"
                            placeholder="Enter number"
                            value={offer.offerValue}
                            onChange={(e) =>
                                updateProp(selectedSection.id, "offers", (prevOffers: any = []) =>
                                    prevOffers.map((prevOffer: any) =>
                                        prevOffer.id === offer.id
                                            ? { ...prevOffer, offerValue: e.target.value }
                                            : prevOffer
                                    )
                                )
                            }
                        />

                        {/* Date Input */}
                        <Input
                            type="datetime-local"
                            value={offer.date}
                            onChange={(e) =>
                                updateProp(selectedSection.id, "offers", (prevOffers: any = []) =>
                                    prevOffers.map((prevOffer: any) =>
                                        prevOffer.id === offer.id
                                            ? { ...prevOffer, date: e.target.value }
                                            : prevOffer
                                    )
                                )
                            }
                        />

                        {/* Delete Button */}
                        <Button
                            variant="destructive"
                            className="w-full cursor-pointer"
                            size="icon"
                            onClick={() => updateProp(selectedSection.id, "offers", (prevOffers = []) =>
                                prevOffers.filter((prevOffer: any) => prevOffer.id !== offer.id)
                            )}
                        >
                            <Trash className="w-4 h-4" />
                        </Button>
                    </Card>
                ))}
            </div>

            {/* Add Group */}
            <Button className="flex items-center gap-2"
                onClick={() =>
                    updateProp(selectedSection.id, "offers", (prevOffers = []) => [
                        ...prevOffers,
                        {
                            id: crypto.randomUUID(),
                            offerProduct: productsNames[0].id,
                            offerValue: 10,
                            date: formatForInput(new Date().toISOString())
                            ,
                        },
                    ])
                }
            >
                <Plus className="w-4 h-4" />
                Add Offers
            </Button>


        </div>
    )
}