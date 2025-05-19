import React, { useState, useEffect } from 'react';
import api from '../api.js';
import { 
  Plus, 
  Edit, 
  Trash2,
  Search, 
  Upload,
  X,
  Hotel,
  Save,
  AlertCircle
} from 'lucide-react';

const FacilitiesComponent = () => {
  // State for facilities
  const [facilities, setFacilities] = useState([]);
  
  // Component-specific state
  const [showModal, setShowModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchFacilities();
  }, []);
  
  // API call for facilities
  const fetchFacilities = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/backend/hotel_admin/facility/');
      
      // Check if response data is an array
      if (Array.isArray(response.data)) {
        setFacilities(response.data);
        console.log('Fetched facilities', response.data);
      } else {
        console.warn('API did not return an array for facilities:', response.data);
        setFacilities([]);
      }
    } catch (err) {
      console.error('Error fetching facilities:', err);
      setError('Failed to load facilities. Please try again later.');
      // Keep any demo data for development purposes
      if (facilities.length === 0) {
        setFacilities([
          {
            Id: 1,
            title: 'Swimming Pool',
            subtitle: 'Olympic-sized pool',
            description: 'Enjoy our temperature-controlled swimming pool with stunning views.',
            image: 'https://as2.ftcdn.net/v2/jpg/03/86/13/33/1000_F_386133321_K9KI3XQ0HHco4mgJNlPCbNvqCICrzCw9.jpg'
          }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        imagePreview: previewUrl
      });
    }
  };
  
  // Input change handler specific to this component
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // CRUD Operations - Facilities
  const handleCreateFacility = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      imagePreview: null
    });
    setImageFile(null);
    setShowModal(true);
  };
  
  const handleEditFacility = (facilityId) => {
    const facilityToEdit = facilities.find(facility => facility.Id === facilityId);
    if (facilityToEdit) {
      setFormData({
        ...facilityToEdit,
        imagePreview: facilityToEdit.image
      });
      setImageFile(null);
      setShowModal(true);
    }
  };
  
  const handleDeleteClick = (id) => {
    const facilityToDelete = facilities.find(facility => facility.Id === id);
    if (facilityToDelete) {
      setItemToDelete({ id, item: facilityToDelete });
      setIsDeleteModalOpen(true);
    }
  };
  
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    const { id } = itemToDelete;
    
    try {
      await api.delete(`/backend/hotel_admin/facility/${id}`);
      
      // Update local state without re-fetching
      setFacilities(facilities.filter(facility => facility.Id !== id));
      console.log(`Facility deleted`);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error('Error deleting facility:', err);
      // You might want to show an error message to the user here
    }
  };
  
  const submitFacilityForm = async (e) => {
    e.preventDefault();
    
    const isEditing = formData.Id;
    const facilityData = new FormData();
    
    // Filter out imagePreview from formData
    Object.keys(formData).forEach(key => {
      if (key !== 'imagePreview') {
        facilityData.append(key, formData[key]);
      }
    });
    
    if (imageFile) {
      facilityData.append("image", imageFile);
    }
    
    try {
      let updatedFacility;
      
      if (isEditing) {
        console.log('Editing facility:', facilityData);
        const response = await api.put(`/backend/hotel_admin/facility/${formData.Id}`, facilityData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        updatedFacility = response.data;
        
        // Update local state
        setFacilities(facilities.map(facility => {
          if (facility.Id === formData.Id) {
            return {
              ...facility,
              ...formData,
              image: formData.imagePreview
            };
          }
          return facility;
        }));
        
        console.log('Facility updated');
      } else {

        console.log('Creating facility:', facilityData);
        const response = await api.post('/backend/hotel_admin/facility/', facilityData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        updatedFacility = response.data;
        
        // Generate a temporary ID if needed
        const newId = updatedFacility?.Id || Math.max(0, ...facilities.map(f => f.Id)) + 1;
        
        // Add to local state
        const newFacility = {
          Id: newId,
          ...formData,
          image: formData.imagePreview || 'https://as2.ftcdn.net/v2/jpg/03/86/13/33/1000_F_386133321_K9KI3XQ0HHco4mgJNlPCbNvqCICrzCw9.jpg'
        };
        
        setFacilities([...facilities, newFacility]);
        console.log('Facility created');
      }
      
      // Close modal first for better UX
      setShowModal(false);
      
      // Optionally re-fetch from server to ensure data consistency
      fetchFacilities();
    } catch (err) {
      console.error('Error submitting facility form:', err);
      // Show error to user
      alert('Failed to save facility. Please try again.');
    }
  };
  
  // Filter facilities
  const filteredFacilities = facilities.filter(facility => 
    facility.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Facility Form Modal
  const FacilityFormModal = () => {
    if (!showModal) return null;
    
    const formTitle = formData.Id ? "Edit Facility" : "Add New Facility";
    
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
          
          <form onSubmit={submitFacilityForm} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1 font-medium">Title</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  placeholder="Facility title"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1 font-medium">Subtitle</label>
                <input 
                  type="text" 
                  name="subtitle"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={formData.subtitle || ''}
                  onChange={handleInputChange}
                  placeholder="Facility subtitle"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1 font-medium">Description</label>
                <textarea 
                  name="description"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300 min-h-24"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Facility description"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1 font-medium">Image</label>
                {formData.imagePreview && (
                  <div className="mb-2">
                    <img 
                      src={formData.imagePreview} 
                      alt="Preview" 
                      className="h-32 object-cover rounded-md"
                    />
                  </div>
                )}
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
                <span>{formData.Id ? 'Update' : 'Create'}</span>
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
          <h2 className="text-xl font-semibold text-white mb-4">Delete Facility</h2>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete "{item.title}"?
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
  
  // Function to safely get image URL
  const getImageUrl = (facility) => {
    if (!facility.image) return '/api/placeholder/400/320';
    
    if (typeof facility.image === 'string') {
      // Check if it's a full URL or just a path
      if (facility.image.startsWith('http')) {
        return facility.image;
      } else {
        // Append base URL if it's just a path
        return `http://localhost:8000${facility.image.startsWith('/') ? '' : '/'}${facility.image}`;
      }
    }
    
    return '/api/placeholder/400/320';
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Hotel className="h-5 w-5 mr-2 text-amber-300" />
          Facilities
        </h2>
        <button
          onClick={handleCreateFacility}
          className="bg-amber-300 hover:bg-amber-400 text-gray-900 font-medium py-2 px-4 rounded-md flex items-center transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>Add Facility</span>
        </button>
      </div>
      
      {error && (
        <div className="mb-6 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-md">
          <div className="flex items-center text-red-400">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
          <div className="mt-2 flex justify-end">
            <button 
              onClick={fetchFacilities}
              className="text-sm text-amber-300 hover:text-amber-400"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search facilities..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-300 border-r-transparent"></div>
          <p className="mt-2 text-gray-400">Loading facilities...</p>
        </div>
      ) : (
        <>
          {filteredFacilities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map(facility => (
                <div key={facility.Id} className="bg-gray-700 rounded-lg overflow-hidden shadow-md">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={getImageUrl(facility)} 
                      alt={facility.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/api/placeholder/400/320'; 
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-medium text-lg">{facility.title}</h3>
                    <p className="text-amber-300 text-sm mb-2">{facility.subtitle}</p>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{facility.description}</p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditFacility(facility.Id)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        aria-label="Edit facility"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(facility.Id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Delete facility"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-lg">
              <Hotel className="mx-auto h-12 w-12 text-gray-600 mb-3" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No facilities found</h3>
              <p className="text-gray-500 mb-6">Add your hotel facilities to showcase to your guests</p>
              <button
                onClick={handleCreateFacility}
                className="bg-amber-300 hover:bg-amber-400 text-gray-900 font-medium py-2 px-4 rounded-md inline-flex items-center transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                <span>Add First Facility</span>
              </button>
            </div>
          )}
        </>
      )}
      
      <FacilityFormModal />
      <DeleteConfirmationModal />
    </div>
  );
};

export default FacilitiesComponent;