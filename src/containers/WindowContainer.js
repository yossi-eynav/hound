import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../actions'
import Window from '../components/Window/Window'



const mapStateToProps = (state, ownProps) => {
  return {
    accessToken: state.get('accessToken'),
    searchSuggestions: state.get('searchSuggestions'),
    menuSelectedOption: state.get('menuSelectedOption'),
    users: state.get('users'),
    involves: state.get('involves'),
    codeMatches: state.get('codeMatches'),
    fetching: state.get('fetching'),
    pullRequests: state.get('pullRequests'),
    repositories: state.get('repositories'),
    commits: state.get('commits'),
    filters: state.get('filters')
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators(actionCreators, dispatch);
};

const WindowContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Window);

export default WindowContainer;