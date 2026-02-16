import fs from 'fs';

const imageBuffer = fs.readFileSync('test-image.jpg');
const blob = new Blob([imageBuffer], { type: 'image/jpeg' });

const formData = new FormData();
formData.append('image', blob, 'test.jpg');
formData.append('targetLocales', JSON.stringify(['ar-SA']));

const res = await fetch('http://localhost:3001/api/cultural/analyze-image', {
  method: 'POST',
  body: formData
});
const data = await res.json();
console.log(JSON.stringify(data, null, 2));
