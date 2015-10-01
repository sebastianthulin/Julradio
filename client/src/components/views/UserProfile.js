const React = require('react')

const VIEW_PROFILE = 'VIEW_PROFILE'
const EDIT_PROFILE = 'EDIT_PROFILE'

class UserProfile extends React.Component {
  componentWillMount() {
    this.state = {
      UIState: {VIEW_PROFILE: true}
    }
  }

  edit() {
    var { UIState } = this.state
    UIState.VIEW_PROFILE = false
    UIState.EDIT_PROFILE = true
    this.setState({UIState})
  }

  save() {
    var { UIState } = this.state
    UIState.VIEW_PROFILE = true
    UIState.EDIT_PROFILE = false
    this.setState({UIState})
  }

  render() {
    var { UIState } = this.state
    var description = 'Jag är en livs levande snigelfitta. Föddes den 29 december från mitt mammas anus - detta kan uppfattas som annorlunda och lite konstigt men redan från ung ålder valde jag att vandra min egen väg.'

    return (
      <div className="row content">
        <div className="profileBox">
          <div className="profPicture"></div>

          {false && <div className="profPM">Skicka Meddelande</div>}
          {true && UIState.VIEW_PROFILE && <div className="profPM" onClick={this.edit.bind(this)}>Inställningar</div>}
          {true && UIState.EDIT_PROFILE && <div className="profPM" onClick={this.save.bind(this)}>Spara</div>}
          {UIState.VIEW_PROFILE && <div className="profName">Oliver Johansson</div>}
          {UIState.EDIT_PROFILE && <input defaultValue={'Oliver Johansson'} />}

          <div className="profAge">Göteborg, 20 År</div>
          <div className="profText">
            {UIState.VIEW_PROFILE && <div className="profTextBox">{description}</div>}
            {UIState.EDIT_PROFILE && <textarea defaultValue={description} />}
          </div>
        </div>
      </div>
    )
  }
}

module.exports = UserProfile