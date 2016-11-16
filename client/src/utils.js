export const userRole = user => {
  const roles = ((user || {}).roles || {})
  const is = role => !!roles[role]
  const isWriter = () => is('writer')
  const isRadioHost = () => is('radioHost')
  const isAdmin = () => is('admin')
  const isPrivileged = () => isWriter() || isRadioHost() || isAdmin()
  return {isWriter, isRadioHost, isAdmin, isPrivileged}
}
