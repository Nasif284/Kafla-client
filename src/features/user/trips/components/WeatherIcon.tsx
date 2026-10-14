import { Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain, CloudSnow, CloudLightning, CloudFog } from "lucide-react";

export function WeatherIcon({
  code = 0,
  isDay = true,
  className = "w-10 h-10 text-[#005440]",
  colored = false,
}: {
  code?: number;
  isDay?: boolean;
  className?: string;
  colored?: boolean;
}) {
  const getColorClass = () => {
    if (!colored) return "";
    if (!isDay) return "text-indigo-400";
    switch (code) {
      case 0:
        return "text-amber-500 fill-amber-400/20";
      case 1:
      case 2:
        return "text-amber-500";
      case 3:
      case 45:
      case 48:
        return "text-slate-500";
      case 51:
      case 53:
      case 55:
      case 61:
      case 63:
      case 65:
      case 80:
      case 81:
      case 82:
        return "text-sky-500";
      case 71:
      case 73:
      case 75:
        return "text-blue-400";
      case 95:
      case 96:
      case 99:
        return "text-purple-600";
      default:
        return "text-amber-500";
    }
  };

  const finalClass = colored
    ? `${className.replace(/text-\S+/g, "")} ${getColorClass()}`
    : className;

  switch (code) {
    case 0:
      return isDay ? <Sun className={finalClass} /> : <Moon className={finalClass} />;

    case 1:
    case 2:
      return isDay ? <CloudSun className={finalClass} /> : <CloudMoon className={finalClass} />;

    case 3:
      return <Cloud className={finalClass} />;

    case 45:
    case 48:
      return <CloudFog className={finalClass} />;

    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return <CloudRain className={finalClass} />;

    case 71:
    case 73:
    case 75:
      return <CloudSnow className={finalClass} />;

    case 95:
    case 96:
    case 99:
      return <CloudLightning className={finalClass} />;

    default:
      return isDay ? <CloudSun className={finalClass} /> : <CloudMoon className={finalClass} />;
  }
}
