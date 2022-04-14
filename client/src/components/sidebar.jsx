/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import SidebarContext from "../sidebarcontext";

export default function Sidebar(){
  let navigate =useNavigate();
  const {isActive,changeState} =useContext(SidebarContext)
    return (
      <div
        className="d-flex flex-column flex-shrink-0 p-3 bg-light"
        style={{ height: 550 }}
      >
        <a
          href="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
        >
          <i className="bi bi-fingerprint display-4 me-3 "></i>
          <span className="display-5">
            <strong>Identrix</strong>
          </span>
        </a>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
                changeState({
                  home: "nav-link active",
                  registeration: "nav-link link-dark",
                  mykeys: "nav-link link-dark",
                  digitalcertificate: "nav-link link-dark",
                });
              }}
              style={{ cursor: "pointer" }}
              className={isActive.home}
              aria-current="page"
              name="home"
            >
              <i className="bi bi-house-door me-2"></i>
              Home
            </a>
          </li>
          <li>
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/registeration");
                changeState({
                  home: "nav-link link-dark",
                  registeration: "nav-link active",
                  mykeys: "nav-link link-dark",
                  digitalcertificate: "nav-link link-dark",
                });
              }}
              style={{ cursor: "pointer" }}
              className={isActive.registeration}
              name="registeration"
            >
              <i className="bi bi-file-person me-2"></i>
              Registeration
            </a>
          </li>

          <li>
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/mykeys");
                changeState({
                  home: "nav-link link-dark",
                  registeration: "nav-link link-dark",
                  mykeys: "nav-link active",
                  digitalcertificate: "nav-link link-dark",
                });
              }}
              style={{ cursor: "pointer" }}
              className={isActive.mykeys}
              name="mykeys"
            >
              <i className="bi bi-key me-2"></i>
              My Keys
            </a>
          </li>
          <li>
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/mydigitalcertificate");
                changeState({
                  home: "nav-link link-dark",
                  registeration: "nav-link link-dark",
                  mykeys: "nav-link link-dark",
                  digitalcertificate: "nav-link active",
                });
              }}
              style={{ cursor: "pointer" }}
              className={isActive.digitalcertificate}
              name="digitalcertificate"
            >
              <i className="bi bi-award me-2"></i>
              Get My Digital Certificate
            </a>
          </li>
          <li>
            <a href="/database" className="nav-link link-dark">
              <i className="bi bi-file-spreadsheet me-2"></i>
              Database (Admin only)
            </a>
          </li>
        </ul>
        <hr />
      </div>
    );
}