import React, { Component, Fragment } from 'react';
import { SelectableGroup } from 'react-selectable-fast';
import List from '../List/List';
import { deepClone } from '../../utils';
require('../../assets/styles/index.css');

export default class TimePeriodSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tolerance: true,
      globalMouse: true,
      items: [],
      groupedData: [],
      tips: '拖动鼠标选择时间段',
      timeObj: {},
    };
  }

  arrange = (source) => {
    let t;
    let ta;
    let r = [];

    for (let j = 0; j < source.length; j++) {
      let v = source[j];
      if (v != null) {
        if (t === v['column']) {
          ta.push(v);
          t++;
          continue;
        }
        ta = [v];
        t = v['column'] + 1;
        r.push(ta);
      }
    }
    return r;
  };

  handleSelecting = () => {};

  handleSelectionClear = () => {
    const newItems = [];
    this.state.items.forEach((item) => {
      delete item.isSelected;
      newItems.push(item);
    });
    this.setState({
      items: newItems,
      timeObj: {},
      groupedData: [],
      tips: '拖动鼠标选择时间段'
    });
  };

  handleSelectionFinish = (selectedItems) => {
    const allSelectedItems = [];
    this.state.items.forEach((item) => {
      if (item.isSelected && !allSelectedItems.includes(item)) {
        allSelectedItems.push(item);
      }
      selectedItems.forEach((selectedItem) => {
        if (
          selectedItem.props.value.index === item.index &&
          !allSelectedItems.includes(item)
        ) {
          item.isSelected = true;
          allSelectedItems.push(item);
        }
      });
    });

    allSelectedItems.sort((a, b) => {
      return a.index - b.index;
    });
    const groupedData = this.arrange(allSelectedItems);
    let tips;
    if (groupedData.length > 0) {
      tips = '已选择时间段';
    } else {
      tips = '拖动鼠标选择时间段';
    }

    this.setState({ groupedData, tips }, () => {
      this.generateTimeObject();
    });
  };

  generateTimeObject = () => {
    const timeObj = {};
    this.state.groupedData.forEach((item) => {
      if (item && item.length > 0) {
        switch (item[0].row) {
          case 0:
            if (!timeObj['Monday']) {
              timeObj['Monday'] = [];
            }
            timeObj['Monday'].push(item);
            break;
          case 1:
            if (!timeObj['Tuesday']) {
              timeObj['Tuesday'] = [];
            }
            timeObj['Tuesday'].push(item);
            break;
          case 2:
            if (!timeObj['Wednesday']) {
              timeObj['Wednesday'] = [];
            }
            timeObj['Wednesday'].push(item);
            break;
          case 3:
            if (!timeObj['Thursday']) {
              timeObj['Thursday'] = [];
            }
            timeObj['Thursday'].push(item);
            break;
          case 4:
            if (!timeObj['Friday']) {
              timeObj['Friday'] = [];
            }
            timeObj['Friday'].push(item);
            break;
          case 5:
            if (!timeObj['Saturday']) {
              timeObj['Saturday'] = [];
            }
            timeObj['Saturday'].push(item);
            break;
          case 6:
            if (!timeObj['Sunday']) {
              timeObj['Sunday'] = [];
            }
            timeObj['Sunday'].push(item);
            break;
          default:
        }
      }
    });

    this.setState({
      timeObj,
    });

    if (this.props.onSelectionFinish) {
      const propsObj = deepClone(timeObj);
      Object.keys(propsObj).forEach((key) => {
        propsObj[key].map((arr) => {
          return arr.map((item) => {
            delete item.isSelected;
            item.index = item.index - 24;
            return item;
          });
        });
      });
      this.props.onSelectionFinish.call(this, propsObj);
    }
  };

  generateTimePeriodExhibition = () => {
    return Object.keys(this.state.timeObj).map((key, i) => {
      return (
        <p key={i} className="time-period-selector-ex">
          <span className="time-period-selector-time">
            {this.getWeekName(key)}
          </span>
          <span
            dangerouslySetInnerHTML={{
              __html: this.generateTime(this.state.timeObj[key]),
            }}
          ></span>
        </p>
      );
    });
  };

  getWeekName = (key) => {
    switch (key) {
      case 'Monday':
        return '星期一';
      case 'Tuesday':
        return '星期二';
      case 'Wednesday':
        return '星期三';
      case 'Thursday':
        return '星期四';
      case 'Friday':
        return '星期五';
      case 'Saturday':
        return '星期六';
      case 'Sunday':
        return '星期日';
      default:
        return '';
    }
  };

  generateTime = (source) => {
    return source.map((item) => {
      if (item.length === 1) {
        if (item[0].column % 2 === 0) {
          return `<span class="period">${item[0].time.hour}:${item[0].time.minute}-${item[0].time.hour}:30</span>`;
        } else {
          return `<span class="period">${item[0].time.hour}:${
            item[0].time.minute
          }-${item[0].time.hour + 1}:00</span>`;
        }
      }
      // Handler hour and minute when item is last one
      const lastItem = item[item.length - 1];
      let minute = '00';
      let hour = lastItem.time.hour;
      if (lastItem.column % 2 === 0) {
        minute = '30';
      } else {
        hour += 1;
      }

      return `<span class="period">${item[0].time.hour}:${item[0].time.minute}-${hour}:${minute}</span>`;
    });
  };

  generateItems = () => {
    let arr = [];
    let row = -1;
    let selectedItems = [];
    for (let i = 0; i < 8 * 2 * 24 - 24; i++) {
      let data = {};

      // Generate title for hour
      if (i < 24) {
        data.title = i;
      }

      // row {0: Monday, 1: Tuesday....}
      if ((i - 24) % 48 === 0) {
        row++;
      }
      data.row = row;

      // Set hour and time for each item
      data.column = (i - 24) % 48;
      data.time = {
        hour: Math.floor(((i - 24) % 48) / 2),
        minute: i % 2 === 0 ? '00' : '30',
      };

      data.index = i;

      arr.push(data);
    }
    this.setState({
      items: arr,
    });
    this.handleSelectionFinish(selectedItems);
  };

  componentDidMount() {
    this.generateItems();
  }

  restPeriodHandler = () => {
    const restPeriod = [
      282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296,
      297, 298, 299, 300, 301, 302, 303, 304, 305, 330, 331, 332, 333, 334, 335,
      336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350,
      351, 352, 353,
    ];

    const selectedItems = [];
    const newItems = [];
    this.state.items.forEach((item) => {
      if (restPeriod.includes(item.index)) {
        item.isSelected = true;
      }
      // Select all items, when isSelected is true, not only current selected items
      if (item.isSelected) {
        selectedItems.push({ props: { value: item } });
      }
      newItems.push(item);
    });
    this.setState({
      items: newItems,
    });
    this.handleSelectionFinish(selectedItems);
  };

  workPeriodHandler = () => {
    const workPeriod = [
      42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
      60, 61, 62, 63, 64, 65, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101,
      102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 138, 139, 140,
      141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
      156, 157, 158, 159, 160, 161, 186, 187, 188, 189, 190, 191, 192, 193, 194,
      195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209,
      234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248,
      249, 250, 251, 252, 253, 254, 255, 256, 257,
    ];
    const selectedItems = [];
    const newItems = [];
    this.state.items.forEach((item) => {
      if (workPeriod.includes(item.index)) {
        item.isSelected = true;
      }
      // Select all items, when isSelected is true, not only current selected items
      if (item.isSelected) {
        selectedItems.push({ props: { value: item } });
      }
      newItems.push(item);
    });
    this.setState({
      items: newItems,
    });
    this.handleSelectionFinish(selectedItems);
  };

  render() {
    return (
      <Fragment>
        <div className="time-period-selector-mark">
          <div className="d-flex btn-groups">
            <button onClick={this.workPeriodHandler}>工作日黄金时间</button>
            <button onClick={this.restPeriodHandler}>休息日黄金时间</button>
          </div>
          <div className="d-flex">
            <div className="selected">
              <div className="icon"></div>
              <div>已选</div>
            </div>
            <div className="unselected">
              <div className="icon"></div>
              <div>可选</div>
            </div>
          </div>
        </div>
        <div className="time-period-selector-title-wrapper">
          <span className="time-period-selector-blank-title"></span>
          <span className="time-period-selector-title first">00:00-12:00</span>
          <span className="time-period-selector-title">12:00-24:00</span>
        </div>
        <SelectableGroup
          enableDeselect
          tolerance={this.state.tolerance}
          globalMouse={this.state.isGlobal}
          allowClickWithoutSelected={true}
          duringSelection={this.handleSelecting}
          onSelectionClear={this.handleSelectionClear}
          onSelectionFinish={this.handleSelectionFinish}
          ignoreList={['.not-selectable']}
        >
          <List
            items={this.state.items}
            ref={this.listHook}
            tips={this.state.tips}
          />
        </SelectableGroup>
        {this.generateTimePeriodExhibition()}
      </Fragment>
    );
  }
}
