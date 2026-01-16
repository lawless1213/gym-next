"use client";

import { useState } from "react";
import { DefaultAside } from "./modes/default";
import { LanguageAside } from "./modes/language";

export function Sidebar() {
  const [languageMode, setLanguageMode] = useState(false);

  const asideModeHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    setLanguageMode(!languageMode);
  };

  return (
    <aside className=" flex flex-col justify-between border-r-2 border-panel p-4 sticky left-0 top-0 h-screen">
      {
        languageMode ?
        <LanguageAside modeSwitcher={asideModeHandler}/> :
        <DefaultAside modeSwitcher={asideModeHandler}/>
      }
    </aside>
  );
}
