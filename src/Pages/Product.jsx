import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { TfiSearch } from "react-icons/tfi";
import styles from '../Styles/Product.module.css';
import supabase from '../supabase-client';

export const Product = () => {
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [total, setTotal] = useState('');
  const [productionDate, setProductionDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

  useEffect(() => {
    fetchPackages();
    fetchCategory();
  }, []);

  // Fetch packages based on the search query
  const fetchPackages = async () => {
    try {
      let query = supabase.from('package').select('package_id, product_name, product_total, category, production_date, expired_date, product_time_left, import_date, export_date');
      
      if (searchQuery) {
        query = query.ilike('product_name', `%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching packages:', error);
      } else {
        setPackages(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  // Calculate Product Time Left
  const handleProductTimeLeft = async () => {
    try {
      const { data, error } = await supabase.rpc('calculate_product_time_left');
      if (error) {
        console.error('Error updating product time left:', error);
      } else {
        console.log('Product time left updated:', data);
        fetchPackages();
        alert('Product time left updated successfully!');
      }
    } catch (err) {
      console.error('Unexpected error during time left update:', err);
      alert('An error occurred while updating the product time left.');
    }
  };

  // Fetch Category
  const fetchCategory = async () => {
    const { data, error } = await supabase.rpc('get_all_categories');
    if (error) {
      console.error('Error getting categories:', error);
    } else {
      setCategories(data);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submit (Enter key press)
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      fetchPackages(); // Fetch the packages based on the current search query
    }
  };

  // Set Category
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!productName || !selectedCategory || !total || !productionDate || !expirationDate) {
      alert('All fields are required, and category cannot be empty.');
      return;
    }
  
    if (editingPackage) {
      // Editing existing package
      const updatedData = {
        product_name: productName,
        category: selectedCategory,
        product_total: total,
        production_date: productionDate,
        expired_date: expirationDate,
      };
  
      const { error } = await supabase
        .from('package')
        .update(updatedData)
        .eq('package_id', editingPackage.package_id);
  
      if (error) {
        console.error('Error updating package:', error);
        alert('Failed to update package');
      } else {
        setPackages(packages.map(pkg =>
          pkg.package_id === editingPackage.package_id
            ? { ...pkg, ...updatedData }
            : pkg
        ));
        alert('Package updated successfully!');
      }
    } else {
      // Adding a new package
      let packagePrefix = selectedCategory.includes('Nước hoa') ? 'NH' : 'MP';
      let newPackageId;
  
      const { data, error } = await supabase
        .from('package')
        .select('package_id')
        .ilike('package_id', `${packagePrefix}%`)
        .order('package_id', { ascending: false })
        .limit(1);
  
      if (error) {
        console.error('Error fetching highest package_id:', error);
        alert('Error fetching package ID');
        return;
      }
  
      if (data && data.length > 0) {
        const lastPackageId = data[0].package_id;
        const lastNumber = parseInt(lastPackageId.slice(2), 10);
        const newNumber = String(lastNumber + 1).padStart(4, '0');
        newPackageId = `${packagePrefix}${newNumber}`;
      } else {
        newPackageId = `${packagePrefix}0001`;
      }
  
      const currentDate = new Date().toISOString().split('T')[0];
  
      const { data: insertData, error: insertError } = await supabase.from('package').insert([{
        package_id: newPackageId,
        product_name: productName,
        category: selectedCategory,
        product_total: total,
        production_date: productionDate,
        expired_date: expirationDate,
        import_date: currentDate,
      }]).select();
  
      if (insertError) {
        console.error('Error saving product:', insertError.message);
      } else {
        console.log('Product saved:', insertData);
        setPackages([...packages, insertData[0]]);
        alert('Product saved successfully!');
      }
    }
  
    // Reset form and close modal
    setEditingPackage(null);
    setIsModalOpen(false);
    setProductName('');
    setSelectedCategory('');
    setTotal('');
    setProductionDate('');
    setExpirationDate('');
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setEditingPackage(null);
      setProductName('');
      setSelectedCategory('');
      setTotal('');
      setProductionDate('');
      setExpirationDate('');
      handleCloseModal();
    }
  };

  const [editingPackage, setEditingPackage] = useState(null);

  const handleOpenEditModal = (pkg) => {
    setEditingPackage(pkg);
    setProductName(pkg.product_name);
    setSelectedCategory(pkg.category);
    setTotal(pkg.product_total);
    setProductionDate(pkg.production_date);
    setExpirationDate(pkg.expired_date);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (packageId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { error } = await supabase
          .from('package')
          .delete()
          .eq('package_id', packageId);
  
        if (error) {
          console.error('Error deleting product:', error);
          alert('Failed to delete the product.');
        } else {
          // Remove the product from the local state
          setPackages(packages.filter((pkg) => pkg.package_id !== packageId));
          alert('Product deleted successfully!');
        }
      } catch (err) {
        console.error('Unexpected error during deletion:', err);
        alert('An error occurred while deleting the product.');
      }
    }
  };

  return (
    <div>
      <Header />

      <div className={styles.Content}>
        <div className={styles.Wrapper}>
          <div className={styles.TableName}>PRODUCT</div>
          <div className={styles.ActionButton}>
            <button className={styles.UpdateProductTimeLeftButton} onClick={handleProductTimeLeft}>
              Update Time Left
            </button>
            <button className={styles.Addbutton} onClick={handleOpenModal}>
              Add product
            </button>
            <div className={styles.search_input_box}>
              <TfiSearch className={styles.icon} />
              <input 
                type="text" 
                className={styles.search_input} 
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchSubmit} // Listen for 'Enter' key press
              />
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.table_wrapper}>
          <table className={styles.product_table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Total</th>
                <th>Category</th>
                <th>Production Date</th>
                <th>Expired Date</th>
                <th>Time Left</th>
                <th>Imported Date</th>
                <th>Exported Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.package_id}>
                  <td>{pkg.package_id}</td>
                  <td>{pkg.product_name}</td>
                  <td>{pkg.product_total}</td>
                  <td>{pkg.category}</td>
                  <td>{pkg.production_date}</td>
                  <td>{pkg.expired_date}</td>
                  <td className={styles.time_left}>{pkg.product_time_left}</td>
                  <td>{pkg.import_date}</td>
                  <td>{pkg.export_date}</td>
                  <td className={styles.actions}>
                    <button className={styles.edit_button} onClick={() => handleOpenEditModal(pkg)}>✏️</button>
                    <button className={styles.delete_button} onClick={() => handleDeleteProduct(pkg.package_id)}>❌</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className={styles.AddProductModalOverlay} onClick={handleOverlayClick}>
          <div className={editingPackage ? styles.EditProductModal : styles.AddProductModal}>
            <h2 className={styles.AddProductModalTitle}>{editingPackage ? 'Edit Product' : 'New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.FormGroup}>
                <label className={styles.labelText}>Product Name</label>
                <input 
                  type="text" 
                  className={styles.Input} 
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className={styles.FormGroup}>
                <label className={styles.labelText}>Category</label>
                <select
                  className={styles.SelectInput}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select a category</option>
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <option key={category.category_name} value={category.category_name}>
                        {category.category_name}
                      </option>
                    ))
                  ) : (
                    <option value="">No categories available</option>
                  )}
                </select>
              </div>

              <div className={styles.FormGroup}>
                <label className={styles.labelText}>Total</label>
                <input 
                  type="number" 
                  className={styles.Input} 
                  placeholder="Enter total quantity" 
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                />
              </div>

              <div className={styles.FormGroup}>
                <label className={styles.labelText}>Production Date</label>
                <input 
                  type="date" 
                  className={styles.Input} 
                  value={productionDate}
                  onChange={(e) => setProductionDate(e.target.value)}
                />
              </div>

              <div className={styles.FormGroup}>
                <label className={styles.labelText}>Expiration Date</label>
                <input 
                  type="date" 
                  className={styles.Input} 
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                />
              </div>

              <div className={styles.ModalActions}>
                <button type="submit" className={styles.SaveButton}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
