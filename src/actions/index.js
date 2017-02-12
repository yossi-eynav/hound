import * as actionTypes from './actionTypes'
import moment from 'moment';

const getOrgs = () => {
  return (dispatch, getState) => {
      dispatch(startFetching());
      const token = getState().get('accessToken');
      if(!token) {return; }

    fetch(`https://api.github.com/user/orgs?access_token=${token}`)
    .then((response) => response.json())
        .then((orgs) => {
            dispatch(endFetching());
            dispatch({type: actionTypes.FETCHED_ORGS, orgs})
        });
  }
};


const selectOrg = (org) => {
    return {
        type: actionTypes.ORG_SELECTED,
        org
    }
}

const startFetching = () => {
    return {
        type: actionTypes.FETCHING_STARTED
    }
};

const endFetching = () => {
    return {
        type: actionTypes.FETCHING_ENDED
    }
};

const searchCode = (query) => {
  return (dispatch, getState) => {
    dispatch(startFetching());
    const state = getState();
    const token = state.get('accessToken');
    const org = state.get('selectedOrg');
    if (!token || !org ) { return; }

    return githubFetching(`https://api.github.com/search/code?q=${query}+org:${org}&access_token=${token}&per_page=100`,[],{
          'Accept': 'application/vnd.github.v3.text-match+json'
        })
        .then(response => {
         let items = response.map(item => item.items).reduce((a,b) => a.concat(b))
                                .sort((a,b) => {
                                    if (a.repository.name > b.repository.name) return 1;
                                    if (a.repository.name < b.repository.name) return -1;
                                    return 0;
                                    }
                                );
                    
            let entites = (items || []).filter(item => {
                return item.text_matches
            }).map((item) => {
                    const textMatch = Array.isArray(item.text_matches) ? item.text_matches.pop() : item.text_matches;
                    item.fragment = textMatch.fragment;
                    return item;
            });

            dispatch(endFetching());
            dispatch( { type: actionTypes.FETCHED_CODE_SEARCH, codeMatches: entites } );
        })
  }
};

function getNextPaginationLink(response) {
    const linkHeader = response.headers.get('Link');
    if(!linkHeader) {return null;}

    const matches = linkHeader.match(/<(.*)>; rel="next"/);
    return matches && matches[1]
}

function getRepositories() {
    const date = moment().add(-1, 'months').format('YYYY-MM-DD');
    return (dispatch, getState) => {
        const state = getState();
        const token = state.get('accessToken');
        const org = state.get('selectedOrg');
        if (!token || !org ) { return; }

        return githubFetching(`https://api.github.com/search/repositories?q=+org:${org}+pushed:>${date}&access_token=${token}&per_page=100`)
            .then(response => {
                let repositories = response.map((item) =>item.items)
                    .reduce((a,b) => a.concat(b));
                repositories = repositories.filter((repo) => repo.size != 0);
                dispatch({type: actionTypes.FETCHED_REPOSITORIES, repositories});
            })
    };
}




const getPullRequests = (pullRequestState = 'all') => {

    return (dispatch, getState) => {
        dispatch(startFetching());
        const state = getState();
        const token = state.get('accessToken');
        const org = state.get('selectedOrg');
        if (!token || !org ) { return; }

        let repositories = [];
            new Promise(() => {
                repositories = state.get('repositories');
                Promise.all(repositories.map((repository) => {

                    return fetch(`https://api.github.com/repos/${org}/${repository.name}/pulls?access_token=${token}&per_page=100&state=${pullRequestState}`)
                        .then((response) => response.json())
                }))
                .then((pullRequests) => {
                   pullRequests = pullRequests
                                    .reduce((a,b) => a.concat(b))
                                    .filter((item)=> moment().add(-10,'days').isBefore(item.updated_at))
                                    .sort((a,b) => {
                                        return moment(a.updated_at).isBefore(b.updated_at) ? 1 : -1
                                    })
                                    .map(pr => {
                                        pr.reviews = []
                                        return pr;    
                                    })
                                    

                        dispatch(endFetching());
                        dispatch({type: actionTypes.FETCHED_PRs, pullRequests});
                })
            })
    }
};

function githubFetching(url, previousRequestData = [], headers){
return fetch(url, {headers})
        .then((response) => {
        const nextURL = getNextPaginationLink(response);
        if (nextURL) {
            return response.json()
                .then(json => {
                    previousRequestData.push(json);
                    return githubFetching(nextURL, previousRequestData, headers);
                })
        } else {
            return response.json()
                .then(json => {
                    previousRequestData.push(json);
                    return previousRequestData;
                })
        }
    });
}

const clearFilters = () => {
    return {
        type: actionTypes.CLEAR_FILTERS
    }
};

const getCommits = (since = moment().add(-10,'days').format()) => {
    return (dispatch, getState) => {
        dispatch(startFetching());
        const state = getState();
        const token = state.get('accessToken');
        const org = state.get('selectedOrg');
        if (!token || !org ) { return; }

        let repositories = [];
        new Promise(() => {
            repositories = state.get('repositories');
            Promise.all(repositories.map((repository) => {
                return githubFetching(`https://api.github.com/repos/${org}/${repository.name}/commits?since=${since}&access_token=${token}&per_page=100`)
                    .then((response) => {
                        const commits = response.reduce((a,b) => a.concat(b));
                        return commits.map(commit => {
                            commit.repository = repository;
                            return commit;
                        })
                    })
            })).then((results) => {
                const commits = results
                    .reduce((a,b) => a.concat(b))
                    .sort((a,b) => {
                        return moment(a.commit.author.date).isBefore(b.commit.author.date) ? 1 : -1
                    });

                dispatch(endFetching());
                dispatch({type: actionTypes.FETCHED_COMMITS, commits});
            })

        })
    }
};

function setFilter(filter, value) {
  return {
    type: actionTypes.NEW_FILTER,
    filter,
    value
  }
}

const saveAccessToken = (accessToken) => {
  return {
    type: actionTypes.ACCESS_KEY_ENTERED,
    accessToken
  }
}

const setMenuOption = (option) => {
  return {
    type: actionTypes.MENU_SELECTED,
    option
  }
};

const fetchUsers = () => {
  return (dispatch, getState) => {
      dispatch(startFetching());
      const state = getState();
      const token = state.get('accessToken');
      const org = state.get('selectedOrg');
      if (!token || !org ) { return; }

    githubFetching(`https://api.github.com/orgs/${org}/members?per_page=100&access_token=${token}`)
    .then((response) => response.reduce((a,b) => a.concat(b)))
        .then((users) => {
            dispatch(endFetching());
            dispatch({type: actionTypes.FETCHED_USERS, users})
        });
  }
};

const getInvolvement = (userName) => {
  return (dispatch, getState) => {
      dispatch(startFetching());
      const state = getState();
      const token = state.get('accessToken');
      const org = state.get('selectedOrg');
      if (!token || !org ) { return; }

    return fetch(`https://api.github.com/search/issues?q=+org:${org}+involves:${userName}&access_token=${token}&per_page=100`)
        .then((response) => response.json())
        .then(json => {
            const involves =  json.items.map(involve => {
                involve.repositoryName = (involve.repository_url.match(/([a-zA-Z0-9_]*)$/gi) || [])[0];
                return involve;
            });
            dispatch(endFetching());
            dispatch({type:actionTypes.FETCHED_INVOLVES, involves});
          return json;
        })
  }
};

const fetchReviews = (repo, pullRequestNumber) => {
  return (dispatch, getState) => {
        const state = getState();
        const token = state.get('accessToken');
        const org = state.get('selectedOrg');
        if (!token || !org ) { return; }

        return fetch(`https://api.github.com/repos/${org}/${repo}/pulls/${pullRequestNumber}/reviews?access_token=${token}&per_page=100`,{
            headers: {
                'Accept': 'application/vnd.github.black-cat-preview+json'
            }
        })
        .then((response) => response.json())
        .then(reviews => {    
            setTimeout(()=> {
                const uniqueReviews = new Set();
                reviews.forEach((review) => {
                        (reviews || []).forEach((review) => {
                        uniqueReviews.add(`${review.user.login}~${review.state}~${review.user.avatar_url}`)
                    });
                });
                dispatch({type: actionTypes.FETCHED_PR_REVIEWS, reviews: Array.from(uniqueReviews) ,repositoryName: repo, pullRequestNumber});
            } ,0)
        })
  }
};

export {
    selectOrg,
    getOrgs,
    searchCode,
    getPullRequests,
    saveAccessToken,
    getInvolvement,
    fetchUsers,
    setMenuOption,
    getRepositories,
    getCommits,
    setFilter,
    clearFilters,
    fetchReviews
};