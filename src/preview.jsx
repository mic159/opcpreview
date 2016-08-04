import React, {Component, PropTypes} from 'react';
import {Matrix, Vector, Vector4} from './math';


export class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {rotation: {x:0, y:0, z:0}};
    this.updateRotation = this.updateRotation.bind(this);
  }

  updateRotation(value) {
    this.setState({rotation: value});
  }

  render() {
    return (
      <div className="preview">
        <PreviewGraphics layout={this.props.layout} rotation={this.state.rotation} colors={this.props.colors} />
        <PreviewControls updateRotation={this.updateRotation} />
      </div>
    );
  }
}

class PreviewGraphics extends Component {
  transformVertices(vertices, matrix) {
    return vertices.map(vv => {
      return new Vector4(vv[0], vv[1], vv[2]).transform(matrix);
    }).map(vv => {
      return vv.toVec3();
    });
  }

  calculateSize(vertices) {
    const {min, max} = vertices.reduce((current, v) => {
      v.map((x, idx) => {
        current.min[idx] = Math.min(current.min[idx], x);
        current.max[idx] = Math.max(current.max[idx], x);
      });
      return current;
    }, {min: [Infinity, Infinity, Infinity], max: [-Infinity,-Infinity,-Infinity]});
    const sx = max[0] - min[0];
    const sy = max[1] - min[1];
    const sz = max[2] - min[2];
    const width = Math.max(sx, sy, sz);
    return {width, sx, sy, sz};
  }

  calculateView(size) {
    const {width, sx, sy, sz} = size;

    // Work out the starting position (based on the dimentions of the item)
    let cameraPosition, cameraUp;
    if (sy === 0) {
      cameraPosition = new Vector(0, width * 2, 0);
      cameraUp = new Vector(0, 0, 1);
    } else {
      cameraPosition = new Vector(0, 0, width * 2);
      cameraUp = new Vector(0, 1, 0);
    }

    // Rotate from user input
    const rotateMatrix = new Matrix().rotateZ(
      this.props.rotation.z * (Math.PI/180)
    ).rotateY(
      this.props.rotation.y * (Math.PI/180)
    ).rotateX(
      this.props.rotation.x * (Math.PI/180)
    );

    cameraPosition.transform(rotateMatrix);
    cameraUp.transform(rotateMatrix);

    // Calculate
    const view = Matrix.lookAt(cameraPosition, new Vector(), cameraUp);
    return view;
  }

  render() {
    const vertices = this.props.layout.map(p => p.point);

    // Auto scale
    const size = this.calculateSize(vertices);
    const view = this.calculateView(size);
    const projection = Matrix.perspective(Math.PI/4.0, 1.0, 0.1, 1000.0);

    //Construct model-view-projection matrix
    const mvp = new Matrix().multiply(view).multiply(projection);

    //Transform vertices
    var vertices2d = this.transformVertices(vertices, mvp);

    const svg = vertices2d.map((vert, idx) => {
      const color = this.props.colors[idx] || [255,255,255];
      const v = vert.v;
      return <circle
        cx={0.5 * (v[0] + 1.0) * 512}
        cy={0.5 * (1.0 - v[1]) * 512}
        r={5}
        fill={`rgb(${color[0]},${color[1]},${color[2]})`}
        key={idx}
      />;
    });

    return (
      <svg width="512" height="512" version="1.1">
        {svg}
      </svg>
    );
  }
}

class PreviewControls extends Component {
  constructor(props) {
    super(props);
    this.state = {x: 0, y: 0, z:0};
    this.updateX = this.updateX.bind(this);
    this.updateY = this.updateY.bind(this);
    this.updateZ = this.updateZ.bind(this);
  }
  updateX(event) {
    const value = event.target.value;
    this.setState({x: value});
    this.props.updateRotation(this.state);
  }
  updateY(event) {
    const value = event.target.value;
    this.setState({y: value});
    this.props.updateRotation(this.state);
  }
  updateZ(event) {
    const value = event.target.value;
    this.setState({z: value});
    this.props.updateRotation(this.state);
  }
  render() {
    return (
      <div>
        <input
          type="range" onChange={this.updateX}
          value={this.state.x}
          min={-180} max={180}
        />
        <input
          type="range" onChange={this.updateY}
          value={this.state.y}
          min={-180} max={180}
        />
        <input
          type="range" onChange={this.updateZ}
          value={this.state.z}
          min={-180} max={180}
        />
      </div>
    );
  }
}
