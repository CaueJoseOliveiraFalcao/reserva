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


  // POST /api/tables
  async create(req, res) {
    const { restaurant_id, table_number, table_capacity } = req.body;
    console.log(restaurant_id, table_number, table_capacity);
    try {
        const restaurant = await Restaurant.findOne({
            where : {
                id : restaurant_id
            },
            include : [Table],
        });
        const table = await Table.findOne({
            where : {
                restaurant_id,
                table_number
            }
        });
        if(table){
            return res.status(404).json({message : 'mesa ja existe'});
        }
        if(!restaurant){
          return res.status(404).json({message : 'usuario nao encontrado'});
      }
        const newTable = await Table.create({ restaurant_id, table_number, table_capacity });
        newTable.save();
        return res.status(200).send(message = 'mesa criada com sucesso');
    }catch(err){
        return res.status(404).json({message : 'usuario nao encontrado'});
    }

    },

  // PUT /api/tables/:id
  async update(req, res) {
    try {
      const { restaurant_id, table_id, table_number, table_capacity } = req.body;
      const restaurant = await Restaurant.findOne({
          where : {
              id : restaurant_id
          },
      });
      if(!restaurant){
        return res.status(404).json({message : 'usuario nao encontrado'});
      }
      const table = await Table.findOne({
        where: {
          id: table_id,
        }
      });

      if (!table) return res.status(404).json({ error: 'Table not found' });

      await table.update({ restaurant_id, table_number, table_capacity });

      return res.status(200).send(message = 'mesa alterada com sucesso');
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: 'Failed to update table' });
    }
  },

  // DELETE /api/tables/:id
  async destroy(req, res) {
    const { restaurant_id, table_id } = req.body;
    console.log(restaurant_id, table_id);
    try {
        const restaurant = await Restaurant.findOne({
          where : {
              id : restaurant_id
          },
      });
      if(!restaurant){
      return res.status(404).json({message : 'usuario nao encontrado'});
    }
      const table = await Table.findOne({
        where: {
          id: table_id,
        }
      });
      if (!table) return res.status(404).json({ error: 'Table not found' });

      await table.destroy();
      return res.status(200).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete table' });
    }
  }
};
