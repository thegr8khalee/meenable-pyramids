// src/pages/AdminEditProductPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { ChevronDown, ChevronUp, Loader2, Search, XCircle } from 'lucide-react';
// import { useCollectionStore } from '../store/useCollectionStore'; // Assuming this provides collections
import { useAdminStore } from '../store/useAdminStore'; // Assuming this provides updateProduct
import { useProductsStore } from '../store/useProductsStore'; // Assuming this provides getProductById

const AdminEditProductPage = () => {
  const { productId } = useParams();
  const { updateProduct, isUpdatingProduct } = useAdminStore();
  const { getProductById, isGettingProducts } = useProductsStore();
  const navigate = useNavigate();

  const editorRef = useRef(null);

  const handleEditorInit = (evt, editor) => {
    editorRef.current = editor;
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: '',
    price: '',
    category: '',
    images: [], // This will store a mix of {url, public_id} and {url: base64, isNew: true}
    isBestSeller: false,
    isPromo: false,
    discountedPrice: '',
  });
  const [error, setError] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]); // Stores URLs for display

//   const { collections, isGettingCollections, getCollections } =
//     useCollectionStore();

  // For collection dropdown (if you still want the search/dropdown functionality)
//   const [isCollectionDropdownOpen, setIsCollectionDropdownOpen] =
    useState(false);
//   const [collectionSearchQuery, setCollectionSearchQuery] = useState('');
//   const dropdownRef = useRef(null);

  // Effect to fetch collections for the dropdown
//   useEffect(() => {
//     getCollections();
//   }, [getCollections]);

  // Effect to fetch product data when component mounts or productId changes
  useEffect(() => {
    const fetchProductData = async () => {
      if (productId) {
        const productData = await getProductById(productId);
        if (productData) {
          setFormData({
            name: productData.name || '',
            description: productData.description || '',
            ingredients: productData.ingredients || '',
            price: productData.price || '',
            category: productData.category || '',
            images: productData.images || [], // Initialize with existing images from DB
            isBestSeller: productData.isBestSeller || false,
            isPromo: productData.isPromo || false,
            discountedPrice: productData.discountedPrice || '',
          });
          // Set image previews from existing image URLs
          setImagePreviews(productData.images?.map((img) => img.url) || []);
        } else {
          navigate('/admin/dashboard?section=products');
          // toast.error('Product not found or failed to load.');
        }
      }
    };
    fetchProductData();
  }, [productId, getProductById, navigate]);

  // Close collection dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsCollectionDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      };

      if (name === 'isPromo' && !checked) {
        newData.discountedPrice = '';
      }
      if (name === 'isForeign' && !checked) {
        newData.origin = '';
      }
      return newData;
    });
    setError(null);
  };

  // Corrected handleImageChange to handle multiple files and manage existing/new images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Get all selected files
    if (files.length === 0) return;

    setError(null); // Clear previous error

    const newImagesToProcess = [];
    const newPreviewsToProcess = [];
    let filesProcessedCount = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImagesToProcess.push({ url: reader.result, isNew: true }); // Mark as new Base64 image
        newPreviewsToProcess.push(reader.result);
        filesProcessedCount++;

        // If all files are processed, update state
        if (filesProcessedCount === files.length) {
          setFormData((prevData) => {
            // Filter out any *previous* new Base64 images that might have been selected
            // before this current selection. Keep only original Cloudinary images.
            const existingCloudinaryImages = prevData.images.filter(
              (img) => !img.isNew
            );
            return {
              ...prevData,
              images: [...existingCloudinaryImages, ...newImagesToProcess], // Combine existing and new
            };
          });
          setImagePreviews((prevPreviews) => {
            // Filter out any *previous* Base64 previews. Keep only original Cloudinary URLs.
            const existingCloudinaryPreviews = prevPreviews.filter(
              (url) => !url.startsWith('data:image')
            );
            return [...existingCloudinaryPreviews, ...newPreviewsToProcess]; // Combine existing and new previews
          });
        }
      };
      reader.onerror = () => {
        setError('Failed to read image file.');
        // toast.error('Failed to read image file.');
      };
      reader.readAsDataURL(file);
    });
    e.target.value = null; // Clear the input so same file(s) can be selected again
  };

  // Handles removing an image by its index
  const handleRemoveImage = (indexToRemove) => {
    setFormData((prevData) => {
      const updatedImages = prevData.images.filter(
        (_, index) => index !== indexToRemove
      );
      return { ...prevData, images: updatedImages };
    });
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== indexToRemove)
    );
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const htmlDescription = editorRef.current
      ? editorRef.current.getContent()
      : '';

    // Client-side validation for description
    const strippedDescription = htmlDescription.replace(/<[^>]*>/g, '').trim();
    if (!strippedDescription) {
      setError('Description cannot be empty.');
      return;
    }

    // IMPORTANT: Only update the description field in dataToSubmit.
    // All other fields and their processing remain exactly as they were.
    const dataToSubmit = { ...formData, description: htmlDescription };

    // const dataToSubmit = { ...formData };

    const parsedPrice = parseFloat(dataToSubmit.price);
    const parsedDiscountedPrice = parseFloat(dataToSubmit.discountedPrice);

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Price must be a non-negative number.');
      return;
    }
    dataToSubmit.price = parsedPrice;

    if (dataToSubmit.isPromo) {
      if (isNaN(parsedDiscountedPrice) || parsedDiscountedPrice <= 0) {
        setError(
          'Discounted price is required and must be greater than 0 if product is on promotion.'
        );
        return;
      }
      if (parsedDiscountedPrice >= parsedPrice) {
        setError('Discounted price must be less than the original price.');
        return;
      }
      dataToSubmit.discountedPrice = parsedDiscountedPrice;
    } else {
      dataToSubmit.discountedPrice = undefined; // Set to undefined, not empty string
    }

    if (
      dataToSubmit.isForeign &&
      (dataToSubmit.origin === '' || dataToSubmit.origin.trim() === '')
    ) {
      setError('Origin is required if product is marked as foreign.');
      return;
    } else if (!dataToSubmit.isForeign) {
      dataToSubmit.origin = undefined; // Set to undefined if not foreign
    }

    if (dataToSubmit.collectionId === '') {
      dataToSubmit.collectionId = null;
    }

    // Prepare images for submission: new images as Base64, existing images as {url, public_id}
    // This mapping is correct IF formData.images is correctly structured
    dataToSubmit.images = formData.images.map((img) => {
      if (img.isNew) {
        return { url: img.url, isNew: true }; // Send {url: base64, isNew: true} for new images
      }
      return { url: img.url, public_id: true }; // Send existing objects
    });

    // console.log(
    //   'Data to submit (images field) from frontend:',
    //   JSON.stringify(dataToSubmit.images)
    // ); // DEBUG LOG

    await updateProduct(productId, dataToSubmit);

    navigate(-1); // Go back to previous page (e.g., admin dashboard)
  };

  // For collection dropdown filtering
//   const filteredCollections = collections.filter((collection) =>
//     collection.name.toLowerCase().includes(collectionSearchQuery.toLowerCase())
//   );

//   const selectedCollectionName =
//     collections.find((c) => c._id === formData.collectionId)?.name ||
//     'Select a collection (Optional)';

  if (isGettingProducts) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen py-8 bg-base-200">
      <div className="px-4 py-12 bg-base-100 rounded-lg shadow-xl w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-primary font-[inter]">
          Edit Product
        </h2>

        {error && (
          <div role="alert" className="alert alert-error mb-4 rounded-md">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Modern Sofa"
              className="input input-bordered w-full rounded-none"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <Editor
              onInit={handleEditorInit}
              apiKey="esh5bav8bmcm4mdbribpsniybxdqty6jszu5ctwihsw35a5y" // <--- IMPORTANT: Replace with your TinyMCE API key
              initialValue={formData.description} // Set initial value from fetched product data
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount',
                ],
                toolbar:
                  'undo redo | formatselect | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style:
                  'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              }}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Ingredients</span>
            </label>
            <textarea
              name="ingredients"
              placeholder="e.g. cardamom, salt..."
              className="textarea textarea-bordered h-24 w-full rounded-none"
              value={formData.ingredients}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Price (₦)</span>
            </label>
            <input
              type="number"
              name="price"
              placeholder="999.99"
              step="0.01"
              className="input input-bordered w-full rounded-none"
              value={Number(formData.price).toFixed(2)}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              name="category"
              className="select select-bordered w-full rounded-none"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="spice">Spice</option>
              <option value="herb">Herb</option>
              <option value="blend">Blend</option>
              <option value="chilli powder">Chilli Powder</option>
              {/* Add more categories as needed */}
            </select>
          </div>

          {/* Images Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Images</span>
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple // Keep multiple attribute
              className="file-input file-input-bordered w-full rounded-none"
              onChange={handleImageChange}
            />
            <p className="text-sm text-gray-500 mt-1">
              Select one or more images. New selections will replace previously
              added *new* images, but existing Cloudinary images will be
              retained.
            </p>

            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((previewUrl, index) => (
                  <div
                    key={index}
                    className="relative group w-full h-24 sm:h-32 rounded-md overflow-hidden shadow-sm border border-gray-200"
                  >
                    <img
                      src={previewUrl}
                      alt={`Product Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      aria-label="Remove image"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Is Best Seller?</span>
              <input
                type="checkbox"
                name="isBestSeller"
                className="checkbox checkbox-primary"
                checked={formData.isBestSeller}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Is on Promotion?</span>
              <input
                type="checkbox"
                name="isPromo"
                className="checkbox checkbox-primary"
                checked={formData.isPromo}
                onChange={handleChange}
              />
            </label>
          </div>

          {formData.isPromo && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Discounted Price (₦)</span>
              </label>
              <input
                type="number"
                name="discountedPrice"
                placeholder="e.g., 399.99"
                step="0.01"
                className="input input-bordered w-full rounded-none"
                value={Number(formData.discountedPrice).toFixed(2)}
                onChange={handleChange}
                required={formData.isPromo}
              />
            </div>
          )}

          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn btn-primary w-full text-lg font-semibold py-3 rounded-none shadow-md hover:shadow-lg transition duration-200 text-white font-[inter]"
              disabled={isUpdatingProduct}
            >
              {isUpdatingProduct ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Update Product'
              )}
            </button>
          </div>

          <div className="form-control mt-4">
            <button
              type="button"
              className="btn btn-ghost w-full text-lg font-semibold py-3 rounded-none"
              onClick={() => navigate('/admin/dashboard?section=products')}
              disabled={isUpdatingProduct}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProductPage;
