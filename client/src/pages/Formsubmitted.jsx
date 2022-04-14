import Sidebar from "../components/sidebar";
import Submitted from "../components/form-submitted";

function Formsubmitted() {
  return (
    <div className="row">
      <div className="col col-lg-2 f">
        <Sidebar />
      </div>
      <div className="col col-lg-10">
        <Submitted />
      </div>
    </div>
  );
}

export default Formsubmitted;
