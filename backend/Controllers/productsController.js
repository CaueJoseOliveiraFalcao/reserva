const db = require('../Models');

const Restaurant = db.Restaurant;
const Product = db.Product;

const show = async (req , res) => {
    const {userId} = req.query;
    try {
        const user = await Restaurant.findOne({
            where : {id : userId},
            include : [Product],
        })
        return res.status(200).send(user.products);
    }catch(err){
        return res.status(404).json({message : 'usuario nao encontrado'});
    }
}
const create = async (req , res) => {
    const  {userId , ProductName , ProductDescription , ProductValue} = req.body

    try {
        const user = await Restaurant.findOne({
            where : {id : userId},
        })

        if (user){
            try {
                const search = await Product.findOne({
                    where : {name : ProductName},
                })
                if (!search){
                    const product = await Product.create({
                        restaurant_id : user.id,
                        name : ProductName,
                        description : ProductDescription,
                        price : ProductValue
                    });
                    return res.status(200).json({message : 'foi'});
                }else{
                    return res.status(404).json({message : 'nome ja utilizado'});

                }
            }
            catch(err){
                return res.status(500).json({message : 'product error'});
            }
        }
    }
    catch(err){
        return res.status(404).json({message : 'usuario nao encontrado '});
    }
}
const edit = async (req , res) => {
    return console.log(res);
}
const destroy = async (req , res) => {
    return console.log(res);
}


module.exports = {
    show,
    create,
    edit,
    destroy
};