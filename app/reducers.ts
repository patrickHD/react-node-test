/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import history from 'utils/history';
import languageProviderReducer from 'containers/LanguageProvider/reducer';

function students(state = { loading: false, students: '' }, action) {
  switch (action.type) {
    case 'GET_STUDENTS_START':
      return {
        ...state,
        loading: true,
      };
    case 'GET_STUDENTS_SUCCESS':
      return {
        ...state,
        loading: false,
        students: action.payload,
      };
    default:
      return state;
  }
}

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    students: students,
    language: languageProviderReducer,
    router: connectRouter(history),
    ...injectedReducers,
  });

  return rootReducer;
}
