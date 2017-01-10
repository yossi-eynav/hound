import React from 'react'
import MainMenu from '../MainMenu/MainMenu'
import InvolveTab from '../Tabs/involves/Involves'
import SearchCode from '../Tabs/SearchCode/SearchCode'
import PullRequest from '../Tabs/PullRequest/PullRequest'
import Commits from '../Tabs/Commits/Commits'
import Snackbar from 'material-ui/Snackbar';
import TokenDialog from '../TokenDialog/TokenDialog'
import './Window.scss';




class Window extends React.Component {

    componentDidMount() {
        const {fetchUsers,getRepositories } = this.props;
        fetchUsers();
        getRepositories();
    }

    content() {

        const {
            menuSelectedOption, 
            fetchReviews,
            users,
            clearFilters,
            commits,
            getCommits,
            repositories,
            filters,
            fetchUsers,
            setFilter,
            searchCode,
            codeMatches,
            saveAccessToken,
            getInvolvement,
            involves,
            accessToken,
            getRepositories,
            getPullRequests, 
            pullRequests
            } = this.props;

        switch (menuSelectedOption) {
            case 'search':
                return <SearchCode searchCode={searchCode} codeMatches={codeMatches} />;
                break;
            case 'involves':
                return <InvolveTab filters={filters} clearFilters={clearFilters} repositories={repositories} setFilter={setFilter} users={users} fetchUsers={fetchUsers} getInvolvement={getInvolvement} involves={involves} />;
                break;

            case 'pull_requests':
                return <PullRequest fetchReviews={fetchReviews} filters={filters} clearFilters={clearFilters} repositories={repositories} setFilter={setFilter} users={users}    pullRequests={pullRequests} getPullRequests={getPullRequests} />;
                break;
            case 'commits':
                return <Commits commits={commits} getCommits={getCommits} />;
                break;
        }

    }

    render(){
        
        const {
            setMenuOption,
            title,
            fetchUsers,
            getRepositories,
            fetching, 
            saveAccessToken,
            accessToken,
            users,
            repositories
        } = this.props;

        return (
        <div className="window">
            <MainMenu setMenuOption={setMenuOption}  />
            <img className="hound" src="./hound.png" alt="hound" />
            <div>
                {this.content()}
            </div>
            <Snackbar open={fetching} message="Fetching Data From Server." />
                {!accessToken && <TokenDialog fetchUsers={fetchUsers}  getRepositories={getRepositories} saveAccessToken={saveAccessToken} />}
            </div>
        )

    }
}

export default Window;