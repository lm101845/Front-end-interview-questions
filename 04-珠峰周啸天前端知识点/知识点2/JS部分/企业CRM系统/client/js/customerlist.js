(function(){
	//1.获取问号传递的参数，区分我的客户(?lx=my)和全部客户(?lx=all)
    //console.log(location.search);//?lx=my  或 ?lx=all
    //2.只要 all / my----utilts.js中的方法，求出
    let lx=location.search.queryParams("lx");
    let selectBox=document.querySelector(".selectBox");//下拉列表
    let searchInp=document.querySelector(".searchInp");//搜索框
    let tableBox=document.querySelector(".tableBox tbody");//表格体
    let pageBox=document.querySelector(".pageBox");//页码区域
    let limit=10,page=1;

    //获取数据+渲染页面
    async function getData(){
        let type=selectBox.value;
        let search=searchInp.value.trim();
        
        let {code,data,totalPage} = await axios.get("/customer/list",{
            params:{
                lx,
                type,
                search,
                limit,
                page
            }
        })

        if(+code!==0){return}
        //1.渲染表格数据
        let str="";
        data.forEach(item => {
            let {id,name,sex,email,phone,weixin,QQ,type,userName,address}=item;
            str+=` <tr>
                <td class="w8">${name}</td>
                <td class="w5">${+sex===0?"男":"女"}</td>
                <td class="w10">${email}</td>
                <td class="w10">${phone}</td>
                <td class="w10">${weixin}</td>
                <td class="w10">${QQ}</td>
                <td class="w5">${type}</td>
                <td class="w8">${userName}</td>
                <td class="w20">${address}</td>
                <td class="w14">
                    <a href="customeradd.html?customerId=${id}">编辑</a>
                    <a href="javascript:void(0);" data-id="${id}">删除</a>
                    <a href="visit.html?customerId=${id}">回访记录</a>
                </td>
           </tr>`
        });
        tableBox.innerHTML=str;

        //2.页码渲染
        let str2="";

        if(page>1){//页码大于1，就有 上一页
            str2+=`<a href="javascript:;">上一页</a>`
        }
       
        if(totalPage>1){//如果只有1页的数据，就不显示页码了
            str2+=`<ul class="pageNum">`
            for(let i=1;i<=totalPage;i++){
                str2+=`<li class="${page==i?'active':''}">${i}</li>`
            }
            str2+=`</ul>`
        }
       
        if(page<totalPage){//比最后1页小就有 下一页
            str2+=`<a href="javascript:;">下一页</a>`
        }
        pageBox.innerHTML=str2;
    }
    getData()

    //功能部分
    //1.下拉列表筛选
    selectBox.onchange=function(){
        page=1;//每次筛选要从第一页开始
        getData();//重新获取 type的值，获取数据，渲染页面
    }

    //2.搜索功能
    searchInp.onkeydown=function(e){
         if(e.keyCode==13){
            page=1;//每次搜索要从第一页开始
            getData();////重新获取 search的值，获取数据，渲染页面
            searchInp.value="";//搜索完成后 清除搜索框的内容
         }
    }
    
    //3.点击页码
    pageBox.onclick=function(e){
        //上一页
       if(e.target.tagName=="A"&&e.target.innerHTML=="上一页"){
          page--;
       }
       //页码
       if(e.target.tagName=="LI"){
          page = +e.target.innerHTML;
       }
       //下一页
       if(e.target.tagName=="A"&&e.target.innerHTML=="下一页"){
          page++;
       }
       getData();
    }

    //4.删除功能
    tableBox.onclick=async function(e){
        if(e.target.tagName==="A"&&e.target.innerHTML==="删除"){
            let id= +e.target.getAttribute("data-id");
            if(confirm(`你确定要删除${id}吗？`)){//确定 true   取消 false
               let {code}=await axios.get("/customer/delete",{
                  params:{
                    customerId:id
                  }
               }) 
               if(+code!==0){
                  alert("删除失败，请重试")
               }else{
                  alert("恭喜你删除成功！")
                  getData();//重新获取数据,渲染页面
               }
            }
        }
    }

})()