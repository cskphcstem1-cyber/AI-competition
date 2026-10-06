import ConfettiCanvas from "../effects/ConfettiCanvas";
import FireworksCanvas from "../effects/FireworksCanvas";
import SakuraCanvas from "../effects/SakuraCanvas";

export default function ShopBackgroundFx({ effect }) {
  if (effect === "sakura") return <SakuraCanvas />;
  if (effect === "confetti") return <ConfettiCanvas />;
  if (effect === "fireworks") return <FireworksCanvas />;
  return null;
}
