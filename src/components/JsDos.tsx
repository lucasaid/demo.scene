import React, { useRef, useEffect } from "react"

import Dos from "../vendor/js-dos"

const JsDos = ({ cycles = 24000, command, file, keypresses, setDone }: any) => {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current

    if (!canvas) return

    let cancelled = false
    let ci: any = null
    let disposed = false
    const timers: ReturnType<typeof setTimeout>[] = []

    const dispose = async () => {
      if (disposed) return
      disposed = true

      if (ci) {
        try {
          await ci.exit()
        } catch (error) {
          console.error("Failed to exit js-dos:", error)
        }
      }

      // Release keyboard focus from the DOS canvas.
      canvas.blur()
    }

    const ciPromise = Dos(canvas, {
      cycles,
      wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js",
        keyboardListeningElement: ref.current,
    } as any)
      .then(async (runtime: any) => {
        if (cancelled) return null

        await runtime.fs.extract(`/demos/zipped/${file}.zip`)

        if (cancelled) return null

        const instance = await runtime.main(["-c", command, "-c", "exit"])

        ci = instance

        if (cancelled) {
          await dispose()
          return null
        }

        if (keypresses) {
          let time = 0

          keypresses.keys.forEach((key: any) => {
            time += key.timing ?? keypresses.timing

            const timer = setTimeout(() => {
              if (!cancelled) {
                instance.simulateKeyPress(key.key ?? key)
              }
            }, time)

            timers.push(timer)
          })
        }

        let output = ""

        instance.listenStdout((data: string) => {
          if (cancelled) return

          output += data

          if (/C:\\>exit/i.test(output)) {
            setDone(true)
          }
        })

        return instance
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          console.error("Failed to start js-dos:", error)
        }
        return null
      })

    return () => {
      cancelled = true

      timers.forEach(clearTimeout)

      // Also handle unmounting before initialization completes.
      void ciPromise.then(async instance => {
        if (instance && !ci) {
          ci = instance
        }
        await dispose()
      })
    }
  }, [ref])

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 1 }}>
      <canvas
        ref={ref}
        style={{ width: "100%", height: "100%", display: "block" }}
        tabIndex={0}
        onClick={event => event.currentTarget.focus()}
      />
    </div>
  )
}

export default JsDos
