const React = require('react')

const ProfilePicture = ({ _id, extension }) => _id ? (
  <img
    className="profile-picture"
    src={'/i/' + _id + extension}
    alt="Profilbild"
  />
) : (
  <div
    className="profile-picture-placeholder"
  />
)

module.exports = ProfilePicture