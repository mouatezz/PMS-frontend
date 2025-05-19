import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  Plus, 
  Edit, 
  Trash2,
  Search, 
  Filter,
  Upload,
  X,
  Utensils,
  Save,
  DollarSign
} from 'lucide-react';

const MenuItemsComponent = () => {
  // State for menu items
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Classic Cheeseburger',
      description: 'Premium beef patty with cheddar cheese, lettuce, tomato, and special sauce.',
      image: 'https://as2.ftcdn.net/v2/jpg/03/86/13/33/1000_F_386133321_K9KI3XQ0HHco4mgJNlPCbNvqCICrzCw9.jpg',
      price: 12.99,
      category: 'burger'
    }
  ]);
  
  // Component-specific state
  const [showModal, setShowModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const [imageFile, setImageFile] = useState(null);
  
  useEffect(() => {
    fetchMenuItems();
  }, []);
  
  // API call for menu items
  const fetchMenuItems = async () => {
    try {
      const response = await api.get('/backend/hotel_admin/menu/');
      if (response.data && response.data.length > 0) {
        setMenuItems(response.data);
        console.log('Fetched menu items', response.data);
      }
    } catch (err) {
      console.error('Error fetching menu items:', err);
    }
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };
  
  // Fixed input change handler using functional updates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // CRUD Operations - Menu Items
  const handleCreateMenuItem = () => {
    // Reset form data to empty values rather than undefined
    setFormData({
      name: '',
      description: '',
      price: '',
      category: ''
    });
    setImageFile(null);
    setShowModal(true);
  };
  
  const handleEditMenuItem = (menuId) => {
    const menuItemToEdit = menuItems.find(item => item.id === menuId);
    if (menuItemToEdit) {
      // Create a copy with all required fields to avoid undefined values
      setFormData({
        id: menuItemToEdit.id,
        name: menuItemToEdit.name || '',
        description: menuItemToEdit.description || '',
        price: menuItemToEdit.price || '',
        category: menuItemToEdit.category || ''
      });
      setShowModal(true);
    }
  };
  
  const handleDeleteClick = (id) => {
    const menuItemToDelete = menuItems.find(item => item.id === id);
    setItemToDelete({ id, item: menuItemToDelete });
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    const { id } = itemToDelete;
    
    try {
      await api.delete(`/backend/hotel_admin/menu/${id}`);
      fetchMenuItems();
      console.log(`Menu item deleted`);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error('Error deleting menu item:', err);
    }
  };
  
  const submitMenuItemForm = async (e) => {
    e.preventDefault();
    
    const isEditing = formData.id;
    const menuData = new FormData();
    
    // Make sure we're only sending valid data to the API
    Object.keys(formData).forEach(key => {
      if (formData[key] !== undefined && formData[key] !== null) {
        menuData.append(key, formData[key]);
      }
    });
    
    if (imageFile) {
      menuData.append("image", imageFile);
    }
    
    try {
      let response;
      
      if (isEditing) {
        console.log('Updating menu item with data:', Object.fromEntries(menuData));
        response = await api.put(`/backend/hotel_admin/menu/${formData.id}`, menuData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        if (response.data) {
          // Update local state
          setMenuItems(prevItems => prevItems.map(item => {
            if (item.id === formData.id) {
              return {
                ...item,
                ...formData,
                image: response.data.image || item.image
              };
            }
            return item;
          }));
          console.log('Menu item updated');
        }
      } else {
        console.log('Creating menu item with data:', Object.fromEntries(menuData));
        response = await api.post('/backend/hotel_admin/menu/', menuData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        if (response.data) {
          // Add to local state using the response from the server
          setMenuItems(prevItems => [...prevItems, response.data]);
          console.log('Menu item created');
        }
      }
      
      // Refresh from server
      fetchMenuItems();
      setShowModal(false);
    } catch (err) {
      console.error('Error submitting menu item form:', err);
      alert('There was an error saving the menu item. Please try again.');
    }
  };
  
  // Filter menu items
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = 
      (item.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Menu Item Form Modal
  const MenuItemFormModal = () => {
    if (!showModal) return null;
    
    const formTitle = formData.id ? "Edit Menu Item" : "Add New Menu Item";
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h3 className="text-white font-medium text-lg">
              {formTitle}
            </h3>
            <button 
              onClick={() => setShowModal(false)} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={submitMenuItemForm} className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-1 font-medium">Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="Menu item name"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-gray-300 mb-1 font-medium">Description</label>
                <textarea 
                  id="description"
                  name="description"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Menu item description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-gray-300 mb-1 font-medium">Price</label>
                  <input 
                    type="number" 
                    id="price"
                    name="price"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={formData.price || ''}
                    onChange={handleInputChange}
                    placeholder="Price"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-gray-300 mb-1 font-medium">Category</label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={formData.category || ''}
                    onChange={handleInputChange}
                  >
                    <option value="">Select category</option>
                    <option value="burger">Burger</option>
                    <option value="pizza">Pizza</option>
                    <option value="salad">Salad</option>
                    <option value="dessert">Dessert</option>
                    <option value="drinks">Drinks</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="seafood">Seafood</option>
                    <option value="soup">Soup</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1 font-medium">Image</label>
                <div className="mt-2 border-2 border-dashed border-amber-400 rounded-md p-6 text-center">
                  <label className="cursor-pointer block w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Upload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-400 block">
                      {imageFile ? imageFile.name : "Drag and drop image or click to browse"}
                    </span>
                    <span className="text-xs text-gray-500 block mt-1">
                      JPG, PNG, GIF up to 5MB
                    </span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 mr-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-amber-300 hover:bg-amber-400 text-gray-900 font-medium py-2 px-4 rounded-md flex items-center transition-colors"
              >
                <Save className="h-5 w-5 mr-2" />
                <span>{formData.id ? 'Update' : 'Create'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  // Delete confirmation modal
  const DeleteConfirmationModal = () => {
    if (!isDeleteModalOpen || !itemToDelete) return null;
    
    const { item } = itemToDelete;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg shadow-md p-6 max-w-md w-full border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Delete Menu Item</h2>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete "{item.name}"?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Utensils className="h-5 w-5 mr-2 text-amber-300" />
          Menu Items
        </h2>
        <button
          onClick={handleCreateMenuItem}
          className="bg-amber-300 hover:bg-amber-400 text-gray-900 font-medium py-2 px-4 rounded-md flex items-center transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>Add Menu Item</span>
        </button>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search menu items..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="flex-shrink-0 w-full md:w-48">
          <div className="relative">
            <select
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300 appearance-none"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="burger">Burger</option>
              <option value="pizza">Pizza</option>
              <option value="salad">Salad</option>
              <option value="dessert">Dessert</option>
              <option value="drinks">Drinks</option>
              <option value="breakfast">Breakfast</option>
              <option value="seafood">Seafood</option>
              <option value="soup">Soup</option>
              <option value="vegan">Vegan</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMenuItems.map(item => (
          <div key={item.id} className="bg-gray-700 rounded-lg overflow-hidden shadow-md">
            <div className="h-48 overflow-hidden">
              <img 
                src={item.image && item.image.startsWith('http') ? item.image : `http://localhost:8000${item.image}`}
                alt={item.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://as2.ftcdn.net/v2/jpg/03/86/13/33/1000_F_386133321_K9KI3XQ0HHco4mgJNlPCbNvqCICrzCw9.jpg';
                }}
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-medium text-lg">{item.name}</h3>
                <span className="text-amber-300 font-medium flex items-center">
                  {item.price} DZD
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-2 line-clamp-3">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded-full">
                  {item.category}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditMenuItem(item.id)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredMenuItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No menu items found. Add your first menu item!</p>
        </div>
      )}
      
      <MenuItemFormModal />
      <DeleteConfirmationModal />
    </div>
  );
};

export default MenuItemsComponent;