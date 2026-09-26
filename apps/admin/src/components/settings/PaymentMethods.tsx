"use client";

import { Plus, Trash2, CreditCard } from "lucide-react";
import {
    Control,
    useFieldArray,
    UseFormRegister,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
    SettingsFormValues,
} from "./settings.schema";

type Props = {
    control: Control<SettingsFormValues>;
    register: UseFormRegister<SettingsFormValues>;
};

export default function PaymentMethods({
    control,
    register,
}: Props) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "payment_methods",
    });

    const addMethod = () => {
        append({
            id: crypto.randomUUID(),
            name: "",
            number: "",
        });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                    Payment Methods
                </CardTitle>

                <Button
                    type="button"
                    onClick={addMethod}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Method
                </Button>
            </CardHeader>

            <CardContent className="space-y-4">
                {fields.length === 0 && (
                    <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                        No payment methods added yet
                    </div>
                )}

                {fields.map((field, index) => (
                    <Card key={field.id}>
                        <CardContent className="pt-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    <span className="font-medium">
                                        Payment Method {index + 1}
                                    </span>
                                </div>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => remove(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Input
                                    placeholder="Method Name"
                                    {...register(
                                        `payment_methods.${index}.name`
                                    )}
                                />

                                <Input
                                    placeholder="Method Number"
                                    {...register(
                                        `payment_methods.${index}.number`
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
}