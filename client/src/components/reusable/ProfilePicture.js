const React = require('react')

const ProfilePicture = ({ _id, extension }) => _id ? (
  <img
    className="ProfilePicture"
    src={'/i/' + _id + extension}
    alt="Profilbild"
  />
) : (
  <div
    className="ProfilePicture"
  />
)

module.exports = ProfilePicture