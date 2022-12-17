import "./App.scss";
import Bookcard from "./Components/bookcard";
import Sidebar from "./Components/Sidebar";
import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <div className="grid grid-cols-2">
        <div className="col-span-1">
          <Sidebar />
        </div>
        <div className="col-span-1">
          
        </div>
      </div>

    </>
  );
}

export default App;
