import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Suspense } from "react";

import { Toaster } from "sonner";

export default function DashboardLayout({ children }) {
    return (
        (<Suspense fallback={<div>Loading...</div>}>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header
                        className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        {children}
                    </div>
                    <Toaster richColors />
                </SidebarInset>
            </SidebarProvider>
        </Suspense>)
    );
}
