import React from 'react';
import './SearchCode.scss'
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import Highlight from 'react-highlight';

class SearchCode extends React.Component{

    componentDidUpdate() {
        this.refs.code_search.focus();
    }

    render(){


 let timeout;
 const {codeMatches, searchCode} = this.props;
 const repositories = Array.from(new Set(codeMatches.map(match => match.repository.name)))
 let lastRepo = null;

return (
        <div className="search-code">
            <h1> Search Code</h1>
            <TextField
                key="code_search"
                name="code_search"
                ref="code_search"
                fullWidth={true}
                onKeyDown={(event)=> {
                    if(event.keyCode !== 13 ){ return; }
                    searchCode(event.target.value);
                }}
            />

            <div>
            <p> Matches Count: {codeMatches.length} </p>
            <div className="chips">
            {repositories.map(repo =>   <Chip className="chip"> <a href={`#${repo}`}>{repo}</a></Chip>
)}
</div>
            </div>

            {codeMatches.map((match) => {
                let fileType =match.name.match(/\.(html|css|scss|js|jsx|rb|yaml|py|ts|go)/i);
                fileType = (fileType && fileType[1]) || ''
                const cardID = lastRepo != match.repository.name ? match.repository.name : null;
                lastRepo = match.repository.name;


                return (
                <Card id={cardID} key={match.sha + match.score} style={{marginBottom: '60px'}}>
                    <CardTitle  title={ match.repository.name}  subtitle={match.name}  />
                    <CardText>
                        <Highlight className={fileType}>
                            {match.fragment} 
                        </Highlight>
                    </CardText>
                    <CardActions>
                        <RaisedButton label="Go to the repository!" target="_blank" href={match.repository.html_url}  primary={true}  />
                        <RaisedButton label="Go to the file!"  target="_blank" href={match.html_url}  primary={true}  />
                    </CardActions>
                </Card>
                )
            
        })}
        </div>
    )
}
};

export default  SearchCode;