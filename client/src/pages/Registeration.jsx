import Sidebar from "../components/sidebar";
import Form from "../components/Form";
function Registeration() {
  return (
    <div className="row">
      <div className="col-3">
        <Sidebar />
      </div>
      <div className="col-9">
        <Form />
      </div>
    </div>
  );
}

export default Registeration;
