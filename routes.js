import express from 'express';
import sql from 'mssql';

const router = express.Router();

// GET: /api/shows/
router.get('/', async (req, res) => {
  try {
    const connectString = process.env.DB_CONNECTION_STRING;
    await sql.connect(connectString);
  
    const show = await sql.query`select a.Id, a.ShowTitle, a.Venue, a.Owner, a.AirDate, a.PostedDate, a.PhotoPath, b.Id as CategoryID, b.Title as Type
    from [dbo].[Show] a 
    INNER JOIN [dbo].[Category] b
    ON a.CategoryId = b.Id 
    ORDER BY a.PostedDate ASC;`;
    
    res.json(show.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: /api/shows/:id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
  
    if (isNaN(id)) {
      return res.status(400).send("Invalid ID");
    }

    const connectString = process.env.DB_CONNECTION_STRING;
    await sql.connect(connectString);

    const show = await sql.query`select a.Id, a.ShowTitle, a.Venue, a.Owner, a.AirDate, a.PostedDate, a.PhotoPath, b.Id as CategoryID, b.Title as Type
    from [dbo].[Show] a 
    INNER JOIN [dbo].[Category] b
    ON a.CategoryId = b.Id 
    WHERE a.Id = ${id};`;

    if (show.recordset.length === 0) {
      return res.status(404).json({ message: 'Show not found.' });
    }
    
    res.json(show.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: /api/shows/
router.post('/', async (req, res) => {
  try {
    console.log('POST body received:', req.body); // Debug log
    
    const customer = req.body;

    if (!customer || !customer.FirstName || !customer.LastName || !customer.Email || !customer.PhoneNumber) {
      return res.status(400).json({ message: 'Missing required fields: FirstName, LastName, Email, PhoneNumber' });
    }

    const connectString = process.env.DB_CONNECTION_STRING;
    await sql.connect(connectString);

    await sql.query`INSERT INTO [dbo].[Customer]
    (FirstName, LastName, Email, PhoneNumber, ticketCount, cardNumber, cvv, expiry, ShowId)
    VALUES
    (${customer.FirstName}, ${customer.LastName}, ${customer.Email}, ${customer.PhoneNumber}, 
    ${customer.ticketCount || null}, ${customer.cardNumber || null}, ${customer.cvv || null}, 
    ${customer.expiry || null}, ${customer.ShowId || null})`;

    res.status(201).json({ message: 'Customer created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;