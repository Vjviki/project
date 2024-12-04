import {Component} from 'react'
import './index.css'

class Speedometer extends Component {
  state = {count: 0}

  accelerate = () => {
    this.setState(prevState => {
      if (prevState.count === 200) {
        return {count: 200}
      }
      return {count: prevState.count + 10}
    })
  }

  applyBrake = () => {
    this.setState(prevState => {
      if (prevState.count === 0) {
        return {count: 0}
      }
      return {count: prevState.count - 10}
    })
  }

  render() {
    const {count} = this.state
    return (
      <div className="speedo-container">
        <h1 className="heading">SPEEDOMETER</h1>
        <img
          src="https://assets.ccbp.in/frontend/react-js/speedometer-img.png"
          alt="speedometer"
          className="img-size"
        />
        <h1 className="display-meter">Speed is {count}mph</h1>
        <p className="limit-description">
          Min Limit is 0mph, Max Limit is 200mph
        </p>
        <div>
          <button
            type="button"
            className="accelerate-button"
            onClick={this.accelerate}
          >
            Accelerate
          </button>
          <button
            type="button"
            className="brake-button"
            onClick={this.applyBrake}
          >
            Apply Brake
          </button>
        </div>
      </div>
    )
  }
}

export default Speedometer
