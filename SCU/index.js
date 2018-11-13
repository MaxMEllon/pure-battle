import React, { memo, Component, PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { sample, times } from 'lodash'
import colors from './colors.json'

const sampleColor = () => sample(colors)

const ITEMS_NUM = 196
const RATE = 0.5

class Root extends Component {
  constructor() {
    super()
    this.state = {
      rate: 0.0,
      items: times(ITEMS_NUM, () => ({
        value: 0,
        backgroundColor: sampleColor(),
      }))
    }
    this.onClick = this.onClick.bind(this)
    this.onChange = this.onChange.bind(this)
    this.count = 0
  }

  onChange(e) {
    const v = parseInt(e.target.value)
    this.setState({ rate: isNaN(v) ? 0 : v })
  }

  onClick() {
    performance.mark('A')
    const interval = setInterval(() => {
      if (this.count > 1000) {
        clearInterval(interval)
        performance.mark('B')
        performance.measure(`SCU (${this.state.rate}%)`, 'A', 'B')
      }
      const random = Math.random()
      this.setState({
        items: times(ITEMS_NUM, i => {
          if (Math.random() >= this.state.rate / 100) {
            return ({
              value: (Math.random() + '').slice(3, 6),
              backgroundColor: sampleColor(),
            })
          }
          return this.state.items[i]
        })
      }, () => this.count++)
    })
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div>
          <span>0~100</span>
          <input value={this.state.rate} onChange={this.onChange} />
        </div>
        <ItemList {...this.state} />
        <button onClick={this.onClick}>start</button>
      </div>
    )
  }
}

const SubItem = ({ value, backgroundColor }) => (
  <div>
    <span style={{ color: 'white' }}>{value}</span>
    {times(4, (i) => <span key={i} style={{ width: '1px', height: '1px', backgroundColor }}>.</span>)}
  </div>
)

const Item = class extends Component {
  shouldComponentUpdate(nextProps) {
    return !(
      this.props.value === nextProps.value
      && this.props.backgroundColor === nextProps.backgroundColor
    )
  }

  render() {
    const { value, ...props } = this.props
    return (
      <div style={{ display: 'inline-block', width: '50px', height: '50px', ...props}}>
        <span>{value}</span>
        <SubItem value={value} backgroundColor={props.backgroundColor} />
      </div>
    )
  }
}

const style = {
  width: Math.sqrt(ITEMS_NUM) * 50,
  height: Math.sqrt(ITEMS_NUM) * 50,
}

const ItemList = ({ items }) => (
  <div style={style}>
    {items.map((i, idx) => <Item key={idx} {...i}/>)}
  </div>
)

ReactDOM.render(
  <Root />,
  document.getElementById('root')
)
