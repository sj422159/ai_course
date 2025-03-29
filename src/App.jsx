import { Routes, Route } from "react-router-dom";
import CoursesPage from "./CoursesPage";
import CourseDetails from "./CourseDetails";
import OnlineClass from "./OnlineClass";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CoursesPage />} />
      {/* <Route path="/course/:id" element={<CourseDetails />} /> */}
      <Route path="/online-class/:id/:chapterIndex" element={<OnlineClass />} />
      <Route path="/course/:courseTitle" element={<CourseDetails />} />
      <Route path="/online-course/:courseTitle/:chapterTitle" element={<OnlineClass />} />
    </Routes>
  );
}

export default App;
