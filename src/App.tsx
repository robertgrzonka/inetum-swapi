import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PeopleList from "./pages/PeopleList";
import PersonDetails from "./pages/PersonDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PeopleList />} />
        <Route path="/person/:id" element={<PersonDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
