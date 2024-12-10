import React, { useEffect, useState } from 'react';
// import supabase from '../supabase-client';
import { Header } from '../components/Header';
import { InfoBlock } from '../components/DashBoard_Components/InfoBlock';
import styles from '../Styles/DashBoard_Styles/DashBoard.module.css';
import { TableComponent } from '../components/DashBoard_Components/TableComponent';
import supabase from '../supabase-client';
import { use } from 'react';

export const DashBoard = () => {
  const [showAssignContainer, setShowAssignContainer] = useState(false);
  const toggleAssignContainer = () => {
    setShowAssignContainer(!showAssignContainer);
  };
  if(showAssignContainer){
    document.body.classList.add(styles.active_modal)
  }else{
    document.body.classList.remove(styles.active_modal)
  }

  //Supabase query
  const [availableProductTotal, setAvailableProductTotal] = useState('');
  const [notAvailableProductTotal, setNotAvailableProductTotal] = useState('');

  useEffect(() => {
    handleAvailableProductTotal();
    handleNotAvailableProductTotal();
  }, [])

  const handleAvailableProductTotal = async () => {
    const {data, error} = await supabase.rpc('find_total_product_still_available');
    if (error) {
      console.error('Error getting product still available:', error);
    } else {
      setAvailableProductTotal(data);
    }
  }
  const handleNotAvailableProductTotal = async () => {
    const { data, error} = await supabase.rpc('find_total_product_not_available');
    if (error) {
      console.error('Error getting product not available:', error);
    } else {
      setNotAvailableProductTotal(data);
    }
  }

  //Data passing
  const productData = [
    { label: 'AVAILABLE', value: availableProductTotal, color: '#4096FF' },
    { label: 'EXPIRED PRODUCTS', value: notAvailableProductTotal, color: '#DC4446' },
  ];
  const exportData = [
    { label: 'READY TO DELIVERY', value: 23, color: '#4096FF' },
    { label: 'DELIVERING', value: 12, color: '#69B1FF' },
    { label: 'CANCEL', value: 3, color: '#DC4446' },
  ];

  const rowData1 = [
    { store: "Nguyen Van Troi", product: "Candid Retinol Essence 0.5", total: "1", choose: "View branch", top: 100 },
    { store: "Nguyen Van Troi", product: "Candid Retinol Essence 1", total: "2", choose: null, top: 142 },
    { store: "To Hien Thanh", product: "Candid AHA & PHA Exfoliating Gel", total: "4", choose: null, top: 188 },
  ];
  const rowData2 = [
    { store: "Nguyen Van Troi", quantity: "5 cartons", duration: "Tomorrow", top: 100 },
    { store: "Nguyen Trai", quantity: "6 cartons", duration: "Today", top: 142 },
    { store: "To Hien Thanh", quantity: "3 cartons", duration: "4 days next", top: 188 },
  ];

  return (
    <div>
      <Header></Header>

      <div className={styles.wrapper}>
        <InfoBlock title="PRODUCTS" data={productData} headerColor="#C5D2E4" />
        <InfoBlock title="EXPORT" data={exportData} headerColor="#CAE3C2" />
      </div>

      <div className={styles.bigTable}>
        <TableComponent title="NEED TO BE RESTOCKED" rowData={rowData1} lastColumnType="choose" backgroundColor="#FFFFE8B8"/>  
        <TableComponent 
          title="STOCK" 
          rowData={rowData2} 
          lastColumnType="assign" 
          backgroundColor="#ABD6D9BA"
          toggleAssignContainer={toggleAssignContainer}
        />
      </div>

      {showAssignContainer && (
        <div className={styles.modal}>
          <div onClick={toggleAssignContainer} className={styles.overlay}></div>
            <div className={styles.assign_container}>
              <div className={styles.assign_header}>ASSIGN</div>
              <div className={`${styles.input_box} ${styles.driver_box}`}></div>
              <div className={`${styles.input_box} ${styles.time_box}`}></div>
              <div className={`${styles.arrow_icon} ${styles.time_arrow}`}></div>
              <div className={`${styles.input_box} ${styles.note_box}`}></div>
              <div className={`${styles.arrow_icon} ${styles.driver_arrow}`}></div>
              <div className={`${styles.label} ${styles.driver_label}`}>Driver</div>
              <div className={`${styles.label} ${styles.time_label}`}>Time</div>
              <div className={`${styles.label} ${styles.note_label}`}>Note <br />(if needed)</div>
              <div className={styles.save_button}></div>
              <div className={styles.save_text} onClick={toggleAssignContainer}>Save</div>
            </div>
        </div>
      )}

    </div>
  )
}
