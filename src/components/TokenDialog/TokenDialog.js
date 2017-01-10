import './TokenDialog.scss';
import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class TokenDialog extends React.Component {


    saveBtnHandler() {
        const {saveAccessToken, fetchUsers, getRepositories} = this.props;
        const token = this.refs.token.getValue();
        if (!token) { return;}
        
        localStorage.setItem('accessToken', token);
        saveAccessToken(token)
        fetchUsers();
        getRepositories();
    }

    render() {


       return (<div>

            <Dialog
                title="Access token is required in order to continue"
                actions={[<FlatButton label="Save" primary={true} onClick={this.saveBtnHandler.bind(this)} />]}
                modal={false}
                open={true}>
                <p> Please paste here your <a href="https://github.com/settings/tokens" target="_blank">personal access token</a> from Github.</p> 
                <p>This token will be saved in your local storage as long as you don't delete it. </p>
                <TextField type="password"
                            name="token"
                            ref="token"
                                placeholder={'Paste your access key'} />
                </Dialog>



      
          

       </div>)
    }
};

export default  TokenDialog;