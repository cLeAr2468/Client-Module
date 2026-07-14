import Reroutes from "@/components/routes/page-routes";
import { Toaster } from "sonner";

function App() {
  
  return (
    <>
      <Reroutes/>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;