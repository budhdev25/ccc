import { useTheme } from "./hooks/useTheme";
import { useSession } from "./hooks/useSession";
import { GlobalStyles } from "./components/GlobalStyles";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Navigator } from "./components/Navigator/Navigator";
import { NewSessionScreen } from "./components/NewSession/NewSessionScreen";
import { ClinicalWorkspace } from "./components/Consult/ClinicalWorkspace";
import { AVEFab } from "./components/AVE/AVEFab";
import { Schedule } from "./components/Modules/Schedule";
import { CME } from "./components/Modules/CME";
import { Medsights } from "./components/Modules/Medsights";
import { PatientConcierge } from "./components/Modules/PatientConcierge";
import { ScribeOutput } from "./components/Modules/ScribeOutput";
import { RecentDocs } from "./components/Modules/RecentDocs";

function MainContent() {
  const { sessionMode, view } = useSession();
  if (sessionMode === "new") return <NewSessionScreen />;
  switch (view) {
    case "clinical": return <ClinicalWorkspace />;
    case "schedule": return <Schedule />;
    case "cme": return <CME />;
    case "medsights": return <Medsights />;
    case "concierge": return <PatientConcierge />;
    case "scribe": return <ScribeOutput />;
    case "docs": return <RecentDocs />;
    default: return <ClinicalWorkspace />;
  }
}

export default function App() {
  const { C } = useTheme();
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: C.bg, fontFamily: "'Outfit',sans-serif", overflow: "hidden" }}>
      <GlobalStyles />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <Header />
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <Navigator />
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            <MainContent />
          </div>
        </div>
        <Footer />
      </div>
      <AVEFab />
    </div>
  );
}
