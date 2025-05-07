import { useState } from 'react';

const fileToDataUrl = (file) => {
return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.addEventListener('load', (evt) => {
      resolve(evt.currentTarget.result);
    });

    fileReader.addEventListener('error', (evt) => {
      reject(new Error(evt.currentTarget.error));
    });

    fileReader.readAsDataURL(file);
  });
};

const PhotoManager = () => {
  const [images, setImages] = useState([]);

  const handleSelect = async (evt) => {
    const files = [...evt.target.files];
    if (files.length === 0) return;

    try {
      const urls = await Promise.all(files.map((file) => 
        fileToDataUrl(file)
      ));
      
      const newImages = files.map((file, index) => ({
        id: Date.now() + index,
        file,
        url: urls[index],
      }));

      setImages((prev) => 
        [...prev, ...newImages]
      );

    } catch (error) {
      console.error('Error reading files:', error);
    }

    evt.target.value = '';
  };

  const handleRemove = (id) => {
    setImages((prev) => 
      prev.filter((image) => 
        image.id !== id
      )
    );
  };

  return (
    <div className="photo-manager">
      <div className="upload-area">
        <div className="upload-label">Click to select</div>
        <input
          type="file"
          id="file-input"
          accept="image/*"
          multiple
          onChange={handleSelect}
        />
      </div>

      <div className="preview-container">
        {images.map((image) => (
          <div 
            key={image.id} 
            className="preview-item"
          >
            <img 
              src={image.url} 
              alt={image.file.name} 
              className="preview-image" 
            />
            <button 
              className="remove-btn" 
              onClick={() => handleRemove(image.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoManager;
