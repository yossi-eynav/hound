import React from 'react';
import './PullRequest.scss';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import { Table, Column, Cell } from 'fixed-data-table';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Filters from '../../Filters/Filters';
import moment from 'moment';



class PullRequest extends React.Component {

    componentDidMount() {
        this.props.getPullRequests('all');
    }

    getReviewers(uniqueReviewers) {
        return uniqueReviewers.map(review => {
            review = review.split('~');
            return <Avatar key={review} style={{
                border: `3px solid ${this.reviewerColor(review[1])}`,
                marginRight: '5px'
            }
            } src={review[2]} />
        })
    }

    reviewerColor(status) {
        switch (status) {
            case 'COMMENTED':
                return 'grey';
            case 'CHANGES_REQUESTED':
                return 'red';
            case 'APPROVED':
                return 'green';
        }
    }



    render() {
        const {filters, clearFilters, users, repositories, setFilter} = this.props;
        let pullRequests = this.props.pullRequests;

        pullRequests = pullRequests.filter(pr => {
            return pr.getIn(['head', 'repo', 'name']).match(new RegExp(filters.get('repository'))) &&
                pr.getIn(['user', 'login']).match(new RegExp(filters.get('author'))) &&
                pr.get('state').match(new RegExp(filters.get('state')))
        });

        return (
            <div className="pull-requests">
                <h1> Pull Requests</h1>
                <Filters clearFilters={clearFilters} users={users} filters={filters} repositories={repositories} setFilter={setFilter} />
                <div className="table-container">
                    <Table
                        rowHeight={50}
                        rowsCount={pullRequests.count()}
                        width={window.innerWidth}
                        height={1000}
                        headerHeight={50} 
                        onRowMouseEnter={function (_,rowIndex) {
                                        if(pullRequests.getIn([rowIndex, 'number','reviews'])) { return; }

                                        this.props.fetchReviews(pullRequests.getIn([rowIndex, 'head', 'repo', 'name']), pullRequests.getIn([rowIndex, 'number']));
                                    }.bind(this)}>
                        <Column
                            header={<Cell>Num</Cell>}
                            width={80}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                    {rowIndex}
                                </Cell>)} />

                        <Column
                            header={<Cell>Author</Cell>}
                            flexGrow={2}
                            width={200}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                    <Avatar src={pullRequests.getIn([rowIndex, 'user', 'avatar_url'])} />
                                    <small> {pullRequests.getIn([rowIndex, 'user', 'login'])}  </small>
                                </Cell>)} />

                        <Column
                            header={<Cell>Title</Cell>}
                            flexGrow={4}
                            width={550}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                    <a href={pullRequests.getIn([rowIndex, 'html_url'])} target="_blank">{pullRequests.getIn([rowIndex, 'title'])}</a>
                                </Cell>)} />




                        <Column
                            header={<Cell>Repository Name</Cell>}
                            flexGrow={3}
                            width={200}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                    {pullRequests.getIn([rowIndex, 'head', 'repo', 'name'])}
                                </Cell>)} />

                        <Column
                            header={<Cell>Status</Cell>}
                            width={100}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                    {pullRequests.getIn([rowIndex, 'state']) === 'open' ?
                                        <FontIcon className="material-icons" style={{ color: 'green' }}>lock_open</FontIcon> :
                                        <FontIcon className="material-icons" style={{ color: 'red' }}>lock_outline</FontIcon>
                                    }
                                </Cell>
                            )} />

                        <Column
                            header={<Cell>Approved</Cell>}
                            width={100}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>

                                    {(pullRequests.getIn([rowIndex, 'reviews']) || []).filter(review => review.match('APPROVED')).length ?
                                        <FontIcon className="material-icons" style={{ color: 'green' }}>check_circle</FontIcon> :
                                        ''}
                                </Cell>
                            )} />


                        <Column
                            header={<Cell>Reviewers</Cell>}
                            width={200}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                    {this.getReviewers(pullRequests.getIn([rowIndex, 'reviews']) || [])}
                                </Cell>
                            )} />


                        <Column
                            header={<Cell>Updated At</Cell>}
                            width={200}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                    {moment(pullRequests.getIn([rowIndex, 'updated_at'])).fromNow()}
                                </Cell>
                            )} />

                    </Table>
                </div>
            </div>
        )
    }

}

export default PullRequest;