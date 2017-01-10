import React from 'react';
import './PullRequest.scss';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Filters from '../../Filters/Filters';
import moment from 'moment';



class PullRequest extends  React.Component {

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
       }  src={review[2]}  />
        })
    }

    getReviews() {

    }
    
    reviewerColor(status) {
        switch (status){
            case 'COMMENTED':
                return 'grey';
            case 'CHANGES_REQUESTED':
                return 'red';
            case 'APPROVED':
                return 'green';
        }
    }

    render() {
        const {filters ,clearFilters, users, repositories, setFilter} = this.props;
        let pullRequests = this.props.pullRequests;

        pullRequests = pullRequests.filter(pr => {
            return pr.head.repo.name.match(new RegExp(filters.get('repository'))) &&
                pr.user.login.match(new RegExp(filters.get('author'))) &&
                pr.state.match(new RegExp(filters.get('state'))) 
    });

        return (
            <div className="pull-requests">
                <h1> Pull Requests</h1>
                <Filters clearFilters={clearFilters} users={users} filters={filters} repositories={repositories} setFilter={setFilter} />
                <Table>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false} displayRowCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn className="num">Num</TableHeaderColumn>
                            <TableHeaderColumn className="author">Author</TableHeaderColumn>
                            <TableHeaderColumn className="title">Title</TableHeaderColumn>
                            <TableHeaderColumn className="repository">Repository</TableHeaderColumn>
                            <TableHeaderColumn>Branch Name</TableHeaderColumn>
                            <TableHeaderColumn className="status">Status</TableHeaderColumn>
                            <TableHeaderColumn className="approved">Approved</TableHeaderColumn>
                            <TableHeaderColumn className="reviewers">Reviewers</TableHeaderColumn>
                            <TableHeaderColumn className="actions">Actions</TableHeaderColumn>
                            <TableHeaderColumn>Updated At</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody preScanRows={false} displayRowCheckbox={false} showRowHover={true}>
                        {pullRequests.map((pr, index) => {
                            return (<TableRow  key={pr.id}>
                                <TableRowColumn className="num">{index + 1}</TableRowColumn>
                                <TableRowColumn className="author">
                                    <Avatar src={pr.user.avatar_url} />
                                    <small>{pr.user.login}</small>
                                </TableRowColumn>
                                <TableRowColumn className="title">
                                    <a  href={pr.html_url} target="_blank">{pr.title}</a>
                                </TableRowColumn>

                                <TableRowColumn>
                                    <a target="_blank" href={ pr.head.repo.html_url}>  { pr.head.repo.name}</a>
                                </TableRowColumn>

                                <TableRowColumn className="repository">
                                    { pr.head.ref}
                                </TableRowColumn>

                                <TableRowColumn className="status">
                                    { pr.state === 'open' ?
                                        <FontIcon className="material-icons" style={{color:'green'}}>lock_open</FontIcon> :
                                        <FontIcon className="material-icons" style={{color:'red'}}>lock_outline</FontIcon>
                                    }
                                </TableRowColumn>

                                <TableRowColumn className="approved">
                                    {pr.reviews && pr.reviews.filter(review => review.match('APPROVED')).length ?
                                        <FontIcon className="material-icons" style={{color:'green'}}>check_circle</FontIcon> :
                                        ''}
                                </TableRowColumn>

                                <TableRowColumn>
                                     {pr.reviews && this.getReviewers(pr.reviews)}
                                </TableRowColumn>


                                <TableRowColumn className="actions">
                                    <FlatButton label="Fetch Reviews" onClick={function(){
                                            this.props.fetchReviews(pr.head.repo.name, pr.number);
                                    }.bind(this)} />
                                </TableRowColumn>

                                <TableRowColumn className="updated-at">
                                    {moment(pr.updated_at).fromNow()}
                                </TableRowColumn>
                            </TableRow>)
                        })}
 
                    </TableBody>
                </Table>
            </div>
        )
    }

}

export default  PullRequest;