const React = require('react')

const ProfilePicture = ({ _id, extension }) => (
  <img
    className="profile-picture"
    src={'/i/' + _id + extension}
    alt="Profilbild"
  />
)

module.exports = ProfilePicture