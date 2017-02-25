import React from 'react';
import './involves.scss';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import { Table, Column, Cell } from 'fixed-data-table';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';
import Filters from '../../Filters/Filters'





class Involves extends React.Component {

    constructor(props) {
        super(props);
        this.state = { filters: {} }

    }

    setFilter(key, value) {
        const filters = this.state.filters;
        filters[key] = value;
        this.setState({ filters });
    }

    render() {
        let {users, getInvolvement, clearFilters, involves, filters, repositories, setFilter} = this.props;

        involves = involves.filter(involve => {
            return involve.get('repositoryName').match(new RegExp(filters.get('repository'))) &&
                involve.getIn(['user','login']).match(new RegExp(filters.get('author'))) &&
                involve.get('state').match(new RegExp(filters.get('state')));
        });


        return (
            <div className="involves">
                <div>
                    <h1> Involves</h1>
                    <AutoComplete
                        className="search-users"
                        hintText="Search Fiverr's organization members"
                        ref="user_search"
                        fullWidth={true}
                        style={{ width: '500px' }}
                        dataSource={users.map(user => user.login)}
                        filter={(query, key) => key.match(new RegExp(query, 'gi'))}
                        maxSearchResults={10}
                        onNewRequest={(val) => getInvolvement(val)}
                    />
                </div>
                <Filters clearFilters={clearFilters} users={users} filters={filters} repositories={repositories} setFilter={setFilter} />

                <div className="table-container">
                    <Table
                        rowHeight={50}
                        rowsCount={involves.count()}
                        width={1750}
                        height={1000}
                        headerHeight={50}>

                        <Column
                            header={<Cell>Num</Cell>}
                            width={50}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                    {rowIndex}
                                </Cell>)} />

                        <Column
                            header={<Cell>Title</Cell>}
                            width={700}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                    <a href={involves.getIn([rowIndex, 'html_url'])} target="_blank">{involves.getIn([rowIndex, 'title'])}</a>
                                </Cell>)} />

                        <Column
                            header={<Cell>Author</Cell>}
                            width={200}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                    <Avatar src={involves.getIn([rowIndex, 'user', 'avatar_url'])} />
                                    <small> {involves.getIn([rowIndex, 'user', 'login'])}  </small>
                                </Cell>)} />


                        <Column
                            header={<Cell>Repository Name</Cell>}
                            width={200}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                    {involves.getIn([rowIndex, 'repositoryName'])}
                                </Cell>)} />

                        <Column
                            header={<Cell>Type</Cell>}
                            width={200}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                        {involves.getIn([rowIndex, 'pull_request']) ? 
                                                 <FontIcon className="material-icons">code</FontIcon> :
                                                <FontIcon className="material-icons">info</FontIcon>
                                         }
                                </Cell>
                            )} />

                        <Column
                            header={<Cell>Status</Cell>}
                            width={200}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                 {involves.getIn([rowIndex, 'state']) === 'open' ? 
                                                  <FontIcon className="material-icons" style={{ color: 'green' }}>lock_open</FontIcon> :
                                        <FontIcon className="material-icons" style={{ color: 'red' }}>lock_outline</FontIcon>
                                         }
                                </Cell>
                            )} />

                        <Column
                            header={<Cell>Updated At</Cell>}
                            width={200}
                            cell={({rowIndex, props}) => (
                                <Cell {...props}>
                                    {moment(involves.getIn([rowIndex, 'updated_at'])).fromNow()}
                                </Cell>
                            )} />
                    </Table>
                </div>
            </div>
        )
    }

}

export default Involves;