import { Separator } from "@radix-ui/react-separator";
import React from "react";

import { SidebarTrigger } from "./ui/sidebar";
import { ModeToggle } from "./toggle";

function Header() {
  return (
    <div>
      {" "}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <ModeToggle />
      </header>
    </div>
  );
}

export default Header;
