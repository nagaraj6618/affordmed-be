const router = require('express').Router();
const axios = require('axios');
let token = ''
const companyApi = "http://20.244.56.144/test"
// const userData = {
//    companyName: "saveetha",
//    clientID: "53aa431e-ffec-490f-8aaf-3be6e1c2b7e9",
//    clientSecret: "KwkfsVERuelhjRpY",
//    ownerName: "Nagaraj",
//    ownerEmail: "nagaraj516700@gmail.com",
//    rollNo: "212221040109"
// }
router.post('/auth/register',async(req,res) => {
   try{
      console.log(req.body.userData)
      const userData = req.body.userData;
  
      const response = await axios.post(`${companyApi}/auth`,
      userData)
      token = response.data.access_token;
      console.log(token)
      res.status(200).json({data:response.data});
   }
   catch(error){
      res.status(500).json({error:error})
   }
})

router.get('/comapines/:companyname/categories/:categoryname/products/:n',async(req,res) => {
   try{
      console.log(req.headers);
      const { page = 1 } = req.query;
      const offset = (page - 1) * 10;
      const response = await axios.get(`${companyApi}/companies/${req.params.companyname}/categories/${req.params.categoryname}/products`,{
         headers: {
            Authorization: `Bearer ${token}`
         },
         params: {
            top: req.params.n,
            offset, 
            minPrice: 1,
            maxPrice: 10000
        }
      });
      res.status(200).json({data:response.data,offset:offset});
   }
   catch(error){
      res.status(500).json({Error:error})
   }
})

module.exports = router;