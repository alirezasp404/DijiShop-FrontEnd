import { useState, useEffect } from "react";
import "../../styles/authentication/login.css";
import { Link } from "react-router-dom";
import { api } from "../../vars/JwtToken.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("jwtAccessToken")) {
      navigate("/");
    }
  }, []);

  const handleUsernameChange = (event) => {
    setUsername("");
  };

  const handlePasswordChange = (event) => {
    setPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;

    const registerUser = async (username, password) => {
      const data = {
        username: username,
        password: password,
      };

      try {
        const response = await api.post("/auth/jwt/create/", data, {
          headers: { "Content-Type": "application/json" },
        });
        const token = response.data.access;
        localStorage.setItem("jwtAccessToken", token);
        if (response.status === 200) {
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
            title: "ورود با موفقیت انجام شد",
          });
          navigate("/");
          const responseJobFinder = await api.post("/api/profiles/", {}, {
            headers: { "Content-Type": "application/json", Authorization: 'JWT ' + token },
          });
          try{
            console.log("try");
            navigate("/");
          }catch(error){
            console.log("error");
            navigate("/");
          }
        }
      } catch (error) {
        if (error) {
          console.log(error);
          if (error) {
            if (error.response.data.username) {
              if (
                error.response.data.username[0] === "This field may not be blank."
              ) {
                setUsername("فیلد ایمیل الزامی است");
              }
            }
            if (error.response.data.password) {
              if (
                error.response.data.password[0] ===
                "This field may not be blank."
              ) {
                setPassword("فیلد رمز عبور الزامی است");
              }
            }
            if (error.response.data.detail) {
              if (
                error.response.data.detail ===
                "No active account found with the given credentials"
              ) {
                setPassword("ایمیل یا رمز عبور نادرست است");
              }
            }
            return;
          }
        }
      }
    };

    registerUser(username, password);
  };

  return (
    <div className="login-container">
      <img
        className="login-background-img"
        src={process.env.PUBLIC_URL + "/picturs/auth/login/background.png"}
        alt=""
        style={{ position: "absolute", top: "0px" }}
      />
      <div className="login-box py-3">
        <div
          className="text-white h1 text-end mx-4 mt-1"
          style={{ fontSize: "50px", marginBottom: "30px" }}
        >
          ورود
        </div>
        <form onSubmit={handleSubmit}>
          <div className="text-white h1 text-end mx-4 my-2 fw-bold">
            <div className="login-div">
              <div className="login-email-div">
                <input
                  name="username"
                  type="text"
                  className="form-control login-input"
                  id="floatingInput"
                  placeholder="نام کاربری"
                  onChange={handleUsernameChange}
                />
              </div>
              <hr className="border-bottom-input-login"></hr>
              <div className="login-error">{username}</div>
              <div className="login-password-div" style={{ display: "flex" }}>
                <input
                  name="password"
                  type="password"
                  className="form-control login-input"
                  id="floatingPassword"
                  placeholder="رمز عبور"
                  onChange={handlePasswordChange}
                />
              </div>
              <hr className="border-bottom-input-login"></hr>

              <div className="login-error">{password}</div>

              <div className="login-button">
                <a
                  href={process.env.PUBLIC_URL}
                  className="btn btn-primary fw-bold forget-password-button"
                >
                  بازیابی رمز عبور
                </a>
                <button className="btn btn-primary fw-bold">ورود</button>
              </div>
            </div>
          </div>
        </form>

        <div className="d-flex justify-content-evenly">
          <hr className="left-line-login-by"></hr>
          <span className="text-white mt-1">ورود با</span>
          <hr className="right-line-login-by"></hr>
        </div>

        <div className="mx-4 google-linkedin-button mt-4">
          <a className="signin-linkedin-a" href={process.env.PUBLIC_URL}>
            <span className="">لینکدین</span>
            <img
              src={
                process.env.PUBLIC_URL + "/picturs/auth/login/linkedin_logo.png"
              }
              alt=""
              className="signin-linkedin-img"
            />
          </a>
          <a className="signin-google-a" href={process.env.PUBLIC_URL}>
            <span className="">گوگل</span>
            <img
              src={
                process.env.PUBLIC_URL + "/picturs/auth/login/google_logo.png"
              }
              alt=""
              className="signin-google-img"
            />
          </a>
        </div>

        <div className="register-div justify-content-end align-items-baseline mx-4">
          <Link
            to="/signup"
            className="btn btn-prim fw-bold py-2 register-button m-0"
          >
            ثبت نام کنید
          </Link>
          <p className="fw-bold justify-content-space-between">
            آیا ثبت نام نکرده‌اید؟!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
