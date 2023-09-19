// axios.post("http://127.0.0.1:9999/user/login",{
// 	account:"18310612838",
//     password:md5("1234567890")	
// },{
// 	transformRequest:function(data){
// 		return Qs.stringify(data)
// 	}
// }).then(response=>{
// 	return response.data;
// }).then(value=>{
// 	console.log(value);
// }).catch(err=>{
// 	console.log(err);
// })

// axios.post("/user/login",{
// 	account:"18310612838",
//     password:md5("1234567890")	
// }).then(value=>{
// 	console.log(value);
// }).catch(err=>{
// 	console.log(err);
// })

async function getData(){
	let result=await axios.post("/user/login",{
					account:"18310612838",
					password:md5("1234567890")	
				})
				
    if(+result.code===0){
		console.log("获取数据成功");
		console.log(result.info);
	}
}

getData()