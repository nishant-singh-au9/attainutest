import React, { useState } from "react";

function AddUser(props) {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Country, setCountry] = useState("");
  const [Dob, setDob] = useState("");
  const [success, setSuccess] = useState("");

  const renderCountries = () => {
    if (props.countries) {
      return props.countries.map((item) => {
        return (
          <>
            <option key={item.flag} value={item.name}>
              {item.name}
            </option>
          </>
        );
      });
    }
  };

  const dateFormatter = (date) => {
    let day = date.slice(-2);
    let month = date.slice(5, 7);
    let year = date.slice(0, 4);
    if (day > 3 && day < 21) {
      day += "th";
    } else {
      const mod = day % 10;
      if (mod === 1) {
        day += "st";
      } else if (mod === 2) {
        day += "nd";
      } else if (mod === 3) {
        day += "rd";
      } else {
        day += "th";
      }
    }

    month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][month - 1];
    return `${day} ${month} ${year}`;
  };

  const submitHandler = () => {
    const data = {
      Name,
      Country,
      Dob: dateFormatter(Dob),
      Email,
      id: parseInt(props.datalength) + 1,
    };
    console.log(data);
    fetch("http://localhost:3600/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setName("");
        setEmail("");
        setCountry("");
        setDob("");
        setSuccess("Data added successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="adduser">
      <h1 className="text-center">Add User</h1>
      <p style={{ color: "green" }}>{success}</p>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          aria-describedby="emailHelp"
          value={Name}
          onChange={(e) => {
            setName(e.target.value);
            setSuccess("");
          }}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="text"
          className="form-control"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Country</label>
        <select
          className="form-control"
          value={Country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="" disabled>
            select country
          </option>
          {renderCountries()}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Date of Birth</label>
        <input
          type="date"
          className="form-control"
          value={Dob}
          onChange={(e) => setDob(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary" onClick={submitHandler}>
        Submit
      </button>
    </div>
  );
}

export default AddUser;
