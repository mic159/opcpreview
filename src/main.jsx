import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

import {Preview} from './preview.jsx';
import {generateCube} from './layouts.js';


class App extends Component {
  constructor(props) {
    super(props);
    this.updateLayout = this.updateLayout.bind(this);
    this.setPixelColors = this.setPixelColors.bind(this);

    const layout = generateCube(58, 79);
    this.state = {
      layout: layout,
      layoutStr: this.toJson(layout, true),
      layoutError: null,
      colors: [],
    };
  }

  setPixelColors(colors) {
    this.setState({colors: colors});
  }

  toJson(input, pretty) {
    if (pretty) {
      return JSON.stringify(input).replace(/},{/g, '},\n {');
    }
    return JSON.stringify(input);
  }

  updateLayout(event) {
    const raw = event.target.value;
    try {
      const layout = JSON.parse(event.target.value);
      this.setState({
        layout: layout,
        layoutStr: raw,
        layoutError: null,
      });
    }
    catch (err) {
      this.setState({
        layoutStr: raw,
        layoutError: err.toString(),
      });
      console.log(err);
    }
  }

  render() {
    return (
      <div>
        <Preview layout={this.state.layout} colors={this.state.colors} />
        <div className={"output " + (this.state.layoutError ? "error" : "")}>
          <div className="output-title">layout.json</div>
          <textarea
            rows={30}
            cols={60}
            onChange={this.updateLayout}
            value={this.state.layoutStr}
          />
          <span className="error">{this.state.layoutError || "OK"}</span>
        </div>
      </div>
    );
  }
}


export default function() {
  ReactDOM.render(
    <App />,
    document.getElementById('content')
  );
}
