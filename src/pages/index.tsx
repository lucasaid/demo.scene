import React, { useState, useEffect, useMemo } from "react"
import "../styles/styles.scss"
import styles from "./index.module.scss"
import { Link, graphql } from "gatsby"
// @ts-ignore
import { Helmet } from "react-helmet"

const YEAR = new Date().getFullYear()

const IndexPage = ({ data, location }: any) => {
  const [filter, setFilter] = useState(() => {
    const params = new URLSearchParams(location.search)
    return params.get("q") ?? ""
  })

  useEffect(() => {
const debugKeyAfter = (event: KeyboardEvent) => {
    if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "r"
    ) {
        console.log("Refresh shortcut after propagation:", {
            defaultPrevented: event.defaultPrevented,
            activeElement: document.activeElement,
        });
    }
};

window.addEventListener("keydown", debugKeyAfter, false);
  },[])
  useEffect(() => {
    const url = filter
      ? `${location.pathname}?q=${encodeURIComponent(filter)}`
      : location.pathname
    window.history.replaceState(null, "", url)
  }, [filter])

  const demos = data.allDemoNode.edges
  const lowerFilter = filter.toLowerCase()
  const filtered = useMemo(
    () => filter ? demos.filter((d: any) => d.node.file.toLowerCase().includes(lowerFilter)) : demos,
    [filter, demos]
  )

  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.titleBlock}>
            <span className={styles.titleBracket}>[</span>
            <h1 className={styles.title}>DEMO.SCENE</h1>
            <span className={styles.titleBracket}>]</span>
          </div>
          <div className={styles.titleRule} />
          <div className={styles.headerMeta}>
            <span className={styles.subtitle}>
              BBS INTROS&nbsp;/&nbsp;CRACK INTROS&nbsp;/&nbsp;DEMOS FROM THE 90S
            </span>
            <span className={styles.stats}>
              <span>{demos.length}</span> ENTRIES LOADED
            </span>
            <nav className={styles.navLinks}>
              <Link to="/tv" className={styles.navLink}>
                [ TV MODE ]
              </Link>
            </nav>
          </div>
        </header>

        <div className={styles.toolbar}>
          <span className={styles.prompt}>SEARCH:&gt;</span>
          <input
            className={styles.searchInput}
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="type to filter..."
            autoComplete="off"
            spellCheck={false}
          />
          {filter && (
            <span className={styles.filterCount}>
              {filtered.length}/{demos.length} MATCHES
            </span>
          )}
        </div>

        <div className={styles.grid}>
          {filtered.map(({ node }: any) => (
            <Link
              key={node.id}
              to={`/${node.link}`}
              className={`${styles.tile} ${node.nsfw ? styles.nsfw : ""}`}
            >
              <div className={styles.tileScreen}>
                {node.screenshot ? (
                  <img
                    src={node.screenshot}
                    alt={node.file}
                    className={styles.tileImg}
                  />
                ) : (
                  <div className={styles.tileNoSignal}>
                    <span>NO SIGNAL</span>
                  </div>
                )}
                <div className={styles.playHint}>
                  <span>▶ PLAY</span>
                </div>
                {node.nsfw && (
                  <div className={styles.nsfwOverlay}>
                    <span className={styles.nsfwLabel}>⚠ NSFW</span>
                  </div>
                )}
              </div>
              <div className={styles.tileLabel}>
                <span className={styles.tilePrompt}>&gt;</span>
                <span className={styles.tileName}>{node.file}</span>
              </div>
            </Link>
          ))}
        </div>

        <footer className={styles.footer}>
          <span className={styles.footerText}>
            DEMO.SCENE // PHOSPHOR TERMINAL // {YEAR}
          </span>
          <span className={styles.footerText}>
            C:\DEMOS&gt;<span className={styles.cursor} />
          </span>
        </footer>
      </div>
    </>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query MyQuery {
    allDemoNode(sort: { fields: [file], order: ASC }) {
      edges {
        node {
          id
          file
          link
          screenshot
          nsfw
          command
        }
      }
    }
  }
`
