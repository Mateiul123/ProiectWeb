document.addEventListener('DOMContentLoaded', function () {
    fetch('gallery.json')
      .then(response => response.json())
      .then(data => {
        const galleryElement = document.querySelector('.gallery');
        const now = new Date();
        const currentHour = now.getHours();
  
        const filteredImages = data.imagini.filter(image => {
          if (image.timp === 'dimineata' && currentHour >= 5 && currentHour < 12) return true;
          if (image.timp === 'zi' && currentHour >= 12 && currentHour < 20) return true;
          if (image.timp === 'noapte' && (currentHour >= 20 || currentHour < 5)) return true;
          return false;
        });
  
        // Truncate the number of images to a multiple of 3
        const numberOfImages = Math.floor(filteredImages.length / 3) * 3;
        const truncatedImages = filteredImages.slice(0, numberOfImages);
  
        truncatedImages.forEach((image, index) => {
          const figure = document.createElement('figure');
          const picture = document.createElement('picture');
          const img = document.createElement('img');
          const source = document.createElement('source');
          const figcaption = document.createElement('figcaption');
          const small = document.createElement('small');
  
          source.setAttribute('srcset', `${data.cale_galerie}/${image.cale_relativa}`);
          source.setAttribute('media', '(min-width: 800px)');
  
          img.setAttribute('src', `${data.cale_galerie}/${image.cale_relativa}`);
          img.setAttribute('alt', image.alt || image.nume);
          img.setAttribute('title', image.descriere);
  
          figcaption.textContent = `${String.fromCharCode(65 + index)}. ${image.descriere}`;
  
          if (image.attribution) {
            small.innerHTML = `Image by <a href="${image.attribution.source}">${image.attribution.author}</a>, licensed under ${image.attribution.license}`;
          }
  
          picture.appendChild(source);
          picture.appendChild(img);
          figure.appendChild(picture);
          figure.appendChild(figcaption);
          if (image.attribution) figure.appendChild(small);
  
          galleryElement.appendChild(figure);
        });
      })
      .catch(error => console.error('Error loading gallery:', error));
  });
  