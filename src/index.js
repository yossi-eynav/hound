import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(
  todoApp, 
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunkMiddleware)
  );

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)