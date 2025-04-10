import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ThemeTabsLoading from "./theme-tabs-loading";

export default function ThemeTabs() {

    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <ThemeTabsLoading />
    }

    return (

        <Tabs defaultValue={theme} onValueChange={setTheme} className="w-full" >
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="light">
                    <Sun className="h-4 w-4" />
                    <span className="ml-2 [@container(max-width:380px)]:hidden flex items-center justify-center">
                        Light
                    </span>
                </TabsTrigger>
                <TabsTrigger value="dark">
                    <Moon className="h-4 w-4" />
                    <span className="ml-2 [@container(max-width:380px)]:hidden flex items-center justify-center">
                        Dark
                    </span>
                </TabsTrigger>
                <TabsTrigger value="system">
                    <Laptop className="h-4 w-4" />
                    <span className="ml-2 [@container(max-width:380px)]:hidden flex items-center justify-center">
                        System
                    </span>
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}