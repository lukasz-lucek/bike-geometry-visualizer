import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GeometryStatesSerializer from './contexts/GeometryStatesSerilizer';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

//test of backend integration
const address = process.env.REACT_APP_SERVER_ADDRESS || '';
const endpoint = address +'/bikes';
console.log(`Endpoint for backend: ${endpoint}`)
const resp = await ( await fetch(endpoint)).json() as string[];
const mappedResp = resp.map((val, idx) => {return [`key ${idx}`, val]})
// const respLastObj = resp.length > 0 ? resp[resp.length-1] : undefined;
// if (respLastObj) {
  const geomStatSerializer = new GeometryStatesSerializer()
  console.log(resp);
  const deserialized = geomStatSerializer.deserialize(JSON.stringify(mappedResp));
  console.log(geomStatSerializer.serialize());
//}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);

//https://stackoverflow.com/questions/59632587/type-sharing-between-frontend-and-backend-without-bundling-the-orm
