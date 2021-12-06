
const isAuth = () => {
  if (!window.sessionStorage.getItem('token')) {
      return false;
    } else {
      return true
    }
}

export default isAuth