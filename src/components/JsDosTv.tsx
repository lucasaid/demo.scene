import React, { useRef, useEffect, useState } from "react";

import Dos, { DosFactory } from "../vendor/js-dos";


const JsDos = ({ command, file, keypresses, setDone }: any) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const [instance, setInstance] = useState<any>(undefined)

    useEffect(() => {
        if (ref !== null) {
            const ciPromise = Dos(ref.current as HTMLCanvasElement, {
                // log: (message) => { console.log({ message }) },
                log: (message) => {
                    const regex = /\[ERROR\]/gi
                    if (regex.test(message)) {
                        // setDone(true)
                    }
                    console.warn({ message })
                },
                cycles: 24000,
                wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js",
            }).then((runtime) => {
                return runtime.fs.extract(`demos/${file}`).then(() => {
                    return runtime.main(["-c", `${command}`, "-c", "exit"])
                        .then((ci) => {
                            setInstance(ci)
                            console.log(`Running: ${command}`)
                            let time = 0;
                            keypresses.map((key: number) => {
                                time = time + 200
                                console.log(time)
                                setTimeout(() => { ci.simulateKeyPress(key) }, time)
                            })
                            let temp = ""
                            const regex = /C:\\>exit/gi
                            ci.listenStdout((data) => {
                                temp = temp + data
                                if (regex.test(temp)) {
                                    ci.exit();
                                    setDone(true)
                                }
                            })
                            return ci
                        });
                });
            })
            return () => {
                ciPromise.then(ci => { ci.exit() });
            };
        }
    }, [ref]);
    const exit = () => {
        if (instance) {
            instance.exit()
        }
    }

    return (<div>
        <button onClick={exit}>Fullscreen</button>
        <canvas ref={ref} />
    </div>)
}

export default JsDos;