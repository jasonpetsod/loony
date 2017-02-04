import React from 'react';
import ReactDOM from 'react-dom';

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    };
    this.timerId = null;
  }

  componentDidMount() {
    this.timerId = setInterval(
        () => this.tick(),
        1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  tick() {
    this.setState({date: new Date()});
  }

  render() {
    return (
        <div>
          <p>Time: {this.state.date.toLocaleTimeString()}</p>
        </div>
    );
  }
}

class Button extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      on: false,
    }
  }

  handleClick = () => {
    this.setState({on: !this.state.on})
  }

  render() {
    return (
        <button onClick={this.handleClick}>
          {this.state.on ? 'on' : 'off'}
        </button>
    );
  }
}

function NumberList(props) {
  const numbers = props.numbers;
  const items = numbers.map((number) =>
      <li key={number.toString()}>{number}</li>
  );
  return <ul>{items}</ul>;
}

function Welcome(props) {
  const numbers = [2, 4, 8, 16];
  return (
      <div>
      <Clock />
      <Button />
      <NumberList numbers={numbers} />
      </div>
  );
}

ReactDOM.render(
  <Welcome />,
  document.getElementById('root')
);
