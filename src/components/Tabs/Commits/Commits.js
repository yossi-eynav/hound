import React from 'react';
import './commits.scss';
import Avatar from 'material-ui/Avatar';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import { Table, Column, Cell } from 'fixed-data-table';
import 'fixed-data-table/dist/fixed-data-table.css';


class Commits extends React.Component {

    getCommits() {
        let since = this.state.since,
            until = this.state.until;
        if (since) { since = since.toISOString() }
        if (until) { until = until.toISOString() }

        this.props.getCommits(since, until);
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
                <form>
                    <DatePicker className="input" hintText="Since:" container="inline" onChange={function (event, date) {
                        this.setState({ since: date });
                    }.bind(this)} />
                    <DatePicker className="input" hintText="Until:" container="inline" onChange={function (event, date) {
                        this.setState({ until: date });
                    }.bind(this)} />
                    <FlatButton className="input" onClick={this.getCommits.bind(this)} label="FETCH" />
                </form>
                <div className="container-commits">
                    <Table
                        rowHeight={50}
                        rowsCount={commits.count()}
                        width={1450}
                        height={1000}
                        headerHeight={50}>

                        <Column
                            header={<Cell>Num</Cell>}
                            width={50}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                    {rowIndex}
                                </Cell> )} />

                        <Column
                            header={<Cell>Message</Cell>}
                            width={600}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                    <a href={commits.getIn([rowIndex, 'html_url'])} target="_blank">{commits.getIn([rowIndex, 'commit', 'message'])}</a>
                                </Cell> )} />

                        <Column
                            header={<Cell>Author</Cell>}
                            width={200}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                    <Avatar src={commits.getIn([rowIndex, 'committer', 'avatar_url'])} />
                                    <small> {commits.getIn([rowIndex, 'committer', 'login'])}  </small>
                                </Cell> )} />


                        <Column
                            header={<Cell>Repository Name</Cell>}
                            width={200}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                    {commits.getIn([rowIndex, 'repository', 'name'])}
                                </Cell>)} />

                        <Column
                            header={<Cell>Updated At</Cell>}
                            width={200}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                    {moment(commits.getIn([rowIndex, 'commit', 'committer', 'date'])).fromNow()}
                                </Cell>
                            )} />

                        <Column
                            header={<Cell>Updated At</Cell>}
                            width={200}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                    {moment(commits.getIn([rowIndex, 'commit', 'committer', 'date'])).format('YYYY-MM-DD HH:MM:SS')}
                                </Cell>
                            )} />
                    </Table>
                </div>
            </div>
        )
    }

}

export default Commits;