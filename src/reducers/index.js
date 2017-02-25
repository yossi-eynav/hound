import Immutable from 'immutable';
import * as actionTypes from '../actions/actionTypes';
const accessToken = localStorage.getItem('accessToken');
const selectedOrg = localStorage.getItem('selectedOrg');

const initialState = Immutable.Map()
                              .set('searchSuggestions', [])
                              .set('menuSelectedOption', 'search')
                              .set('accessToken', selectedOrg && accessToken)
                              .set('selectedOrg', accessToken && selectedOrg)
                              .set('users', [])
                              .set('involves', new Immutable.List())
                              .set('pullRequests', new Immutable.List())
                              .set('repositories', [])
                              .set('codeMatches', [])
                              .set('commits',  new Immutable.List())
                              .set('orgs', [])
                              .set('fetching', false)
                              .set('filters', new Immutable.Map());


const reducers = (state = initialState , action) => {
  switch (action.type) {
    case actionTypes.ACCESS_KEY_ENTERED:
     return state.set('accessToken', action.accessToken);

    case actionTypes.MENU_SELECTED:
      return state.set('menuSelectedOption', action.option);

    case actionTypes.FETCHED_USERS:
      return state.set('users', action.users);

    case actionTypes.FETCHED_CODE_SEARCH:
      return state.set('codeMatches', action.codeMatches);

    case actionTypes.FETCHING_STARTED:
      return state.set('fetching', true);

    case actionTypes.FETCHING_ENDED:
      return state.set('fetching', false);

    case actionTypes.FETCHED_INVOLVES:
      return state.set('involves', Immutable.fromJS(action.involves));

    case actionTypes.FETCHED_PRs:
      return state.set('pullRequests', Immutable.fromJS(action.pullRequests));
      
    case actionTypes.FETCHED_REPOSITORIES:
      return state.set('repositories', action.repositories);
      
    case actionTypes.FETCHED_COMMITS:
      return state.set('commits', Immutable.fromJS(action.commits));
      
    case actionTypes.NEW_FILTER:
    return state.update('filters',(map) => map.set(action.filter, action.value));
    
    case actionTypes.CLEAR_FILTERS:
      return state.set('filters', new Immutable.Map());
      
   case actionTypes.FETCHED_PR_REVIEWS:
      return state.update('pullRequests', pullRequests => {
        const index  = pullRequests.findIndex((pr) => pr.get('number') == action.pullRequestNumber &&  pr.getIn(['head','repo','name']) === action.repositoryName) 
        return pullRequests.update(index, (pr) => {
          return pr.set('reviews',action.reviews)
        })
      });
      
    case actionTypes.FETCHED_ORGS: 
      return state.set('orgs', action.orgs)

    case actionTypes.ORG_SELECTED: 
      return state.set('selectedOrg', action.org)

    default:
      return state
  }
};

export default reducers;