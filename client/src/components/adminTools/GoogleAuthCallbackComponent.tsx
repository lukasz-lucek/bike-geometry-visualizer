import axios from 'axios';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';


const GoogleAuthCallbackComponent = () => {
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();

  const switchTokens = () => {
    const address = process.env.REACT_APP_SERVER_ADDRESS || '';
    const endpoint = address +'/api/auth/google/callback';

    console.log(`params: ${searchParams}`)

    const token = localStorage.getItem('jwt');
    // const code = searchParams.get("code");
    // const scope = searchParams.get("scope");
    // if (!code || !scope) {
    //   console.error("broken response from google");
    //   return;
    // }
    axios.get(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: searchParams,
      // params: {
      //   code: decodeURIComponent(code),
      //   scope: decodeURIComponent(scope)
      // }
    }).then(function (resp) {
      console.log(resp);
      navigate("/app");
    }).catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div>
      <button onClick={switchTokens}>Yes - do switch the toekns</button>
    </div>
  );
};

export default GoogleAuthCallbackComponent;
