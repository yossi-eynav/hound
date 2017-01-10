import React from 'react'
import WindowContainer from '../containers/WindowContainer'
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

injectTapEventPlugin();

const App = () => (
    <MuiThemeProvider>
        <WindowContainer />
    </MuiThemeProvider>
)

export default App