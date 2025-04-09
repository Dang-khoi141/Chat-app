const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');  // Thêm cors
const app = express();
const port = 5000;

// Sử dụng middleware CORS
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        console.error('Không có file tải lên!');
        return res.status(400).send('Không có file tải lên!');
      }
      console.log('File đã được tải lên:', req.file);
      const ip = '192.168.1.9';
      const imageUrl = `http://${ip}:${port}/uploads/${req.file.filename}`;
      res.send({ url: imageUrl });
});

app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
