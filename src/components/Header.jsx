import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

function Header() {
  return (
    <header className="sticky top-0 z-50 flex w-full h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">User</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a className="dark:text-foreground">Logout</a>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
