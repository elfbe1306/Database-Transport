import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import styles from '../Styles/Branch_List.module.css'
import { TfiSearch } from 'react-icons/tfi'
import supabase from '../supabase-client'
import { Link } from 'react-router-dom'

export const Branch_List = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWarehouse();
  }, [])

  const fetchWarehouse = async () => {
    const {data, error} = await supabase.from('warehouse').select('*').order('w_id', {ascending: true});
    if(error) {
      console.error('Error fetching warehouses:', error)
    } else {
      const filteredData = data.filter((house) =>
        house.w_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setWarehouses(filteredData);
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      fetchWarehouse();
    }
  };
  useEffect(() => {
    if (searchQuery === '') {
      fetchWarehouse();
    }
  }, [searchQuery]);

  return (
    <div>
      <Header></Header>

      <div className={styles.Content}>
        <div className={styles.Wrapper}>
          <div className={styles.TableName}>WAREHOUSE</div>
          <div className={styles.ActionButton}>
          <div className={styles.search_input_box}>
              <TfiSearch className={styles.icon}/>
              <input 
                type="text" 
                className={styles.search_input} 
                placeholder="Search branch..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchSubmit}
              />
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.table_wrapper}>
          <table className={styles.branch_table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Area</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Manager</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((house) => (
                <tr key={house.w_id}>
                  <td>{house.w_id}</td>
                  <td><Link to={`/dashboard/branch-product/${house.w_id}`}>{house.w_name}</Link></td>
                  <td>{house.w_location}</td>
                  <td>{house.w_area}</td>
                  <td>{house.w_email}</td>
                  <td>{house.w_phoneno}</td>
                  <td>{house.supervisor_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
