# Calculate
基于html、css、javascript开发的简单计算器

# 实现思路
- 关于JS 功能部分，具有几大问题：
- 解决按钮监听事件
- 实现基本算法运算运算
- 实现加减乘除的优先级
- 关于浮点数计算精度问题的解决方案
- 关于输入的式子是否有效要进行判断

     对于按钮监听事件，我采用getElementsByTagName('button')来获取所有的按钮变量，通过遍历所有按钮变量，并通过onclick函数来监听特定按钮的事件，显示区域显示一个string类型的字符串，通过操作string类型字符串的变化来实现显示区域内容的变化。例如按钮为数字或者加减乘除等操作，则string字符串只需添加字符即可；若按钮为退格，则字符串通过substring()方法抛弃最后一个字符；若按钮为清零，则字符串清空；若按钮为等号，则字符串进行运算操作后返回结果再赋给字符串即可。而由于无论对字符串进行何种操作，显示区域一直显示字符串内容即可，就能实现实时修改数据并在显示区域显示出来。

     要想实现基本算法运算，则通过遍历字符串，并且分割识别出符号和数据内容，将其进行相对应操作即可实现。

难点在于如何实现运算的优先级操作，这涉及到逆波兰表达式的转换。逆波兰表达式将字符串的表达式中序转后序，那么字符串就可以按照顺序进行加减乘除操作而不会出现优先级错误问题。
逆波兰表达式转换规则：
遍历字符串
（1）如果遇到的是数字，我们直接加入到栈S1中；
（2）如果遇到的是左括号，则直接将该左括号加入到栈S2中；
（3）如果遇到的是右括号，那么将栈S2中的运算符出栈加入到栈S1中，直到S2中遇到左括号，并将左括号从S2中丢弃，其中左括号不进入S1中；
（4）如果遇到的是运算符，包括负号，我们按照下面的规则进行操作：
	 a. 如果此时栈S2为空，则直接将运算符加入到栈S2中；
	b.如果此时栈S2不为空，当前遍历的运算符的优先级大于等于栈顶运算符的优先级，那么直接入栈S2；
	c.如果此时栈S2不为空，当前遍历的运算符的优先级小于栈顶运算符的优先级，则将栈顶运算符一直出栈加入到栈S1中，

	  直到栈为空或者遇到一个运算符的优先级小于等于当前遍历的运算符的优先级，此时将该运算符加入到栈S2中；
（5）直到遍历完整个中序表达式之后，栈S2中仍然存在运算符，那么将这些运算符依次出栈加入到栈S1中，直到栈为空。
转换后，对于逆波兰表达式的计算问题，则需要如下规则：
遍历栈S1
（1）如果遇到的是数字，那么直接将数字压入到S3中；
（2）如果遇到的是单目运算符(即负号)，那么取S3栈顶的一个元素进行单目运算之后，将结果再次压入到栈S3中；
（3）如果遇到的是双目运算符，那么取S3栈顶的两个元素进行，首先出栈的在左，后出栈的在右进行双目运算符的计算，将结果再次压入到S3中。
以上，实现了式子优先级算法的计算。
接着，对于浮点数问题，由于显示的是十进制数据而要在计算机内部运行，则计算机会把十进制数据用二进制来表示，则会出现某些十进制小数的数据无法通过二进制精确表示，只能用一个无限接近的数据来表示，故会出现浮点数计算不精确的问题。

想要解决此类问题，只能在运算之前先将小数扩大为整数进行运算后再缩小相同的倍数即可解决。这中间有个巨大的问题就是，在将小数扩大为整数时不能直接乘上10的n次方，因为此时也涉及到小数的运算，故必须用replace(".", "")方法将小数去掉，同时计算原小数的位数，在计算结果出来后进行缩放。

对于式子有效性的判断，即在输入“=”后，先遍历字符串判断式子是否有效，当式子无效时直接退出，并提示用户，若式子有效则进行运算。

以上，计算器的大致思路就完善了。
