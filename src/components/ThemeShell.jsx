import { useShop } from "../contexts/ShopContext";
import { getShopItem } from "../data/shopItems";
import ShopBackgroundFx from "./ShopBackgroundFx";

/** Applies the equipped shop background across the whole app. */
export default function ThemeShell({ children }) {
  const { equipped } = useShop();
  const bgItem = getShopItem(equipped.background) || getShopItem("bg-default");
  const isDark = Boolean(bgItem?.dark);
  const hideGrid = Boolean(bgItem?.hideGrid || isDark);

  return (
    <div
      className={`relative min-h-screen ${bgItem?.className || ""} ${
        isDark ? "theme-is-midnight" : ""
      }`}
    >
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
        style={
          bgItem?.style || {
            background: "var(--color-page, #f0f4f8)",
          }
        }
      />
      {bgItem?.effect ? <ShopBackgroundFx effect={bgItem.effect} /> : null}
      {bgItem?.scrim === "light" && (
        <div
          className="pointer-events-none fixed inset-0 z-[-9] bg-white/65"
          aria-hidden="true"
        />
      )}
      {bgItem?.scrim === "dark" && (
        <div
          className="pointer-events-none fixed inset-0 z-[-9] bg-slate-950/45"
          aria-hidden="true"
        />
      )}
      {!hideGrid && (
        <div
          className="pointer-events-none fixed inset-0 -z-10 blueprint-grid"
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}
