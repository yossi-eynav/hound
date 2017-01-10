import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import React from 'react'

import './main-menu.scss';


const MainMenu = ({setMenuOption}) => {
return (

      <IconMenu
      iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
      anchorOrigin={{horizontal: 'left', vertical: 'top'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}
      onChange={((_, val) => {setMenuOption(val)})}
    >
          <MenuItem value="search" >Search Code</MenuItem>
          <MenuItem  value="involves">Involves</MenuItem>
          <MenuItem  value="pull_requests">Pull Requests</MenuItem>
          <MenuItem  value="commits">Commits Backlog</MenuItem>
    </IconMenu>
)
    
};

export default MainMenu;