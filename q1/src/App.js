import React, { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./NavBar";
import AddUser from "./AddUser";

function App() {
  const [countries, setCountries] = useState([]);
  const [usersdata, setusersdata] = useState("");
  const [page, setPage] = useState(1);
  const [paginatedata, setPaginatedata] = useState([]);
  const [name, setname] = useState("");
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Country, setCountry] = useState("");
  const [Dob, setDob] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    fetch("https://restcountries.eu/rest/v2/all", { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        setCountries(data);
      });

    fetch("http://localhost:3600/users", { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        setusersdata(data);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3600/users?_page=${page}&_limit=4`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setPaginatedata(data);
      });
  }, [page]);
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

  const dateFormatter1 = (date) => {
    let month = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    };
    const monthformatter = () => {
      if (month[date.slice(5, 8)] < 10) {
        return `0${month[date.slice(5, 8)]}`;
      } else {
        return `${month[date.slice(5, 8)]}`;
      }
    };
    const dateformatter = () => {
      if (date.slice(0, 2) < 10) {
        return `0${date.slice(0, 2)}`;
      } else {
        return `${date.slice(0, 2)}`;
      }
    };
    const newdate = `${date.slice(-4)}-${monthformatter()}-${dateformatter()}`;
    console.log(newdate);
    return newdate;
  };

  const editHandler = (id) => {
    fetch(`http://localhost:3600/users?id=${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data[0]);
        setName(data[0].Name);
        setCountry(data[0].Country);
        setEmail(data[0].Email);
        setDob(dateFormatter1(data[0].Dob));
        setId(data[0].id);
      });
  };

  const renderUsers = () => {
    console.log(paginatedata);
    if (paginatedata) {
      return paginatedata.map((item) => {
        return (
          <div className="col-md-3">
            <div class="card">
              <img
                src="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/104113705/original/6076831db34315e45bd2a31a9d79bb7b91d48e04/design-flat-style-minimalist-avatar-of-you.jpg"
                class="card-img-top"
                alt="profile__avatr"
              />
              <div class="card-body">
                <h5 class="card-title">{item.Name}</h5>
                <p class="card-text">Email: {item.Email}</p>
                <p class="card-text">Dob: {item.Dob}</p>
                <p class="card-text">Country: {item.Country}</p>
                <button
                  class="btn btn-success"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={editHandler.bind(this, item.id)}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        );
      });
    }
  };

  const serchHandler = () => {
    setPage(1);
    fetch(`http://localhost:3600/users?_page=${page}&_limit=4&Name=${name}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setPaginatedata(data);
      });
  };

  const renderCountries = () => {
    if (countries) {
      return countries.map((item) => {
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

  const SaveHandler = (id) => {
    const data = {
      Name,
      Country,
      Dob: dateFormatter(Dob),
      Email,
      id,
    };
    console.log(data);
    fetch(`http://localhost:3600/users/${id}`, {
      method: "Put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };
  return (
    <>
      <NavBar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AddUser datalength={usersdata.length + 1} countries={countries} />
          </div>
          <div className="col-md-9 users__feild">
            <div className="users__heading">
              <h1>Users</h1>
              <div>
                <input
                  type="text"
                  placeholder="enter name to search"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                />
                <button className="btn btn-primary" onClick={serchHandler}>
                  Search
                </button>
              </div>
            </div>
            <div className="row">{renderUsers()}</div>
            <div className="row">
              <nav aria-label="Page navigation example">
                <ul class="pagination">
                  <li class="page-item">
                    <button class="page-link" onClick={() => setPage(page - 1)}>
                      Previous
                    </button>
                  </li>
                  <li class="page-item">
                    <button class="page-link" onClick={() => setPage(page + 1)}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Edit User
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="emailHelp"
                  value={Name}
                  onChange={(e) => {
                    setName(e.target.value);
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
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={SaveHandler()}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
