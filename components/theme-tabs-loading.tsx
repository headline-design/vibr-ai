import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Moon, Laptop } from "lucide-react";

export default function ThemeTabsLoading() {

    return (

        <Tabs className="w-full" >
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="light" disabled>
                    <Sun className="h-4 w-4" />
                    <span className="ml-2 [@container(max-width:380px)]:hidden flex items-center justify-center">
                        Light
                    </span>
                </TabsTrigger>
                <TabsTrigger value="dark" disabled>
                    <Moon className="h-4 w-4" />
                    <span className="ml-2 [@container(max-width:380px)]:hidden flex items-center justify-center">
                        Dark
                    </span>
                </TabsTrigger>
                <TabsTrigger value="system" disabled>
                    <Laptop className="h-4 w-4" />
                    <span className="ml-2 [@container(max-width:380px)]:hidden flex items-center justify-center">
                        System
                    </span>
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}