import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ShopProvider } from "./contexts/ShopContext";
import { LangProvider } from "./contexts/LangContext";
import Navbar from "./components/Navbar";
import ThemeShell from "./components/ThemeShell";
import GlobalCat from "./components/GlobalCat";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Stem from "./pages/Stem";
import Shop from "./pages/Shop";
import Math from "./pages/Math";
import ArithmeticLevels from "./pages/ArithmeticLevels";
import BinaryChapter from "./pages/BinaryChapter";
import HexChapter from "./pages/HexChapter";
import CompareChapter from "./pages/CompareChapter";
import MathLevel from "./pages/MathLevel";
import MathTopic from "./pages/MathTopic";
import MathLevelQuiz from "./pages/MathLevelQuiz";
import ArithmeticQuiz from "./pages/ArithmeticQuiz";
import MathSkillQuiz from "./pages/MathSkillQuiz";
import Technology from "./pages/Technology";
import Engineering from "./pages/Engineering";
import CircuitLab from "./pages/CircuitLab";
import BridgeLab from "./pages/BridgeLab";
import Science from "./pages/Science";
import StarchExperiment from "./pages/StarchExperiment";
import RainbowLightExperiment from "./pages/RainbowLightExperiment";
import CloudFormationExperiment from "./pages/CloudFormationExperiment";
import WaterCycle from "./pages/WaterCycle";
import WaterCycleExperiment from "./pages/WaterCycleExperiment";
import ScratchChapters from "./pages/ScratchChapters";
import ScratchChapter from "./pages/ScratchChapter";
import ScratchChapterQuiz from "./pages/ScratchChapterQuiz";
import Chapters from "./pages/Chapters";
import PythonChapter0 from "./pages/PythonChapter0";
import PythonChapter1 from "./pages/PythonChapter1";
import PythonChapterQuiz from "./pages/PythonChapterQuiz";
import PythonChapter2 from "./pages/PythonChapter2";
import PythonChapter3 from "./pages/PythonChapter3";
import PythonChapter4 from "./pages/PythonChapter4";
import PythonChapter5 from "./pages/PythonChapter5";
import PythonChapter6 from "./pages/PythonChapter6";
import PythonChapter7 from "./pages/PythonChapter7";
import PythonChapter8 from "./pages/PythonChapter8";
import PythonChapter9 from "./pages/PythonChapter9";
import PythonChapter10 from "./pages/PythonChapter10";
import PythonChapter11 from "./pages/PythonChapter11";
import PythonChapter11_1 from "./pages/PythonChapter11_1";
import PythonChapter11_2 from "./pages/PythonChapter11_2";
import PythonChapter11_3 from "./pages/PythonChapter11_3";
import PythonChapter11_4 from "./pages/PythonChapter11_4";
import PythonChapter12 from "./pages/PythonChapter12";
import PythonChapter12_1 from "./pages/PythonChapter12_1";
import PythonChapter12_2 from "./pages/PythonChapter12_2";
import PythonChapter12_3 from "./pages/PythonChapter12_3";
import PythonChapter12_4 from "./pages/PythonChapter12_4";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <LangProvider>
        <BrowserRouter>
          <ScrollToTop />
          <ThemeShell>
            <div className="relative min-h-screen">
              <Navbar />
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/stem" element={<Stem />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/math" element={<Math />} />
              <Route path="/math/levels" element={<ArithmeticLevels />} />
              <Route path="/math/binary" element={<BinaryChapter />} />
              <Route path="/math/hex" element={<HexChapter />} />
              <Route path="/math/compare" element={<CompareChapter />} />
              <Route path="/math/:topicId/quiz" element={<MathSkillQuiz />} />
              <Route path="/math/arithmetic" element={<ArithmeticQuiz />} />
              <Route path="/math/quiz/:levelId" element={<MathLevelQuiz />} />
              <Route
                path="/math/level/:levelId/topic/:topicId"
                element={<MathTopic />}
              />
              <Route path="/math/level/:levelId" element={<MathLevel />} />
              <Route path="/technology" element={<Technology />} />
              <Route path="/engineering" element={<Engineering />} />
              <Route path="/engineering/circuit" element={<CircuitLab />} />
              <Route path="/engineering/bridge" element={<BridgeLab />} />
              <Route path="/science" element={<Science />} />
              <Route path="/science/water-cycle" element={<WaterCycle />} />
              <Route
                path="/science/water-cycle/:stageId"
                element={<WaterCycleExperiment />}
              />
              <Route path="/science/cloud" element={<CloudFormationExperiment />} />
              <Route path="/science/starch" element={<StarchExperiment />} />
              <Route path="/science/rainbow" element={<RainbowLightExperiment />} />
              <Route path="/scratch/chapters" element={<ScratchChapters />} />
              <Route
                path="/scratch/chapter/:chapterId"
                element={<ScratchChapter />}
              />
              <Route
                path="/scratch/quiz/:chapterId"
                element={<ScratchChapterQuiz />}
              />
              <Route path="/python/chapters" element={<Chapters />} />
              <Route path="/python/chapter-0" element={<PythonChapter0 />} />
              <Route path="/python/chapter-1" element={<PythonChapter1 />} />
              <Route
                path="/python/quiz/:chapterId"
                element={<PythonChapterQuiz />}
              />
              <Route path="/python/chapter-2" element={<PythonChapter2 />} />
              <Route path="/python/chapter-3" element={<PythonChapter3 />} />
              <Route path="/python/chapter-4" element={<PythonChapter4 />} />
              <Route path="/python/chapter-5" element={<PythonChapter5 />} />
              <Route path="/python/chapter-6" element={<PythonChapter6 />} />
              <Route path="/python/chapter-7" element={<PythonChapter7 />} />
              <Route path="/python/chapter-8" element={<PythonChapter8 />} />
              <Route path="/python/chapter-9" element={<PythonChapter9 />} />
              <Route path="/python/chapter-10" element={<PythonChapter10 />} />
              <Route path="/python/chapter-11" element={<PythonChapter11 />} />
              <Route
                path="/python/chapter-9-1"
                element={<Navigate to="/python/chapter-11-1" replace />}
              />
              <Route
                path="/python/chapter-10-1"
                element={<Navigate to="/python/chapter-11-1" replace />}
              />
              <Route
                path="/python/chapter-10-2"
                element={<Navigate to="/python/chapter-11-2" replace />}
              />
              <Route
                path="/python/chapter-10-3"
                element={<Navigate to="/python/chapter-11-3" replace />}
              />
              <Route
                path="/python/chapter-10-4"
                element={<Navigate to="/python/chapter-11-4" replace />}
              />
              <Route path="/python/chapter-11-1" element={<PythonChapter11_1 />} />
              <Route path="/python/chapter-11-2" element={<PythonChapter11_2 />} />
              <Route path="/python/chapter-11-3" element={<PythonChapter11_3 />} />
              <Route path="/python/chapter-11-4" element={<PythonChapter11_4 />} />
              <Route path="/python/chapter-12" element={<PythonChapter12 />} />
              <Route path="/python/chapter-12-1" element={<PythonChapter12_1 />} />
              <Route path="/python/chapter-12-2" element={<PythonChapter12_2 />} />
              <Route path="/python/chapter-12-3" element={<PythonChapter12_3 />} />
              <Route path="/python/chapter-12-4" element={<PythonChapter12_4 />} />
            </Routes>
            <GlobalCat />
            </div>
          </ThemeShell>
        </BrowserRouter>
        </LangProvider>
      </ShopProvider>
    </AuthProvider>
  );
}
