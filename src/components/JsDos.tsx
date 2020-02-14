import React, { useRef, useEffect, useState } from "react";

import { DosFactory } from "js-dos";
require("js-dos");
const Dos = (window as any).Dos as DosFactory;


const JsDos = ({ cycles = 24000, command, file, keypresses, setDone }: any) => {
    const ref = useRef<HTMLCanvasElement>(null);
    // const [instance, setInstance] = useState<any>(undefined)

    useEffect(() => {
        if (ref !== null) {
            const ciPromise = Dos(ref.current as HTMLCanvasElement, {
                // // log: (message) => { console.log({ message }) },
                // log: (message) => {
                //     const regex = /\[ERROR\]/gi
                //     if (regex.test(message)) {
                //         // setDone(true)
                //     }
                //     console.warn({ message })
                // },
                cycles,
                wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js",
            }).then((runtime) => {
                return runtime.fs.extract(`/demos/zipped/${file}.zip`).then(() => {
                    return runtime.main(["-c", `${command}`, "-c", "exit"])
                        .then((ci) => {
                            // setInstance(ci)
                            if (keypresses) {
                                let time = 0;
                                keypresses.keys.map((key: any) => {
                                    if (key.timing) {
                                        time = time + key.timing
                                    } else {
                                        time = time + keypresses.timing
                                    }
                                    setTimeout(() => { ci.simulateKeyPress(key.key ? key.key : key) }, time)
                                })
                            }
                            let temp = ""
                            const regex = /C:\\>exit/gi
                            ci.listenStdout((data) => {
                                temp = temp + data
                                if (regex.test(temp)) {
                                    setDone(true)
                                    // ci.exit();
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

    return (<div>
        <canvas ref={ref} />
    </div>)
}

export default JsDos;