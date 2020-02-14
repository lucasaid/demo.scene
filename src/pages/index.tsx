import React from "react"
import "../styles/styles.scss"
import styles from "./index.module.scss"

// import data from "../../content/data.json"
import { Link, graphql } from "gatsby"

const IndexPage = ({
  data
}: any) => {

  const renderDemos = () => {
    return data.allDemoNode.edges.map((demo: any) => {
      return (<div key={demo.node.id} className={`${styles.demo}`}>
        <Link to={`${demo.node.link}`} className={`${styles.crt}`}><img src={demo.node.screenshot} className={styles.image} />{demo.node.file}</Link>
      </div>)
    })
  }

  return (<div className={styles.demos}>
    {renderDemos()}
  </div>)
}

export default IndexPage
export const pageQuery = graphql`
query MyQuery {
  allDemoNode(
    sort: {
      fields: [file]
      order: ASC
    }
  ) {
    edges {
      node {
        id
        file
        link
        screenshot
      }
    }
  }
}`
