import Sidebar from "../components/sidebar";
import Error from "../components/error";

function Errorpage() {
  return (
    <div className="row">
      <div className="col col-lg-2 f">
        <Sidebar />
      </div>
      <div className="col col-lg-10">
        <Error />
      </div>
    </div>
  );
}

export default Errorpage;
