$(function () {
    errorAlert("p1");
    errorAlert("p2");
    errorAlert("p3");
    inputctr.public.checkLogin();
    var password=sessionStorage.getItem('password')
    //按钮点击
    $('#cnep_1C_submit_button-input').click(function (e) {
        e.preventDefault();
        //密码错误
        if($(" input[ name='nowPassword' ] ").val()!=password){
           AlertShow("p1");
            return 0;
        }
        //两次密码不同
        else if($(" input[  name='newPassword' ] ").val()!=$(" input[  name='newPasswordAgain' ] ").val()){
            AlertShow("p2");
            return 0;
        }
        $.ajax({
            url: baseUrl + '/UpdatePassword',
            method: 'post',
            dataType: "json",
            data: {
                userid: amazon_userid,
                oldPassword: password,
                newPassword: $(" input[  name='newPassword' ] ").val(),
            },
            success: function (res) {
                console.log(res)
                console.log(decodeURIComponent(res.error))
                //保存成功返回上一页
                if (res.result == 1) {
                    window.location.replace("./landing_settings.html"+"?flag");
                }else{
                    AlertShow("p3");
                }
            }
        })
    })
    //错误弹窗
    function errorAlert(type){
      //  $(".message").remove();
        var h6=$(` 
            <h6 data-i18n-text='_body_Problem'>出现了一个问题</h6>
            `)
        var p;
        if(type=="p1"){
          p=$(`
            <p data-i18n-text='_body_ProblemContent1'>
            请输入您的密码<br>
            </p>
            `)
      }
      else if(type=="p2"){
        p=$(`
            <p data-i18n-text='_body_ProblemContent2'>
            两次密码输入不一致，请重试。<br>
            </p>
            `)
    }
    else if(type=="p3"){
     p=$(`
        <p data-i18n-text='_body_ProblemContent3'>
        新密码不能是去年用过的密码<br>
        </p>
        `)
     }
 var div=$(`
    <div class="message error">
    <span></span>
    </div>
    `).hide().addClass(type).addClass("errorAlert");
 div.append(h6).append(p);
$(".ap_pagelet").before(div);
}
 function AlertShow(className){
        console.log(1);
        $(".errorAlert").hide();
        $("."+className).show();

}

})