import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function useColorTheme() {
  const { theme, systemTheme } = useTheme();
  const [myTheme, setMyTheme] = useState<string>(theme || "light");

  useEffect(() => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    setMyTheme(currentTheme || "light");
  }, [theme, systemTheme]);

  return myTheme;
}

export default useColorTheme;
