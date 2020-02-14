import { Alert, Intent } from "@blueprintjs/core"
import React, { useState, useEffect } from "react"
import { Link, navigate } from "gatsby"
import JsDos from "../components/JsDos"
// @ts-ignore
import data from "../../content/data.json"
import { IconNames } from "@blueprintjs/icons"
const basicTemplate = (props: any) => {
    const [done, setDone] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const nav = (newFile: any) => {
        navigate(`/${newFile}`)
    }

    useEffect(() => {
        if (done) {
            // randomDemo()
            setIsOpen(true)
        }
    }, [done])

    const playItAgainSam = () => {
        setDone(false)
        closeAlert()
    }
    const closeAlert = () => {
        setIsOpen(false)
    }
    const goBack = () => {
        closeAlert()
        navigate("/")
    }

    const randomDemo = () => {
        if (data) {
            const rand = Math.round(Math.random() * data.length) - 1
            if (data[rand]) {
                nav(data[rand].file)
            }
        }
    }
    const { pageContext } = props
    const { file, cycles, command, keypresses } = pageContext
    return (
        <div>

            <Alert
                cancelButtonText="Back"
                confirmButtonText="Play It Again Sam"
                icon={IconNames.PLAY}
                intent={Intent.PRIMARY}
                isOpen={isOpen}
                onCancel={goBack}
                onConfirm={playItAgainSam}
            >
                <p>
                    Back to listing?
                    </p>
            </Alert>
            {!done && <JsDos cycles={cycles} file={file} command={command} keypresses={keypresses} setDone={setDone} />}
        </div>
    )
}
export default basicTemplate