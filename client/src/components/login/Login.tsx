import React, {ChangeEvent, FormEvent, useState} from "react";
import { useAuthContext } from "../../contexts/AuthContext";

const Login = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const auth = useAuthContext();

  const handleSubmitEvent = (e : FormEvent) => {
    e.preventDefault();
    if (input.username !== "" && input.password !== "") {
      console.log('trying athentication');
      auth.loginAction(input);
      return;
    }
    alert("please provide a valid input!");
  };

  const handleInput = (e : ChangeEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmitEvent}>
      <div className="form_control">
        <label htmlFor="username">Nick:</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="your nick"
          onChange={handleInput}
        />
        {/* <div id="username" className="sr-only">
          Please enter a valid username. It must contain at least 6 characters.
        </div> */}
      </div>
      <div className="form_control">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          aria-describedby="user-password"
          aria-invalid="false"
          onChange={handleInput}
        />
        {/* <div id="user-password" className="sr-only">
          your password should be more than 6 character
        </div> */}
      </div>
      <button className="btn-submit">Submit</button>
    </form>
  );
};

export default Login;