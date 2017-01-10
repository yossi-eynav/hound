import React from 'react'
import './Filters.scss';
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton';
import {Card, CardHeader, CardText} from 'material-ui/Card';

const Filters = ({users, repositories, setFilter, filters, clearFilters}) => {

    return (
        <div>
            <Card style={{marginBottom: '50px', marginTop: '50px'}}>
                <CardHeader
                    title="Filter the results"
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardText expandable={true}>
                    <div className="filters" style={{height: '100px'}}>
                        <SelectField className="filter"
                                     floatingLabelFixed={true}
                                     floatingLabelText="Author:"
                                     value={filters.get('author')}
                                     onChange={(event,index, value) => {
                                         setFilter('author', value)
                                     }}
                        >
                            <MenuItem value=".*" primaryText="All" />
                            {users.map(user =>  <MenuItem key={user.id} value={user.login} primaryText={user.login} /> )}
                        </SelectField>

                        <SelectField className="filter"
                                     floatingLabelFixed={true}
                                     floatingLabelText="Repository:"
                                     value={filters.get('repository')}
                                     onChange={(event,index, value) => {
                                         setFilter('repository', value)
                                     }}
                        >
                            <MenuItem value=".*" primaryText="All" />
                            {repositories.map(repo =>  <MenuItem key={repo.id} value={repo.name} primaryText={repo.name} /> )}
                        </SelectField>


                        <SelectField className="filter"
                                     floatingLabelText="State:"
                                     floatingLabelFixed={true}

                                     value={filters.get('state')}
                                     onChange={(event,index, value) => {
                                         setFilter('state', value)
                                     }}
                        >
                            <MenuItem key="1" value=".*" primaryText="All" />
                            <MenuItem key="2" value="open" primaryText="Open" />
                            <MenuItem key="3" value="closed" primaryText="Closed" />
                        </SelectField>

                        <SelectField className="filter"
                                     floatingLabelText="Approved:"
                                     floatingLabelFixed={true}

                                     value={filters.get('approved')}
                                     onChange={(event,index, value) => {
                                         setFilter('approved', value)
                                     }}
                        >
                            <MenuItem key="1" value=".*" primaryText="All" />
                            <MenuItem key="2" value="APPROVED" primaryText="Yes" />
                            <MenuItem key="3" value="CHANGES_REQUESTED" primaryText="No" />
                        </SelectField>

                        <FlatButton className="filter" label="clear filters" onClick={clearFilters}/>
                    </div>
                </CardText>
            </Card>
        </div>
    )
}

export default Filters;