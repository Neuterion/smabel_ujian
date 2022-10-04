import React, { useEffect, useState } from 'react'
import BackgroundTimer from 'react-native-background-timer'

export default () => {
  const now = new Date();
  const second = 1000;
  const minute = 60 * second;
  let expiryTime = new Date(now.getTime() + 1 * minute);

  const [timer, setTimer] = useState(60)

  useEffect(() => {
    if (new Date() < expiryTime) {
      BackgroundTimer.runBackgroundTimer(() => {
        setTimer(timer - 1)
      }, 1000)
    } else {
      BackgroundTimer.stopBackgroundTimer()
    }
  },
  [timer])
  
  return (
    <main className="flex-auto flex flex-col bg-slate-600 m-3">
      <h1 className="font-inter text-4xl text-center">
        {timer}
      </h1>
    </main>
  )
}