import Auth from "./Auth"
export default class Home extends Auth {

  componentWillMount() {
    if (!this.isAuth()) {
      this.props.history.push('/login')
    }
  }

  render() {
    return (
      <div>
        home
      </div>
    )
  }
}