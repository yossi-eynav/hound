import Immutable from 'immutable';
import * as actionTypes from '../actions/actionTypes';

const initialState = Immutable.Map()
                              .set('searchSuggestions', [])
                              .set('menuSelectedOption', 'search')
                              .set('accessToken', localStorage.getItem('accessToken'))
                              .set('users', [])
                              .set('involves', [])
                              .set('pullRequests', [])
                              .set('repositories', [])
                              .set('codeMatches', [])
                              .set('commits', [])
                              .set('fetching', false)
                              .set('filters', new Immutable.Map());


const reducers = (state = initialState , action) => {
  switch (action.type) {
    case actionTypes.ACCESS_KEY_ENTERED:
     return state.set('accessToken', action.accessToken);
      break;

    case actionTypes.MENU_SELECTED:
      return state.set('menuSelectedOption', action.option);
      break;

    case actionTypes.FETCHED_USERS:
      return state.set('users', action.users);
      break;

    case actionTypes.FETCHED_CODE_SEARCH:
      return state.set('codeMatches', action.codeMatches);
      break;

    case actionTypes.FETCHING_STARTED:
      return state.set('fetching', true);
      break;

    case actionTypes.FETCHING_ENDED:
      return state.set('fetching', false);
      break;
    case actionTypes.FETCHED_INVOLVES:
      return state.set('involves', action.involves);
      break;
    case actionTypes.FETCHED_PRs:
      return state.set('pullRequests', action.pullRequests);
      break;
    case actionTypes.FETCHED_REPOSITORIES:
      return state.set('repositories', action.repositories);
      break;
    case actionTypes.FETCHED_COMMITS:
      return state.set('commits', action.commits);
      break;
    case actionTypes.NEW_FILTER:
    return state.update('filters',(map) => map.set(action.filter, action.value));
    break;
    case actionTypes.CLEAR_FILTERS:
      return state.set('filters', new Immutable.Map());
      break;
   case actionTypes.FETCHED_PR_REVIEWS:
      return state.update('pullRequests', pullRequests => {
        const index  = pullRequests.findIndex((pr) => pr.number == action.pullRequestNumber &&  pr.head.repo.name === action.repositoryName) 
        const pr = pullRequests[index];
        pr.reviews.push(...action.reviews);
        pullRequests[index] = pr;
        return [...pullRequests];
      });
      break;

    default:
      return state
  }
};

export default reducers;