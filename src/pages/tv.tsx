import React, { useState, useEffect } from "react"
import { Button, Intent } from "@blueprintjs/core"
import JsDos from "../components/JsDos"
import "../styles/styles.scss"
import styles from "./index.module.scss"

import data from "../../content/data.json"

const IndexPage = () => {
  const [done, setDone] = useState(false)
  const [start, setStart] = useState(false)
  const [demo, setDemo] = useState<any>(undefined)
  useEffect(() => {
    randomDemo()
    if (done) {
      setDone(false)
    }
  }, [done])

  const reInit = () => {
    setDone(true)
  }

  const randomDemo = () => {
    const rand = Math.round(Math.random() * data.length) - 1
    setDemo(data[rand])
  }
  const startTheShow = () => {
    setStart(true)
    randomDemo()
  }
  const stopTheShow = () => {
    setStart(false)
  }


  return (<div>
    {!start && <div className={styles.wrapper}>
      <Button onClick={startTheShow} intent={Intent.PRIMARY}>Watch some nostalgia!</Button>
    </div>}
    {start &&
      <div className={styles.overlay}>
        <Button onClick={stopTheShow} intent={Intent.WARNING}>Stop</Button>
        <Button onClick={reInit} intent={Intent.SUCCESS}>Another</Button>
      </div>}
    {start && !done && demo && <JsDos file={demo.file} command={demo.command} keypresses={demo.keypresses} setDone={setDone} />}
  </div>)
}

export default IndexPage
