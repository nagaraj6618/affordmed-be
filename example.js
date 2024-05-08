const router = require('express').Router();
const axios = require('axios');

let token = '';
const companyApi = "http://20.244.56.144/test";

// Middleware function to handle pagination
const paginateResults = (page, pageSize) => {
    const offset = (page - 1) * pageSize;
    return { offset, limit: pageSize };
};

// Function to generate custom unique identifier for products
const generateProductId = (product) => {
    // Implement your logic to generate a unique identifier for each product
    return `${product.company}-${product.id}`;
};

// Register endpoint
router.post('/auth/register', async (req, res) => {
    try {
        const userData = req.body;
        const response = await axios.post(`${companyApi}/auth`, userData);
        token = response.data.access_token;
        res.status(200).json({ data: response.data });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// GET endpoint to retrieve top 'n' products within a category
router.get('/categories/:categoryname/products', async (req, res) => {
    try {
        const { categoryname } = req.params;
        const { n = 10, page = 1, sort = 'rating', order = 'desc' } = req.query;

        // Calculate offset and limit for pagination
        const { offset, limit } = paginateResults(page, parseInt(n));

        // Make request to fetch products
        const response = await axios.get(`${companyApi}/categories/${categoryname}/products`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                top: n,
                offset,
                minPrice: 1,
                maxPrice: 10000,
                sort,
                order
            }
        });

        // Generate custom unique identifiers for products
        const productsWithId = response.data.map(product => ({
            ...product,
            productId: generateProductId(product)
        }));

        res.status(200).json({ data: productsWithId });
    } catch (error) {
        res.status(500).json({ Error: error });
    }
});

// GET endpoint to retrieve details of a specific product
router.get('/categories/:categoryname/products/:productid', async (req, res) => {
    try {
        const { categoryname, productid } = req.params;

        // Extract company and product ID from custom product ID
        const [company, productId] = productid.split('-');

        // Make request to fetch product details
        const response = await axios.get(`${companyApi}/companies/${company}/categories/${categoryname}/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        res.status(200).json({ data: response.data });
    } catch (error) {
        res.status(500).json({ Error: error });
    }
});

module.exports = router;
