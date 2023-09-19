# CSS 选择器有哪些？哪些属性可以继承以及优先级的计算

#  CSS 选择符

id 选择器(#myid)、

类选择器(.myclassname)、

标签选择器(div, h1, p)、

相邻选择器(h1 + p)、

子选择器（ul > li）、

后代选择器（li a）、

通配符选择器（\*）、

属性选择器（a[rel="external"]）、

伪类选择器（a:hover, li:nth-child）

# 可继承的属性

font-size, font-family, color

# 不可继承的样式

border, padding, margin, width, height

# 优先级（就近原则）

!important > [ id > class > tag ]

!important 比内联优先级高

# CSS 优先级算法如何计算

选择器的特殊性值表述为4个部分，用0,0,0,0表示。

ID 选择器的特殊性值，加 0,1,0,0。

类选择器、属性选择器或伪类，加 0,0,1,0。

元素和伪元素，加 0,0,0,1。

通配选择器\*对特殊性没有贡献，即 0,0,0,0。

最后比较特殊的一个标志!important（权重），它没有特殊性值，但它的优先级是最高的，为了方便记忆，可以认为它的特殊性值为 1,0,0,0,0。

例如：以下规则中选择器的特殊性分别是：

```
 a{color: yellow;} /_特殊性值：0,0,0,1_/
 div a{color: green;} /_特殊性值：0,0,0,2_/
 .demo a{color: black;} /_特殊性值：0,0,1,1_/
 .demo input[type="text"]{color: blue;} /_特殊性值：0,0,2,1_/
 .demo *[type="text"]{color: grey;} /*特殊性值：0,0,2,0*/
 #demo a{color: orange;} /*特殊性值：0,1,0,1*/
 div#demo a{color: red;} /*特殊性值：0,1,0,2\*/
<a href="">第一条应该是黄色</a> <!--适用第1行规则-->
<div class="demo">
 <input type="text" value="第二条应该是蓝色" /><!--适用第4、5行规则，第4行优先级高-->
 <a href="">第三条应该是黑色</a><!--适用第2、3行规则，第3行优先级高-->
</div>
<div id="demo">
 <a href="">第四条应该是红色</a><!--适用第6、7行规则，第7行优先级高-->
</div>
```