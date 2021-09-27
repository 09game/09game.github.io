if (typeof (document.onselectstart) != 'undefined') {
    document.onselectstart = function (event) { if (event.target.tagName != 'INPUT') { return false; } }
} else {
    document.onmousedown = function (event) { if (event.target.tagName != 'INPUT') { return false; } }
    document.onmouseup = function (event) { if (event.target.tagName != 'INPUT') { return false; } }
};
window.getCookie = function (objName) {
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName) return unescape(temp[1]);
    }
}
window.getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
window.b_q_account = function () {
    let account = $.trim($('.account input').val()), e_html = ``;
    if (account == '') {
        e_html = `<span></span>`;
    } else {
        $.ajax({
            url: `http://users.09game.com/home/GetRechargeUserByAccount?Account=${account}`,
            async: false,
            success(res) {
                console.log(res);
                if (res == null) {
                    e_html = `<span>无此用户，请重新输入！</span>`;
                } else if (res.err) {
                    e_html = `<span>${res.err}</span>`;
                } else {
                    if (token) {
                        a_html = `
						<div class="ac_input out">
							<div class="self un">${u.user_name}</div>
							<div>
								<p>充值账号：<span>${account}</span></p>
								<p>平台昵称：<span>${res.user_name}</span></p>
								<p class="change">更换</p>
							</div>
						</div> 
					`
                    } else {
                        a_html = `
							<div class="ac_input out">
								<p>充值账号：<span>${account}</span></p>
								<p>平台昵称：<span>${res.user_name}</span></p>
								<p class="change">更换</p>
							</div> 
						`
                    }
                    t_n = res.user_name;
                    pay.user_id = 0;
                    pay.name = res.user_name;
                }
            }
        })
    }
    if (e_html == '') {
        $('.account .inner').html(a_html);
    } else {
        $('.ac_input.in .other span').remove();
        $('.ac_input.in .other').append(e_html);
    }
}
window.k_q_account = function (e) {
    if (e.keyCode == 13) {
        b_q_account();
    }
}
let token = getQueryString('token') ? getQueryString('token') : getCookie('09auth') ? getCookie('09auth') : null; //let token = getCookie('09auth') ? getCookie('09auth') : getQueryString('token') ? getQueryString('token') : null;
let t_url = 'http://09pay.09game.com';//'http://192.168.1.173:6002';
let u = {};
let s_html = ``, a_html = ``, t = null, orderNo = null, pay = { name: '', user_id: 0, total_fee: 100, payWay: 1 }, t_n = '';
// token = null
if (token == null) {
    s_html = `
		<div class="unlogin">
			<div><p>当前账号：<span>未登录</span></p><a href="http://www.09game.com/html/usercenter2020/login.html?returnurl=http://09pay.09game.com">点击登录</a></div>
			<div>登陆后查看自己的酒币余额及贵宾特权等级</div>
		</div>
	`;
    a_html = `
		<div class="ac_input in">
			<div>
				<label>充值账号：</label><input type="text">
			</div>
		</div>
	`;
} else {
    $.ajax({
        url: `${t_url}/user/GetUserId`,
        async: false,
        data: {
            token: token,
        },
        success(res) {
            if (res.code == 0) {
                u = Object.assign(u, res);
                $.ajax({
                    url: `${t_url}/pay/GetUserMoney`,
                    async: false,
                    data: {
                        token: token
                    },
                    success(res) {
                        if (res.code == 0) {
                            if (res.user == null) {
                                res = { user: { money1Balance: 0 } }
                            }
                            u = Object.assign(u, res);
                        }
                    }
                })
                $.ajax({
                    url: `${t_url}/bill/QueryTotalCharge`,
                    async: false,
                    data: {
                        token: token,
                    },
                    success(res) {
                        if (res.code == 0) {
                            u = Object.assign(u, res);
                        } else {
                            res = { "code": 0, "level": 0, "need_charge": 0, "vip2Level": 0, "need_charge2": 500 }
                            u = Object.assign(u, res);
                        }
                    }
                })
                s_html = `
					<div class="login">
						<div class="self">
							<span class="_tite">当前账号：</span><p>${u.user_name}</p>
						</div>
						<div class="info">
							<div>
								<span class="_tite">酒币余额：</span>
								<p><img src="http://www.09game.com/statics/usercenter/img/money-1.png" alt="">${u.user.money1Balance}</p>
							</div>
							<div>
								<span class="_tite">贵宾等级：</span>
								<p>
									<img src="http://www.09game.com/statics/recharge/${u.level}.png" alt="">
									${u.level}级贵宾
								</p>
								<span>`;
                if (u.vip2Level == 7) {
                    s_html += `最高等级，大家都想跟你做朋友（享有平台全部贵宾特权）。`;
                } else if (u.level == u.vip2Level) {
                    s_html += `距升级还需充值<em>${u.need_charge}</em>酒币；${u.vip2Level}阶特权，最高与贵宾等级一致，请先提升贵宾等级@_@`;
                } else {
                    if (u.level == 7) {
                        s_html += `大家都想跟你做朋友；${u.vip2Level}阶特权，距升阶还需充值<em>${u.need_charge2}</em>酒币`;
                    } else {
                        s_html += `距升级还需充值<em>${u.need_charge}</em>酒币；${u.vip2Level}阶特权，距升阶还需充值<em>${u.need_charge2}</em>酒币`;
                    }
                }
                s_html += `</span>
							</div>
						</div>
					</div>
				`
            }
        }
    })
    a_html = `
		<div class="ac_input in">
			<div class="self">${u.user_name}</div>
			<div class="other">
				<label>充值账号：</label><input type="text" onblur="b_q_account()" onkeyup="k_q_account(event)">
			</div>
		</div>
	`;
    pay.user_id = u.user_id;
    t_n = u.user_name;
    $('.balance .tite').append(`<a href="http://www.09game.com/html/usercenter2020/index.html?opentype=5" target="_blank">充值记录</a><a href="http://go.09game.com/?id=83" target="_blank">贵宾特权</a>`);
}

$('.balance .inner').html(s_html);
$('.account .inner').html(a_html);
$('.c_money li').click(function () {
    $('.c_money li').removeClass('active');
    $(this).addClass('active');
    $('.p_money span').html(`${$(this).attr('data')}<em>酒币</a>`);
    $('.confirm_button span').html(`${$(this).attr('data') / 10}<em>元</em>`);
    pay.total_fee = $(this).attr('data');
    $('.e_money input').val('');
});
$('.account .inner').on('click', '.self.un', function () {
    $(this).removeClass('un');
    a_html = `
		<div class="ac_input in">
			<div class="self">${u.user_name}</div>
			<div class="other">
				<label>充值账号：</label><input type="text"  onblur="b_q_account()" onkeyup="k_q_account(event)">
			</div>
		</div>
	`;
    $('.account .inner').html(a_html);
})
$(".account .inner ").on('click', '.change', () => {
    if (token) {
        a_html = `
			<div class="ac_input in">
				<div class="self">${u.user_name}</div>
				<div class="other">
					<label>充值账号：</label><input type="text" onblur="b_q_account()" onkeyup="k_q_account(event)">
				</div>
			</div>
		`;
        pay.user_id = u.user_id;
    } else {
        a_html = `
			<div class="ac_input in">
				<div class="other">
					<label>充值账号：</label><input type="text" onblur="b_q_account()" onkeyup="k_q_account(event)">
				</div>
			</div>
		`;
        pay.user_id = 0;
    }
    pay.name = "";
    $('.account .inner').html(a_html);
})
$('.e_money input').focus(() => {
    $('.c_money li').removeClass('active');
})
$('.e_money input').keydown(function (e) {
    if (e.keyCode == 8 || e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 16 || e.keyCode == 36 || e.keyCode == 35 || e.ctrlKey && e.keyCode == 67 || e.ctrlKey && e.keyCode == 88) { return true; }
    if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 || e.ctrlKey && e.keyCode == 86) {
        let _this = $(this);
        setTimeout(function () {
            var i = _this.val();
            var i = i.replace(/\D|^0|[^0-9]/ig, '');
            if (i.length > 4) {
                i = i.substr(0, 4);
            }
            _this.val(i);
            pay.total_fee = i * 10;
        }, 2);
        return true;
    } else {
        return false;
    }
});
$('.e_money input').change(function () {
    $(this).val($(this).val().replace(/\D|^0|[^0-9]/ig, ''));
});
$('.e_money input').blur(function () {
    if ($.trim($(this).val()) == '') {
        $('.c_money li:first').addClass('active');
        pay.total_fee = 100;
    } else {
        $('.p_money span').html(`${$(this).val() * 10}<em>酒币</em>`);
        $('.confirm_button span').html(`${$(this).val()}<em>元</em>`);
        pay.total_fee = parseInt($(this).val()) * 10;
    }
})
let p_html = ``;
window.p_c = function () {
    pay.payWay = 1; //默认每次打开都是支付宝
    $('.pop').remove();
    $('.mark').hide();
    clearInterval(t);
    t = null;
}
window.p = function (w) {
    if (pay.payWay == w) { return false }
    if (w) {
        pay.payWay = w;
    }
    //else { 
    //	$.ajax({
    //		url:`${t_url}/bill/getuserorderchannel?userid=${pay.user_id}`,
    //		async:false,
    //		success(res) { 
    //			console.log(res);
    //			if (res.code == 0) { 
    //				if(res.data == 10){
    //					pay.payway = 1;
    //				} else { 
    //					pay.payway = 2;
    //				}
    //			}
    //		}
    //	});
    //}
    p_html = ``;
    clearInterval(t);
    t = null;
    $.ajax({
        url: `${t_url}/pay`,
        type: 'POST',
        data: pay,
        success(res) {
            if (res.code == 0) {
                $('.pop').remove();
                p_html = `
					<div class="pop pay-pop-box" style="display: block;height:545px">
					<p class="popup_title"><span class="pop_close" onclick="p_c()"></span></p>
					<p style="height:97px;line-height:97px;color:#ffffff;font-size:24px;font-weight:bold;text-align:center;">您当前正在为<em style="color:#ffd05c;margin:0 5px">${t_n}</em>进行充值</p>
						<ul class="tab">
							<li class="${pay.payWay == 1 ? 'active' : ''}" onclick="p(1)"></li>
							<li class="${pay.payWay == 2 ? 'active' : ''}" onclick="p(2)"></li>
						</ul>
						<p class="code_mate ${pay.payWay == 1 ? 'zfb' : 'wepay'}">使用<em>${pay.payWay == 1 ? '支付宝' : '微信'}</em>扫描下方二维码进行充值</p>`
                if (pay.payWay == 1) {
                    p_html += `
						<div class="code alipay">
							<iframe width="190" height="190" frameborder="0" scrolling="no" src="${res.url}"></iframe>
						</div></div>`
                } else {
                    p_html += `
						<div class="code wxpay">
							<img src="${res.url}" />
						</div></div>
					`
                }
                orderNo = res.orderNo;
                clearInterval(t);
                t = null;
                t = setInterval(() => {
                    Notify();
                }, 2000)
            } else {
                p_html = `<div class="pop err">
					<p class="popup_title"><span class="pop_close" onclick="p_c()"></span></p>
					<div class="inner">
						<div class="tite">很抱歉！</div>
						<p class="mate">${res.msg}</p>
					</div>
					<div class="know" onclick="p_c()">关闭</div>
				</div>`
            }
            $('body').append(p_html);
            $('.mark').show();
        }
    })
}
window.Notify = function () {
    $.ajax({
        url: `${t_url}/Notify`,
        data: {
            orderNo: orderNo,
        },
        success(res) {
            if (res.code == 0) {
                clearInterval(t);
                $('.pop').remove();
                p_html = `<div class="pop">
					<p class="popup_title"><span class="pop_close" onclick="p_c()"></span></p>
					<div class="tite">恭喜您！</div>
					<p class="mate">成功充值${pay.total_fee / 10}元</p>
					<div class="know" onclick="window.location.href=window.location.href">关闭</div>
				</div>`
                $('.mark').show();
                $('body').append(p_html);
            }
        }
    })
}
$('.confirm_button .btn').click(() => {
    $('.pop').remove();
    if (pay.total_fee <= 0 || isNaN(pay.total_fee) || pay.total_fee == undefined) {
        //todo
        p_html = `
			<div class="pop err">
				<p class="popup_title"><span class="pop_close" onclick="p_c()"></span></p>
				<div class="inner">
					<div class="tite">很抱歉！</div>
					<p class="mate">请选择充值金额！</p>
				</div>
				<div class="know" onclick="p_c()">确定</div>
			</div>
		`
        $('body').append(p_html);
        return false;
    }
    if (pay.total_fee < 10) {
        p_html = `
			<div class="pop err">
				<p class="popup_title"><span class="pop_close" onclick="p_c()"></span></p>
				<div class="inner">
					<div class="tite">很抱歉！</div>
					<p class="mate">充值金额最少1元！</p>
				</div>
				<div class="know" onclick="p_c()">确定</div>
			</div>
		`
        $('body').append(p_html);
        return false;
    }
    if (pay.user_id <= 0 && $.trim(pay.name) == '') {
        //todo
        p_html = `
			<div class="pop err">
				<p class="popup_title"><span class="pop_close" onclick="p_c()"></span></p>
				<div class="tite">很抱歉！</div>
				<p class="mate">充值账户不存在！</p>
				<div class="know" onclick="p_c()">确定</div>
			</div>
		`
        $('body').append(p_html);
        return false;
    }
    p();
})
$('.mark').click(() => {
    p_c();
})
