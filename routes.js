import express from 'express';
import sql from 'mssql';

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
    res.result("Invalid ID")
  }
  
  const show = await sql.query`select a.Id, a.ShowTitle, a.Venue, a.Owner, a.AirDate, a.PostedDate, a.PhotoPath, b.Id as CategoryID, b.Title as Type
    from [dbo].[Show] a 
    INNER JOIN [dbo].[Category] b
    ON a.CategoryId = b.Id 
    WHERE a.Id = ${id};`;
    console.dir(show)

    if (result.recordset.length === 0){
        res.result("Show not found")
    } else {
    res.json(show);
    }
});

export default router;