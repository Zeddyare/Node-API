import express from 'express';

const router = express.Router();

// GET: /api/photos/
router.get('/', (req, res) => {
  
  // create some sample photo data
  const shows = [
    { id: 1, title: 'Sunset', description: 'Beautiful sunset over the hills' },
    { id: 2, title: 'Mountain', description: 'Majestic mountain range' },
    { id: 3, title: 'Ocean', description: 'Calm ocean waves' },
  ];
  
  res.json(shows);
  
});

// GET: /api/photos/1
router.get('/:id', (req, res) => {
  const id = req.params.id;
  
  const show = {id: id, title: "Sample", description: "Sample"};

  res.json(show)
});

export default router;