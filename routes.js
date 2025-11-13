import express from 'express';
import sql from 'mssql';
import 'dotenv/config';

const router = express.Router();
const connectString = process.env.DB_CONNECTION_STRING
// GET: /api/photos/
router.get('/', async (req, res) => {

  
    //Connection to DB
    await sql.connect(connectString);
  
    //Query to collect and join information from DB
    const result = await sql.query`select a.Id, a.ShowTitle, a.Venue, a.Owner, a.AirDate, a.PostedDate, a.PhotoPath, b.Id as CategoryID, b.Title as Type
    from [dbo].[Show] a 
    INNER JOIN [dbo].[Category] b
    ON a.CategoryId = b.Id 
    ORDER BY a.PostedDate ASC;` //Grabs all data
    
    //Returns results as JSON
    res.json(result.recordset);
});

// GET: /api/photos/1
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  await sql.connect(connectString);

  if (id == null || isNaN(id)){
    res.status(400).send("Invalid ID")
  }
  const show = await sql.query`select a.Id, a.ShowTitle, a.Venue, a.Owner, a.AirDate, a.PostedDate, a.PhotoPath, b.Id as CategoryID, b.Title as Type
    from [dbo].[Show] a 
    INNER JOIN [dbo].[Category] b
    ON a.CategoryId = b.Id 
    WHERE a.Id = ${id};`;

    if (result.recordset.length === 0){
        res.status(404).json({ message: 'Show not found.'});
    } else {
    res.json(show);
    }
});

// router.post('/', async (req, res) => {
//   const show = req.body;

//   await sql.connect(connectString);

//   const result = await sql.query`INSERT INTO [dbo].[Ticket]
//   (Body, Author, PostedDate, ShowID)
//   VALUES
//   (${show.Body}, ${show.Author}, GETDATE(), 
//   ${show.ShowId})`;
// });

export default router;