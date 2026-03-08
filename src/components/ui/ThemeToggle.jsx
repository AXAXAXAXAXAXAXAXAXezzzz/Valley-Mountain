import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button type="button" className="inline-btn" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
      {theme === "light" ? "Night" : "Day"}
    </button>
  );
}
