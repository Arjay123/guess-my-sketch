import React from 'react';
import {SketchPicker} from 'react-color';

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      drawing: false,
      x: null,
      y: null,
      color: 'black',
      context: null
    };

    this.mouseDown = this.mouseDown.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.colorChanged = this.colorChanged.bind(this);
  }

  drawLine(x0, y0, x1, y1, color) {
    console.log(this);
    console.log(this.state);
    console.log(`Drawing from ${x0}, ${y0} to ${x1}, ${y1}`);
    console.log(this.state.context);

    // this.canvas.height;
    // this.canvas.left;
    let position = this.canvas.getBoundingClientRect();
    console.log('hi');
    this.state.context.beginPath();
    this.state.context.moveTo(x0 - position.left, y0 - position.top);
    this.state.context.lineTo(x1 - position.left, y1 - position.top);
    this.state.context.strokeStyle = this.state.color;
    this.state.context.lineWidth = 2;
    this.state.context.stroke();
    this.state.context.closePath();
  }

  mouseDown(e) {
    console.log('Draw start');
    this.setState({
      drawing: true,
      x: e.clientX,
      y: e.clientY
    }, () => {
      console.log(this.state);
    });
  }

  mouseMove(e) {
    if (!this.state.drawing){
      return;
    }

    console.log('Drawing');
    this.drawLine(
      this.state.x,
      this.state.y,
      e.clientX,
      e.clientY,
      this.state.color
    );

    this.setState({
      x: e.clientX,
      y: e.clientY
    });
  }

  mouseUp(e){

    if (!this.state.drawing) { return; }
    console.log('Draw End');
    this.setState({
      drawing: false
    }, this.drawLine(this.state.x, this.state.y, e.clientX, e.clientY, this.state.color));
  }

  componentDidMount() {
    console.log(this.canvas);
    // this.context = this.canvas.getContext('2d');
    this.setState({
      context: this.canvas.getContext('2d')
    });
    console.log(this.state.context);
    console.log(this);
  }

  colorChanged(color) {
    this.setState({
      color: color.hex
    }, () => console.log(this.state));
  }

  render() {


    return (
      <div className='canvas-wrap'>
        <h1>Canvas</h1>
        <canvas
          className='canvas'
          id='canvas'
          onMouseDown={this.mouseDown}
          onMouseMove={this.mouseMove}
          onMouseUp={this.mouseUp}
          ref={(c) => {this.canvas = c;}}
        />
        <SketchPicker
          color={this.state.color}
          onChangeComplete={this.colorChanged}
        />
        <button onClick={(e) => this.changeColor('red', e)}>Red</button>
      </div>
    );
  }
}