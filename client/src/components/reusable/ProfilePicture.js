const React = require('react')

const ProfilePicture = ({id}) => id ? (
  <img
    className="ProfilePicture"
    src={'/picture/' + id}
    alt="Profilbild"
  />
) : (
  <div
    className="ProfilePicture"
  />
)

module.exports = ProfilePicture
