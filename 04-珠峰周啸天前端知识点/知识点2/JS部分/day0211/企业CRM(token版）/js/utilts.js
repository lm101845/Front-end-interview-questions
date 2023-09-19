String.prototype.queryParams=function queryParams(attr){
   // console.log(this);
    let obj={};
    let self=this;
    self.replace(/([^?=&#]+)=([^?=&#]+)/g,(_,$1,$2)=>{
       // console.log($1,$2);
        obj[$1]=$2;
    })
    //console.log(obj);
    //obj[attr]-->obj["lx"]
    return attr!=undefined?obj[attr]:obj;
}

