import Auth from './template/Auth'
import './Welcome.scss'
export default class Welcome extends Auth {

  render() {
    return (
      <div className="welcome_container">
        <div className="welcome_slogan">
          welcome
        </div>
      </div>
    )
  }
}