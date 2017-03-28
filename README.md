# 手势密码组件
## 要求
-  设置密码
-  密码长度太短
-  再次输入密码
-  两次密码输入不一致
-  密码设置成功，更新 localStorage
-  验证密码-不正确，重置为等待用户输入。
-  验证密码-正确

## 思路
此作业大概分为以下部分：
- 九宫格制作
- 触摸事件
- 手势连线
- 组件流程
- `localStorage`
### 九宫格
九宫格采用`canvas`绘制，使用`arc()`方法绘制圆形，所以需要先设定好九个圆的圆心。

![](http://i.imgur.com/5zv3XKU.png)

本文先设定圆的半径`R`及起始点`(OffsetX,OffsetY)`，然后计算出余下所有点的坐标，存入数组`pointLocation`中。
### 触摸事件
js中对于触摸事件，主要有：
- `touchstart`
- `touchmove`
- `touchend`

而以上三个事件还包含了一个表示当前跟踪的触摸操作的 Touch 对象的数组`touches`。在`touchmove`事件中需调用`preventDefault`防止滚动。

### 手势连线
手势连线过程需在监听触摸事件发生时调用。首先需要模拟触摸圆点时`isSelected()`情况，将触摸过圆点的序号存入`linePoint`中，然后调用`draw()`划线并模拟触摸后圆点的样式
### 组件流程
组件判断密码流程如下图

![](http://upload-images.jianshu.io/upload_images/2054965-fec9fa0ce6989f30.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### localStorage
使用`localStorage`存储每次触摸后`linePoint`数组，然后在再次输入和验证密码时，调用`localStorage`判断与现输入密码是否一致。如果输入有误、再次输入和验证错误的情况时，清空`localStorage`。
