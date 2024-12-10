import React from 'react'
import styles from '../Styles/Header.module.css'
import {Link} from 'react-router-dom';

export const Header = () => {
  return (
    <div className={styles.Header}>
      <div className={styles.Navi}>
        <Link to="/dashboard" className={styles.NaviText}>Dashboard</Link>
        <Link to="/dashboard/product" className={styles.NaviText}>Products</Link>
        <Link to="" className={styles.NaviText}>Export</Link>
        <Link to="/dashboard/branch" className={styles.NaviText}>Branch</Link>
        <Link to="" className={styles.NaviText}>Stock</Link>
        <Link to="" className={styles.NaviText}>Report</Link>
      </div>
    </div>
  )
}
