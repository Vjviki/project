import './index.css'

const AppItem = props => {
  const {appDetails} = props
  const {appName, imageUrl} = appDetails

  return (
    <li className="list-img">
      <img src={imageUrl} alt={appName} className="logo-img" />
      <p className="logo-name">{appName}</p>
    </li>
  )
}

export default AppItem
