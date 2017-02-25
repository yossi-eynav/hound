import React from 'react';
import './commits.scss';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Avatar from 'material-ui/Avatar';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';



class Commits extends  React.Component {

    getCommits() {
        let since = this.state.since,
            until = this.state.until;
            if (since) { since = since.toISOString() }
            if (until) { until = until.toISOString() }

        this.props.getCommits(since,until);
    }

    componentDidMount() {
        this.getCommits();
    }

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let { commits } = this.props;

        return (
            <div className="commits">
                <h1> Commits</h1>
                    <DatePicker hintText="Since:" container="inline" onChange={function(event, date) {
                            this.setState({since: date});
                    }.bind(this)}/>
                    <DatePicker hintText="Until:" container="inline" onChange={function(event, date) {
                            this.setState({until: date});
                    }.bind(this)}/>
                <button onClick={this.getCommits.bind(this)}>FETCH </button>
                <Table>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false} displayRowCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn className="num">Num</TableHeaderColumn>
                            <TableHeaderColumn>Title</TableHeaderColumn>
                            <TableHeaderColumn>Author</TableHeaderColumn>
                            <TableHeaderColumn>Repository</TableHeaderColumn>
                            <TableHeaderColumn>Relative Updated At</TableHeaderColumn>
                            <TableHeaderColumn>ISO Updated At</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} showRowHover={true}>
                        {commits.map((item, index) => {
                            let date = moment(item.commit.committer.date);
                    
        
                            return (<TableRow key={item.id}>
                                <TableRowColumn className="num">{index + 1}</TableRowColumn>
                                <TableRowColumn>
                                    <a href={item.html_url} target="_blank">{item.commit.message}</a>
                                    </TableRowColumn>
                                <TableRowColumn>
                                    <Avatar src={item.author && item.author.avatar_url} />
                                    <small>{item.author && item.author.login}</small>
                                </TableRowColumn>
                                <TableRowColumn>
                                    { item.repository.name }
                                </TableRowColumn>
                                <TableRowColumn className="updated-at">
                                    { date.fromNow() }
                                </TableRowColumn>
                                   <TableRowColumn className="updated-at">
                                    { date.format('YYYY-MM-DD, HH:MM:SS') }
                                </TableRowColumn>

                            </TableRow>)
                        })}

                    </TableBody>
                </Table>
            </div>
        )
    }

}

export default  Commits;