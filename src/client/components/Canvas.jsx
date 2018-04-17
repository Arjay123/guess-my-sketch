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

    let socket = this.props.socket;

    socket.on('canvas drawing', (drawing) => {
      console.log(drawing);
      this.onDrawingReceived(drawing);
    });

    this.mouseDown = this.mouseDown.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.colorChanged = this.colorChanged.bind(this);
    this.onDrawingReceived = this.onDrawingReceived.bind(this);
  }

  onDrawingReceived(drawing) {
    console.log('received drawing');
    console.log(drawing);
    let position = this.canvas.getBoundingClientRect();

    this.drawLine(
      drawing,
      false
    );
  }

  drawLine(drawing, send) {
    console.log(this);
    console.log(this.state);

    console.log(this.state.context);

    // this.canvas.height;
    // this.canvas.left;
    let position = this.canvas.getBoundingClientRect();
    console.log(`Drawing from ${drawing.x0}, ${drawing.y0} to ${drawing.x1}, ${drawing.y1}`);
    console.log('hi');
    this.state.context.beginPath();
    this.state.context.moveTo(drawing.x0, drawing.y0);
    this.state.context.lineTo(drawing.x1, drawing.y1);
    this.state.context.strokeStyle = drawing.color;
    this.state.context.lineWidth = 2;
    this.state.context.stroke();
    this.state.context.closePath();


    if (send) {
      console.log('sending drawing: ' + send);
      console.log(drawing);
      this.props.socket.emit('canvas drawing', drawing);
    }
  }

  getCanvasPosition(drawing) {
    let position = this.canvas.getBoundingClientRect();
    return {
      x0: drawing.x0 - position.left,
      y0: drawing.y0 - position.top,
      x1: drawing.x1 - position.left,
      y1: drawing.y1 - position.top
    }
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
    let drawing = this.getCanvasPosition({
      x0: this.state.x,
      y0: this.state.y,
      x1: e.clientX,
      y1: e.clientY
    });

    drawing.color = this.state.color;

    this.drawLine(
      drawing,
      true
    );

    this.setState({
      x: e.clientX,
      y: e.clientY
    });
  }

  mouseLeave() {
    this.setState({
      drawing: false
    });
  }

  mouseUp(e){

    if (!this.state.drawing) { return; }
    console.log('Draw End');

    let drawing = this.getCanvasPosition({
      x0: this.state.x,
      y0: this.state.y,
      x1: e.clientX,
      y1: e.clientY
    });
    drawing.color = this.state.color;

    this.setState({
      drawing: false
    }, this.drawLine(drawing, true));
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
          onMouseLeave={this.mouseLeave}
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