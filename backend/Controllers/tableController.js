const db = require('../Models');

const Restaurant = db.Restaurant;
const Table = db.Table;


module.exports = {
  // GET /api/tables
  async index(req, res) {
    const {userId} = req.query;
    console.log(userId);

    try{
        const restaurant = await Restaurant.findOne({
            where : {
                id : userId
            },
            include : [Table],
        });
        if(!restaurant){
            return res.status(404).json({message : 'usuario nao encontrado'});
        }
        return res.status(200).send(restaurant.tables);
    }catch(err){
        return res.status(404).json({message : 'usuario nao encontrado'});
    }
  },  

  // GET /api/tables/:id
  async show(req, res) {
    try {
      const table = await Table.findByPk(req.params.id, { include: ['restaurant'] });
      if (!table) return res.status(404).json({ error: 'Table not found' });
      return res.json(table);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch table' });
    }
  },

  // POST /api/tables
  async create(req, res) {
    try {
      const { restaurant_id, table_number, table_capacity } = req.body;
      const newTable = await Table.create({ restaurant_id, table_number, table_capacity });
      return res.status(201).json(newTable);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: 'Failed to create table' });
    }
  },

  // PUT /api/tables/:id
  async update(req, res) {
    try {
      const { restaurant_id, table_number, table_capacity } = req.body;
      const table = await Table.findByPk(req.params.id);
      if (!table) return res.status(404).json({ error: 'Table not found' });
      await table.update({ restaurant_id, table_number, table_capacity });
      return res.json(table);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: 'Failed to update table' });
    }
  },

  // DELETE /api/tables/:id
  async destroy(req, res) {
    try {
      const table = await Table.findByPk(req.params.id);
      if (!table) return res.status(404).json({ error: 'Table not found' });
      await table.destroy();
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete table' });
    }
  }
};
