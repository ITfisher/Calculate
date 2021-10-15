

//监听按钮并在屏幕上显示出来
//其中“←”按钮实现退格，AC实现清零
var show_num = "";
var count_string = 0;
var arr = document.getElementsByTagName('button');
for (var i = 0; i < arr.length; i++) {
	arr[i].onclick = function () {
		if (this.id != "CE" && this.id != "AC" && this.id != "=") {
			show_num = show_num + this.id;
			count_string++;
			document.getElementById("show_panel").innerHTML = show_num;
		}
		else if (this.id == "CE") {
			if (count_string > 0) {
				count_string--;
				show_num = show_num.substring(0, count_string);
				document.getElementById("show_panel").innerHTML = show_num;
			}
			else {
				document.getElementById("show_panel").innerHTML = show_num;
			}
		}
		else if (this.id == "AC") {
			show_num = "";
			document.getElementById("show_panel").innerHTML = show_num;
			count_string = 0;
		}
		else if (this.id == "=") {
			var temp_reg = /[\-\+×÷]/;


			for (var num_s = 0; num_s < count_string - 1; num_s++) {
				if (temp_reg.test(show_num.charAt(num_s)) && temp_reg.test(show_num.charAt(num_s + 1))) {
					alert("输入有误，无法帮您计算");
					document.getElementById("show_panel").innerHTML = "";
					show_num = "";
					count_string = 0;
					return;
				}

			}
			show_num = show_num + this.id;
			calNum(show_num);
			show_num = "";
			count_string = 0;
		}

	}
}


/*中序转后序（逆波兰表达式）
遍历字符串
（1）** 如果遇到的是数字，我们直接加入到栈S1中；**
（2）** 如果遇到的是左括号，则直接将该左括号加入到栈S2中；**
（3）** 如果遇到的是右括号，那么将栈S2中的运算符出栈加入到栈S1中，直到S2中遇到左括号，并将左括号从S2中丢弃，其中左括号不进入S1中；**
（4）** 如果遇到的是运算符，包括负号，我们按照下面的规则进行操作：**
	1。如果此时栈S2为空，则直接将运算符加入到栈S2中；
	2.如果此时栈S2不为空，当前遍历的运算符的优先级大于等于栈顶运算符的优先级，那么直接入栈S2；
	3.如果此时栈S2不为空，当前遍历的运算符的优先级小于栈顶运算符的优先级，则将栈顶运算符一直出栈加入到栈S1中，
	  直到栈为空或者遇到一个运算符的优先级小于等于当前遍历的运算符的优先级，此时将该运算符加入到栈S2中；
（5）** 直到遍历完整个中序表达式之后，栈S2中仍然存在运算符，那么将这些运算符依次出栈加入到栈S1中，直到栈为空。**

   计算逆波兰表达式
遍历栈S1
（1）** 如果遇到的是数字，那么直接将数字压入到S3中；**
（2）** 如果遇到的是单目运算符(即负号)，那么取S3栈顶的一个元素进行单目运算之后，将结果再次压入到栈S3中；**
（3）** 如果遇到的是双目运算符，那么取S3栈顶的两个元素进行，首先出栈的在左，后出栈的在右进行双目运算符的计算，将结果再次压入到S3中。**

*/
function calNum(show_num) {
	var s1 = new Array();
	var s2 = new Array();
	var s3 = new Array();
	var num_sum = "";
	var reg = /\d+/;
	var regSingle = /\-/;
	//S1存放数字
	for (var j = 0; j < show_num.length; j++) {

		if (reg.test(show_num.charAt(j)) || show_num.charAt(j) == ".") {
			num_sum += show_num.charAt(j);
		}
		else {
			s1.push(parseFloat(num_sum));
			num_sum = "";

			if (s2.length == 0) {
				s2.push(show_num.charAt(j));
			}
			else {
				//如果s2不为空，判断运算符优先级
				var sTopElem = s2[s2.length - 1];
				var curElem = show_num.charAt(j);
				//如果当前优先级大于栈顶优先级，直接入s2
				if (judgePriority(curElem, sTopElem)) {
					s2.push(curElem);
				}
				else {
					//堆栈不为空，当前元素不小于栈顶元素优先级，一直从s2出栈到s1
					while (!judgePriority(curElem, sTopElem) && s2.length !== 0) {
						s1.push(s2.pop());
					}
					//不满足上面条件，再把当前符号入栈s2
					s2.push(show_num.charAt(j));
				}
			}
		}
		//计算逆波兰堆栈
		if (show_num.charAt(j) == "=") {
			s2 = [];
			//清空计数器
			count = 0;
			//遍历s1
			for (var i = 0; i < s1.length; i++) {
				//如果当前为数字，直接入栈s3
				if (reg.test(s1[i])) {
					s3.push(parseFloat(s1[i]));
				}
				else if (regSingle.test(s1[i])) {
					if (s1[i] == "-") {
						var mmm = -parseFloat(s3.pop());
						s3.push(mmm);
					}
				}
				else {
					if (s1[i] == "+") {
						var num_two = s3.pop();
						var num_one = s3.pop();
						var result_temp = addFunction(num_one, num_two);
						s3.push(result_temp);
					}
					if (s1[i] == "-") {
						var num_two = s3.pop();
						var num_one = s3.pop();
						var result_temp = subFunction(num_one, num_two);
						s3.push(result_temp);
					}
					if (s1[i] == "×") {
						var num_two = s3.pop();
						var num_one = s3.pop();
						var result_temp = multiFunction(num_one, num_two);
						s3.push(result_temp);
					}
					if (s1[i] == "÷") {
						var num_two = s3.pop();
						var num_one = s3.pop();
						var result_temp = divFunction(num_one, num_two);
						s3.push(result_temp);
					}
					if (s1[i] == "%") {
						var num_two = s3.pop();
						var num_one = s3.pop();
						var result_temp = num_one % num_two;
						s3.push(result_temp);
					}
				}
			}
			//清空逆波兰
			s1 = [];
			//最终结果s3
			if (s3.length == 1) {

				//判断结果是否非法
				if (isNaN(s3[0])) {
					alert("输入有误，无法帮您计算");
					s3 = [];
				}
				else {

					document.getElementById("show_panel").innerHTML = s3[0];
				}
			}
			else {
				result = addFunction(s3[1], s3[0]);
				if (isNaN(result)) {
					alert("输入有误，无法帮您计算");
					s3 = [];
				}
				else {
					document.getElementById("show_panel").innerHTML = result;
				}
			}
		}

	}
}

var signPriority = [["+", "-"], ["×", "÷", "%"], ["-"]];
//判断当前运算符与栈顶运算符优先级
function judgePriority(sign1, sign2) {
	var index1, index2;
	for (var i = signPriority.length - 1; i >= 0; i--) {
		for (var j = signPriority[i].length - 1; j >= 0; j--) {
			if (sign1 == signPriority[i][j]) {
				index1 = i;
			}
			if (sign2 == signPriority[i][j]) {
				index2 = i;
			}
		}
	}
	if (index1 > index2) {
		return true;
	} else {
		return false;
	}
}








/*
*重写加减乘除四种算法
*精确计算值的大小，解决浮点数不精确的问题
*/
function addFunction(num_one, num_two) {

	var t1, t2, t3, t4;
	try {
		t1 = num_one.toString().split(".")[1].length;
	}
	catch (e) {
		t1 = 0;
	}
	try {
		t2 = num_two.toString().split(".")[1].length;
	}
	catch (e) {
		t2 = 0;
	}
	t3 = Math.abs(t1 - t2);
	t4 = Math.pow(10, Math.max(t1, t2));
	// alert(num_two*t4);
	if (t3 > 0) {
		var t5 = Math.pow(10, t3);
		if (t1 > t2) {
			num_one = Number(num_one.toString().replace(".", ""));
			num_two = Number(num_two.toString().replace(".", "")) * t5;
		} else {
			num_one = Number(num_one.toString().replace(".", "")) * t5;
			num_two = Number(num_two.toString().replace(".", ""));
		}
	} else {
		num_one = Number(num_one.toString().replace(".", ""));
		num_two = Number(num_two.toString().replace(".", ""));
	}
	return (num_one + num_two) / t4;
	/*********以下方法无法解决浮点计算精确度问题，待解决分析原因**********/
	// t3 = Math.pow(10, Math.max(t1, t2));
	// alert(num_one*t3);
	// alert(num_two*t3);
	// alert(num_one*t3 + num_two*t3);
	// alert((num_one*t3 + num_two*t3) / t3);
	// return (num_one*t3 + num_two*t3) / t3;
	/**************************************************/
}

function subFunction(num_one, num_two) {
	var t1, t2, t3, t4;
	try {
		t1 = num_one.toString().split(".")[1].length;
	}
	catch (e) {
		t1 = 0;
	}
	try {
		t2 = num_two.toString().split(".")[1].length;
	}
	catch (e) {
		t2 = 0;
	}

	t3 = Math.abs(t1 - t2);
	t4 = Math.pow(10, Math.max(t1, t2));
	if (t3 > 0) {
		var t5 = Math.pow(10, t3);
		if (t1 > t2) {
			num_one = Number(num_one.toString().replace(".", ""));
			num_two = Number(num_two.toString().replace(".", "")) * t5;
		} else {
			num_one = Number(num_one.toString().replace(".", "")) * t5;
			num_two = Number(num_two.toString().replace(".", ""));
		}
	} else {
		num_one = Number(num_one.toString().replace(".", ""));
		num_two = Number(num_two.toString().replace(".", ""));
	}
	return (num_one - num_two) / t4;
}

function multiFunction(num_one, num_two) {
	var t1, t2;
	try {
		t1 = num_one.toString().split(".")[1].length;
	}
	catch (e) {
		t1 = 0;
	}
	try {
		t2 = num_two.toString().split(".")[1].length;
	}
	catch (e) {
		t2 = 0;
	}
	num_one = Number(num_one.toString().replace(".", ""));
	num_two = Number(num_two.toString().replace(".", ""));
	return (num_one * num_two) / (Math.pow(10, t1 + t2));
}

function divFunction(num_one, num_two) {
	var t1, t2;
	try {
		t1 = num_one.toString().split(".")[1].length;
	}
	catch (e) {
		t1 = 0;
	}
	try {
		t2 = num_two.toString().split(".")[1].length;
	}
	catch (e) {
		t2 = 0;
	}
	num_one = Number(num_one.toString().replace(".", ""));
	num_two = Number(num_two.toString().replace(".", ""));
	var temp_div_result = num_one / num_two;
	return multiFunction(temp_div_result, Math.pow(10, t2 - t1));//此处算法存在问题，MARK
}
