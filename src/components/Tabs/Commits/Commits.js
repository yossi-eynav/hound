import React from 'react';
import './commits.scss';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Avatar from 'material-ui/Avatar';
import moment from 'moment';



class Commits extends  React.Component {

    componentDidMount() {
        this.props.getCommits();
    }

    constructor(props) {
        super(props);
    }

    render() {
        let { commits } = this.props;


        return (
            <div className="commits">
                <h1> Commits</h1>
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
                            let date = moment(item.commit.author.date);
                    
        
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