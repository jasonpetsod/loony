import firebase from 'firebase';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <App />,
  document.getElementById('root'));
