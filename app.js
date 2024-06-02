const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'Proiectweb')));

app.get('/', (req, res) => {
  const now = new Date();
  const currentHour = now.getHours();

  fs.readFile(path.join(__dirname, 'galery.json'), (err, data) => {
    if (err) throw err;
    const galleryData = JSON.parse(data);

    const filteredImages = galleryData.imagini.filter(image => {
      if (image.timp === 'dimineata' && currentHour >= 5 && currentHour < 12) return true;
      if (image.timp === 'zi' && currentHour >= 12 && currentHour < 20) return true;
      if (image.timp === 'noapte' && (currentHour >= 20 || currentHour < 5)) return true;
      return false;
    });

    // Truncate the number of images to a multiple of 3
    const numberOfImages = Math.floor(filteredImages.length / 3) * 3;
    const truncatedImages = filteredImages.slice(0, numberOfImages);

    res.render('index', {
      cale_galerie: galleryData.cale_galerie,
      gallery: truncatedImages
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
