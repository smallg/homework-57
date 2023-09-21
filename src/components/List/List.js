import React, { Component, Fragment } from 'react';
import { DeselectAll } from 'react-selectable-fast';
import Item from '../Item/Item';

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tips: '',
    };
  }

  generateDay = () => {
    const days = [
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
      '星期日',
    ];
    return days.map((day) => {
      return (
        <div key={day} className="time-period-selector-day">
          {day}
        </div>
      );
    });
  };

  setTips = (tips) => {
    this.setState({
      tips,
    });
  };

  render() {
    return (
      <Fragment>
        <div>
          <div className="time-period-selector-day-wrapper">
            <div className="time-period-header">星期/时间</div>
            {this.generateDay()}
          </div>
          <div className="time-period-selector-wrapper">
            {this.props.items.map((item, i) => (
              <Item
                key={i}
                title={item.title}
                value={item}
                isSelected={item.isSelected}
              />
            ))}
          </div>
        </div>
        <div className="time-period-selector-button-wrapper">
          <div className="time-period-selector-tips">{this.props.tips}</div>
          <DeselectAll className="time-period-selector-button">
            <button>清空</button>
          </DeselectAll>
        </div>
      </Fragment>
    );
  }
}
