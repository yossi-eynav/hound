import './OrgDialog.scss';
import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class OrgDialog extends React.Component {

    constructor() {
        super();
        this.saveOrg = this.saveOrg.bind(this);
    }

    saveOrg(org) {
        const { selectOrg,fetchUsers, getRepositories } = this.props;

        localStorage.setItem('selectedOrg', org);
        selectOrg(org);        
        fetchUsers();
        getRepositories();
    }

    render() {
        const { orgs } = this.props;

       return (<div>

            <Dialog
                title="Choose organization"
                modal={false}
                open={true}>
                   
                <SelectField
                    fullWidth={true}
                    floatingLabelText="Associated Organizations:"
                    onChange={(_,index,val) => {
                        this.saveOrg(val)
                    }}>
                        {orgs.map((org) => <MenuItem key={org.login} value={org.login} primaryText={org.login} /> )}             
                </SelectField>
               
                </Dialog>
       </div>)
    }
};

export default  OrgDialog;