
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAllCategoriesQuery } from "@/services/ProductsApi";
import { useCMS } from "../store";

export default function CategorySecationSidear() {
    const { data: Categories } = useGetAllCategoriesQuery(undefined);
    const { selectedSection, updateProp } = useCMS();


    return (
        <Card className="max-w-md mx-auto mt-10 shadow-xl rounded-2xl">
            <CardContent className="space-y-6 p-6">
                <h2 className="text-xl font-semibold">Category Section</h2>

                {/* Text Input */}
                <div className="space-y-2">
                    <Label htmlFor="name">Title</Label>
                    <Input
                        id="name"
                        placeholder="Enter your name"
                        onChange={(e) => updateProp(selectedSection?.id || '', "title", e.target.value)}
                        value={(selectedSection?.props as any).title}
                    />
                </div>

                {/* Number Input */}
                <div className="space-y-2">
                    <Label htmlFor="age">Number Of Products</Label>
                    <Input
                        id="age"
                        type="number"
                        placeholder="Enter The Limit"
                        value={(selectedSection?.props as any).limit}
                        onChange={(e) => updateProp(selectedSection?.id || '', "limit", e.target.value)}
                    />
                </div>

                {/* Select Box */}
                <div className="space-y-2 w-full">
                    <Label>Categories</Label>
                    <Select
                        onValueChange={(value) => updateProp(selectedSection?.id || '', "category", value)}
                        value={(selectedSection?.props as any).category}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                Categories?.map((categorie: any) => (
                                    <SelectItem value={categorie.translations[0].name}>{categorie.translations[0].name}</SelectItem>

                                ))
                            }

                        </SelectContent>
                    </Select>
                </div>

            </CardContent>
        </Card>
    );
}