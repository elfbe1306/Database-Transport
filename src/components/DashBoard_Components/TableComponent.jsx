import styles from '../../Styles/DashBoard_Styles/TableComponent.module.css'

export const TableComponent = ({ title, rowData, lastColumnType, backgroundColor, toggleAssignContainer }) => {
  return (
    <div className={styles.background_block} style={{background: backgroundColor }}>
      {[49, 96, 140, 184, 228, 272, 316, 360, 404]?.map((top, index) => (
        <div key={index} className={styles.divider} style={{ top }}></div>
      ))}

      {/* Header */}
      <div className={styles.header} style={{ top: 62 }}>
        <div className={styles.header_item}>STORE</div>
        <div className={styles.header_item}>
          {lastColumnType === "assign" ? "QUANTITY" : "PRODUCT"}
        </div>
        <div className={styles.header_item}>
          {lastColumnType === "assign" ? "DURATION" : "TOTAL"}
        </div>
        <div className={styles.header_item}>
          {lastColumnType === "assign" ? "ASSIGN" : "CHOOSE"}
        </div>
      </div>

      {/* Rows */}
      {rowData?.map((row, index) => (
        <div className={styles.row} style={{ top: row.top }} key={index}>
          <div className={styles.row_item + ' ' + styles.store}>{row.store}</div>
          <div className={styles.row_item + ' ' + styles.product}>
            {lastColumnType === "assign" ? row.quantity : row.product}
          </div>
          <div className={styles.row_item + ' ' + styles.total}>
            {lastColumnType === "assign" ? row.duration : row.total}
          </div>
          <div className={styles.row_item + ' ' + styles.choose}>
            {lastColumnType === "assign" ? (<button className={styles.assign_button} onClick={toggleAssignContainer}>+</button>) : (row.choose)}
          </div>
        </div>
      ))}

      {/* Title */}
      <div className={styles.title} style={{ top: 17 }}>
        <span className={styles.title_text}>{title}</span>
        <span className={styles.view_all}>View All</span>
      </div>
    </div>
  );
};