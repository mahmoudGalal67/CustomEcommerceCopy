"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText, ShieldCheck, Truck } from "lucide-react";

interface ProductAccordionProps {
    description?: string;
}

export default function ProductAccordion({
    description,
    dict
}: ProductAccordionProps & { dict: any }) {
    return (
        <Accordion
            type="single"
            collapsible
            className="w-full space-y-4"
        >

            {/* Description */}
            <AccordionItem
                value="description"
                className="rounded-2xl border border-neutral-200 px-5 transition-all hover:border-neutral-300"
            >
                <AccordionTrigger className="py-5 text-base font-medium hover:no-underline cursor-pointer">
                    <div className="flex items-center gap-3">

                        <FileText className="h-4 w-4" />
                        {dict.labels.ProductDescription}
                    </div>
                </AccordionTrigger>

                <AccordionContent className="pb-5 text-sm leading-7 ">
                    {description}
                </AccordionContent>
            </AccordionItem>

            {/* Shipping */}
            <AccordionItem
                value="shipping"
                className="rounded-2xl border border-neutral-200 px-5 transition-all hover:border-neutral-300"
            >
                <AccordionTrigger className="py-5 text-base font-medium hover:no-underline cursor-pointer">
                    <div className="flex items-center gap-3">
                        <Truck className="h-4 w-4" />
                        {dict.labels.Shipping}
                    </div>
                </AccordionTrigger>

                <AccordionContent className="pb-5 text-sm leading-7 ">
                    {dict.labels.ShippingDescData}
                </AccordionContent>
            </AccordionItem>

            {/* Materials */}
            <AccordionItem
                value="materials"
                className="rounded-2xl border border-neutral-200 px-5 transition-all hover:border-neutral-300"
            >
                <AccordionTrigger className="py-5 text-base font-medium hover:no-underline cursor-pointer">
                    <div className="flex items-center gap-3">

                        <ShieldCheck className="h-4 w-4" />
                        {dict.labels.Materials}

                    </div>
                </AccordionTrigger>

                <AccordionContent className="pb-5 text-sm leading-7 ">
                    {dict.labels.privacyDescData}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}