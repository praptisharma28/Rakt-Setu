import React, { useState } from "react";
import InputType from "./InputType";
import { Link } from "react-router-dom";
import { handleLogin, handleRegister } from "../../../services/authService";

const Form = ({ formType, submitBtn, formTitle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donar");
  const [name, setName] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div>
      <form
        style={{ width: "100%", maxWidth: "420px" }}
        onSubmit={(e) => {
          if (formType === "login")
            return handleLogin(e, email, password, role);
          else if (formType === "register")
            return handleRegister(
              e,
              name,
              role,
              email,
              password,
              organisationName,
              hospitalName,
              website,
              address,
              phone
            );
        }}
      >
        <h2 className="fw-normal mb-2 pb-2" style={{ letterSpacing: 1 }}>
          {formTitle}
        </h2>
        <hr size="1" />
        <div className="d-flex flex-wrap mb-3 gap-2">
          {[
            { value: 'donar', label: 'Donor', id: 'donarRadio', defaultChecked: true },
            { value: 'admin', label: 'Admin', id: 'adminRadio' },
            { value: 'hospital', label: 'Hospital', id: 'hospitalRadio' },
            { value: 'organisation', label: 'Organisation', id: 'organisationRadio' },
          ].map(opt => (
            <div key={opt.value} className="form-check" style={{
              background: role === opt.value ? '#c0392b' : '#f1f3f5',
              color: role === opt.value ? 'white' : '#333',
              borderRadius: 20,
              padding: '5px 14px',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}>
              <input
                type="radio"
                className="form-check-input"
                name="role"
                id={opt.id}
                value={opt.value}
                onChange={(e) => setRole(e.target.value)}
                defaultChecked={opt.defaultChecked}
                style={{ display: 'none' }}
              />
              <label htmlFor={opt.id} className="form-check-label mb-0"
                style={{ cursor: 'pointer', fontWeight: 500, fontSize: 14 }}>
                {opt.label}
              </label>
            </div>
          ))}
        </div>

        {(() => {
          switch (formType) {
            case "login":
              return (
                <>
                  <InputType
                    labelText={"Email"}
                    lableForm={"forEmail"}
                    inputType={"email"}
                    name={"email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputType
                    labelText={"Password"}
                    lableForm={"forPassword"}
                    inputType={"password"}
                    name={"password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </>
              );
            case "register":
              return (
                <>
                  {(role === "donar" || role === "admin") && (
                    <InputType
                      labelText={"Name"}
                      lableForm={"forName"}
                      inputType={"text"}
                      name={"name"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  )}
                  {role === "hospital" && (
                    <InputType
                      labelText={"Hospital Name"}
                      lableForm={"forHospitalName"}
                      inputType={"text"}
                      name={"hospitalName"}
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                    />
                  )}
                  {role === "organisation" && (
                    <InputType
                      labelText={"Organisation Name"}
                      lableForm={"forOrganisationName"}
                      inputType={"text"}
                      name={"organisationName"}
                      value={organisationName}
                      onChange={(e) => setOrganisationName(e.target.value)}
                    />
                  )}
                  <InputType
                    labelText={"Email"}
                    lableForm={"forEmail"}
                    inputType={"email"}
                    name={"email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputType
                    labelText={"Password"}
                    lableForm={"forPassword"}
                    inputType={"password"}
                    name={"password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputType
                    labelText={"Website"}
                    lableForm={"forWebsite"}
                    inputType={"text"}
                    name={"website"}
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                  <InputType
                    labelText={"Address"}
                    lableForm={"forAddress"}
                    inputType={"text"}
                    name={"address"}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <InputType
                    labelText={"Phone No."}
                    lableForm={"forPhone"}
                    inputType={"text"}
                    name={"phone"}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </>
              );
          }
        })()}

        <div className="pt-1 mb-4 d-flex align-items-center gap-4">
          <button className="btn btn-lg" type="submit"
            style={{ background: '#c0392b', color: 'white', minWidth: 100, fontWeight: 600 }}>
            {submitBtn}
          </button>
          {formType === "login" ? (
            <p className="mt-2">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          ) : (
            <p className="mt-2">
              Already Have an account? <Link to="/login">Login</Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Form;
