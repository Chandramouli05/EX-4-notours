class APIFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filter(){
        // 1A) Filtering
      const queryObj = {...this.queryString};
      const excludedFields = ['page','sort','limit','fields'];
      excludedFields.forEach(el => delete queryObj[el]);

      // 1B) Advanced Filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
      console.log(JSON.parse(queryStr));

      this.query = Tour.find(JSON.parse(queryStr));

      return this;
    }

    
    // 2) Sorting
    sort(){

      if(this.queryString.sort){
        const sortBy = this.queryString.sort.split(',').join(' ');
        console.log(sortBy);

        this.query = this.query.sort(sortBy);
      }else{
        this.query = this.query.sort('-createdAt');
      }
      return this;
    }

   // 3)  Field Limiting

   field(){
    if(this.queryString.fields){
        const fields = this.queryString.fields.split(',').join('');
        this.query = this.query.select('name duration price');
      }else {
        this.query = this.query.select('-___v');
      }
      return this;
   }

  // 4) Pagination

  pagination(){
     const page = this.queryString.page*1 || 1;
     const limit = this.queryString.limit*1 || 100;
     const skip = (page - 1)*limit;

     this.query = this.query.skip(skip).limit(limit);
     return this;
  }
  
}

module.exports = APIFeatures;