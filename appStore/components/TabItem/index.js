import './index.css'

const TabItem = props => {
  const {tabDetails, tabItemId, isActive} = props
  const {tabId, displayText} = tabDetails

  const checkTabItem = isActive ? 'tab-button active' : 'tab-button'

  const onClickTabItem = () => {
    tabItemId(tabId)
  }

  return (
    <li className="list-item">
      <button className={checkTabItem} type="button" onClick={onClickTabItem}>
        {displayText}
      </button>
    </li>
  )
}

export default TabItem
