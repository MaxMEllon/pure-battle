import React, { memo, Component } from 'react'
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
      if (this.count > 500) {
        clearInterval(interval)
        performance.mark('B')
        performance.measure(`PureComponent (${this.state.rate}%)`, 'A', 'B')
      }
      const random = Math.random()
      this.setState({
        items: times(ITEMS_NUM, i => {
          if (i >= this.state.rate / 100 * ITEMS_NUM) {
            return ({
              value: (Math.random() + '').slice(3, 6),
              backgroundColor: sampleColor(),
            })
          }
          return this.state.items[i]
        })
      })
      this.count++
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
        <button onClick={this.onClick}>
          start
        </button>
      </div>
    )
  }
}

const Item = class extends React.PureComponent {
  render() {
    const { value, ...props } = this.props
    return (
      <div style={{ display: 'inline-block', width: '30px', height: '30px', ...props}}>
        {value}
      </div>
    )
  }
}

const style = {
  width: Math.sqrt(ITEMS_NUM) * 30,
  height: Math.sqrt(ITEMS_NUM) * 30,
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
