let product=(function(){
    let data;
    let top=document.getElementById("top");
    let bottom=document.getElementById("bottom");
   //1.获取数据
   function getData(){
      //1.创建核心对象
      let xhr=new XMLHttpRequest;
      //2.注册监听
      xhr.onreadystatechange=function(){
          //状态值 4   状态码 200
          if(xhr.readyState===4&&xhr.status===200){
               //responseText接收
                //console.log(xhr.responseText);
                data=JSON.parse(xhr.responseText);
                console.log(data);
          }
      }
      //3. 建立连接
      xhr.open("GET","data.json",false);
      //4.发送数据
      xhr.send(null);
   }
   //2.渲染页面
   function render(){
       let allcount=0;//商品总个数
       let allprice=0;//商品总价
       let highprice=[0];//最贵的商品单价
       //渲染顶部
        let str="";
        data.forEach((item)=>{
           let {id,count,price}=item;
           str+=`<div class="row" id="${id}">
                    <img src="./img/add.png" alt="" class="add">
                    <span>${count}</span>
                    <img src="./img/sub.png" alt="" class="reduce">
                    <p>单价：${price}元    小计：${count*price}元</p>
                </div>`;
            allcount+=count;
            allprice+=count*price
            if(count>0){//要把买了商品的单价放进去
                highprice.push(price);
            }
        })
        top.innerHTML=str;

        //console.log(highprice);
        //${Math.max(...highprice)}

       //渲染底部
        let stra=`<p>商品合计：<span>${allcount}</span> 件</p>
        <p>共花费了：<span>${allprice}</span> 元</p>
        <p>其中最贵的商品单价是：<span>${Math.max.apply(null,highprice)}</span> 元</p>`;
        bottom.innerHTML=stra;

   }
   //3.功能部分
   function handle(){
     top.onclick=function(e){//event对象
        // console.log(e.target);//e.target 可以获取top里具体点击的某一项
        // console.log(e.target.tagName);//e.target.tagName 获取具体的标签名字
        if(e.target.tagName==="IMG"){//判断只有点击的标签是Img,我才修改数据
            //console.log(e.target.parentNode.id);
            //1.先查找id,通过我们的id来找出具体的数据
            let aid=parseInt(e.target.parentNode.id);
            //console.log(typeof aid);
            //2.通过我们的id来找出具体的数据
            let newdata=data.find(item=>item.id===aid);
            if(!newdata){return;}//如果我没有查找到数据 undefiend ,停下来
            //console.log(newdata);
            //console.log(e.target.className);//通过e.target.className获取我点击元素的class的值
            if(e.target.className==="add"){//加
                newdata.count++;
            }else{//减
                newdata.count--;
                if(newdata.count<=0){
                    newdata.count=0;
                }
            }
            render();
        }
     }
   }
   return {
      init(){
        getData();
        render();
        handle();
      }
   }
})()

product.init();
