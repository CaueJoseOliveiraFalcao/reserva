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
    const {EditId , EditName , EditValue , EditDescription} = req.body;

    try {
        const product = await Product.findOne({
            where : {id : EditId}
        })
        console.log(product);
        product.name = EditName;
        product.price = EditValue;
        product.EditDescription = EditDescription;
        product.save();
        return res.status(200).json({message : 'foi'});

    }catch(Err){
        console.log(Err);
        return res.status(404).json({message : 'nao encontrado'});
    }
}
const destroy = async (req , res) => {
    const productId =req.body.productId;

    try {
        const product = await Product.findOne({
            where : {
                id : productId
            }
        })
        if (product){
            await product.destroy();
            return res.status(200).json({message : 'produto deletado'});
    
        }
        return res.status(404).json({message : 'produto nao encontrado'});

    }catch(err){
        return res.status(500).json({message : 'error'});
    }
}


module.exports = {
    show,
    create,
    edit,
    destroy
};