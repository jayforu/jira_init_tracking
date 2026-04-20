function epicHealth(epic) {
  const { devStatus, subtasksDone, subtasksTotal, testPass, testFail, testTotal } = epic

  const devDone = devStatus === 'Done'
  const devStarted = devStatus !== 'Ready for Execution' && devStatus !== 'Ready for Dev'
  const passRate = testTotal > 0 ? testPass / testTotal : 0
  const noTests = testTotal === 0

  if (devStatus === 'Blocked') return 'Blocked'
  if (!devStarted) return 'N/A'
  if (devDone && noTests) return 'At Risk'
  if (devDone && passRate >= 0.9) return 'Good'
  if (testFail > 0) return 'At Risk'
  if (devDone && !noTests && passRate < 0.9) return 'At Risk'
  if (!devDone && noTests && devStarted) return 'At Risk'
  return 'At Risk'
}

function initiativeHealth(epics) {
  if (!epics.length) return 'N/A'

  const healths = epics.map(epicHealth)

  if (healths.some(h => h === 'Blocked')) return 'Blocked'
  if (healths.every(h => h === 'Good')) return 'Done'
  if (healths.every(h => h === 'Good' || h === 'N/A')) return 'Good'
  return 'At Risk'
}

module.exports = { epicHealth, initiativeHealth }
