import { useState, useEffect } from "react";
import "../../styles/authentication/signup.css";
import { Link } from "react-router-dom";
import { api } from "../../vars/JwtToken.js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
function Signup() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [passerror, setPasserror] = useState("");
  const [confirmPasserror, setConfirmPasserror] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("jwtAccessToken")) {
      navigate("/");
    }
  }, []);

  const handleFirstnameChange = (event) => {
    setFirstname("");
  };
  const handleLastnameChange = (event) => {
    setLastname("");
  };
  const handleEmailChange = (event) => {
    setEmail("");
  };
  const handlePasswordChange = (event) => {
    setPasserror("");
  };
  const handleConfirmPasswordChange = (event) => {
    setConfirmPasserror("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const firstname = e.target.elements.firstname.value;
    const lastname = e.target.elements.lastname.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const confirmpassword = e.target.elements.confirmpassword.value;

    const registerUser = async (firstname, lastname, email, password, confirmpassword) => {
      var data = {
        email: email,
        // first_name: firstname,
        // last_name: lastname,
        username: firstname + lastname,
        password: password,
      };

      console.log(data);

      if (password !== confirmpassword) {
        setConfirmPasserror("تکرار رمز عبور با رمز عبور یکسان نیست");
        return;
      }
      try {
        const response = await api.post("/auth/users/", data);
        console.log(response);
        if (response.status === 201) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: "success",
            title: "ثبت نام با موفقیت انجام شد",
          });
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
        if (error) {
          if (error.response.data.email) {
            if (
              error.response.data.email[0] ===
              "user with this email already exists."
            ) {
              setEmail("کاربر با این ایمیل قبلا ثبت نام کرده است");
            } else if (
              error.response.data.email[0] === "Enter a valid email address."
            ) {
              setEmail("یک ایمیل معتبر وارد نمایید");
            } else if (
              error.response.data.email[0] === "This field may not be blank."
            ) {
              setEmail("فیلد ایمیل الزامی است");
            }
          }
          if (error.response.data.password) {
            if (
              error.response.data.password[0] ===
              "The password is too similar to the username."
            ) {
              setPasserror("رمز عبور بسیار شبیه به نام یا نام خانوادگی می باشد");
            } else if (
              error.response.data.password[0] ===
              "The password is too similar to the email."
            ) {
              setPasserror("رمز عبور بسیار شبیه به ایمیل می باشد");
            } else if (
              error.response.data.password[0] ===
              "This password is too short. It must contain at least 8 characters."
            ) {
              setPasserror("رمز عبور باید بیشتر از 8 کاراکتر باشد");
            } else if (
              error.response.data.password[0] ===
              "This password is entirely numeric."
            ) {
              setPasserror(
                "رمز عبور باید حداقل یک کاراکتر غیر عددی داشته باشد"
              );
            } else if (
              error.response.data.password[0] === "This field may not be blank."
            ) {
              setPasserror("فیلد رمز عبور الزامی است");
            }
          }

          return;
        }
      }
    };

    registerUser(firstname, lastname, email, password, confirmpassword);
  };

  return (
    <div className="signup-container">
      <img
        className="signup-background-img"
        src={process.env.PUBLIC_URL + "/picturs/auth/signup/background.png"}
        alt=""
        style={{ position: "absolute", top: "0px" }}
      />
      <div className="signup-box py-3">
        <div
          className="text-white h1 text-end mx-4"
          style={{ fontSize: "50px", marginBottom: "10px" }}
        >
          ثبت نام
        </div>
        <form onSubmit={handleSubmit}>
          <div className="text-white h1 text-end mx-4 my-2 fw-bold">
            <div className="signup-div">
              <div className="d-flex">
                <div>
                  <div className="signup-error">{firstname}</div>
                  <div className="signup-lastname-div">
                    <input
                      name="lastname"
                      type="text"
                      className="form-control signup-input"
                      placeholder="نام خانوادگی"
                      onChange={handleLastnameChange}
                    />
                  </div>
                  <hr className="border-bottom-input-signup"></hr>
                </div>
                <div>
                  <div className="signup-firstname-div">
                    <input
                      name="firstname"
                      type="text"
                      className="form-control signup-input"
                      placeholder="نام"
                      onChange={handleFirstnameChange}
                    />
                  </div>
                  <hr className="border-bottom-input-signup"></hr>
                </div>
              </div>
              <div className="signup-error">{lastname}</div>
              <div className="signup-email-div">
                <input
                  name="email"
                  type="email"
                  className="form-control signup-input"
                  placeholder="آدرس ایمیل"
                  onChange={handleEmailChange}
                />
              </div>
              <hr className="border-bottom-input-signup"></hr>
              <div className="signup-error">{email}</div>
              <div className="signup-password-div" style={{ display: "flex" }}>
                <input
                  name="password"
                  type="password"
                  className="form-control signup-input"
                  placeholder="رمز عبور"
                  onChange={handlePasswordChange}
                />
              </div>
              <hr className="border-bottom-input-signup"></hr>
              <div className="signup-error">{passerror}</div>
              <div className="signup-password-div" style={{ display: "flex" }}>
                <input
                  name="confirmpassword"
                  type="password"
                  className="form-control signup-input"
                  placeholder="تکرار رمز عبور"
                  onChange={handleConfirmPasswordChange}
                />
              </div>
              <hr className="border-bottom-input-signup"></hr>
              <div className="signup-error">{confirmPasserror}</div>
              <div className="signup-button">
                <button className="btn btn-primary fw-bold mt-1">تایید</button>
              </div>
            </div>
          </div>
        </form>

        <div className="d-flex justify-content-evenly">
          <hr className="left-line-signup-by"></hr>
          <span className="text-white mt-1">ثبت نام با</span>
          <hr className="right-line-signup-by"></hr>
        </div>

        <div className="mx-4 google-linkedin-button mt-4">
          <a className="signin-linkedin-a" href={process.env.PUBLIC_URL}>
            <span className="">لینکدین</span>
            <img
              src={
                process.env.PUBLIC_URL +
                "/picturs/auth/signup/linkedin_logo.png"
              }
              alt=""
              className="signin-linkedin-img"
            />
          </a>
          <a className="signin-google-a" href={process.env.PUBLIC_URL}>
            <span className="">گوگل</span>
            <img
              src={
                process.env.PUBLIC_URL + "/picturs/auth/signup/google_logo.png"
              }
              alt=""
              className="signin-google-img"
            />
          </a>
        </div>

        <div className="signup-div text-center">
          <Link
            to="/login"
            className="btn btn-prim fw-bold py-2 register-button"
          >
            قبلا ثبت نام کرده ام
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
