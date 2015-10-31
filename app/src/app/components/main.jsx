/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const RaisedButton = require('material-ui/lib/raised-button');
const Dialog = require('material-ui/lib/dialog');
const ThemeManager = require('material-ui/lib/styles/theme-manager');
const LightRawTheme = require('material-ui/lib/styles/raw-themes/light-raw-theme');
const Colors = require('material-ui/lib/styles/colors');

const GeneralView = require('./generalView.jsx');
const DetailedView = require('./detailedView.jsx');

const Main = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getInitialState () {
    return {
      muiTheme: ThemeManager.getMuiTheme(LightRawTheme),
    };
  },

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  componentWillMount() {
    let newMuiTheme = ThemeManager.modifyRawThemePalette(this.state.muiTheme, {
      accent1Color: Colors.deepOrange500
    });

    this.setState({muiTheme: newMuiTheme});
  },

  render() {

    let containerStyle = {
      width: '100%',
      height: '100%'
    };

    return (
      <div style={containerStyle}>
        <GeneralView onDepClick={this._onDepClick} onFinishDraw={this._onFinishDraw} />
        <DetailedView ref="details" />
      </div>
    );
  },

  _onDepClick(data) {
    console.log('data', data)
    this.refs.details.loadDepData(data);
  },

  _onFinishDraw(idDepMax) {
    this.refs.details.loadDepMax(idDepMax);
  },

  _handleTouchTap() {
    this.refs.superSecretPasswordDialog.show();
  }

});

module.exports = Main;
