const router = require('express').Router();
// require all exports from models folder
const { Product, Category, Tag, ProductTag } = require ('../../models');

//api/products endpoint

//get all products
router.get('/', (req, res) => {

});

// get product by id
router.get('/:id', (req, res) => {

})

// create new product 
router.post('/', (req, res) => {


Product.create(req.body)
.then((product) => {
    if (req.body.tagIds.length){
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
            return {
                product_id: product.id,
                tag_id,
            };
        });
        return ProductTag.bulkCreate(productTagIdArr);
    }
    res.status(200).json(product);
})
.then((productTagIds) => res.status(200).json(productTagIds))
.catch((err) => {
    console.log(err);
    res.status(400).json(err)
});    
});

// update product
router.put('/:id', (req, res) => {
    // defines what product to update by given parameters 
    Product.update(req.body, {
        where: {
            id: req.params.id,
        },
    })
    .then((product) => {
        // finds all products with parameters 
        return ProductTag.findAll({ where: { product_id: req.params.id }});
    })
    .then((productTagIds) => {
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
            return {
                product_id: req.params.id,
                tag_id,
            };
        });
        const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

        return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags)
        ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
        res.status(400).json(err);
    })
});

router.delete('/:id', (req, res) => {

});

module.exports = router;