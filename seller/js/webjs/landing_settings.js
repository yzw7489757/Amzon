$(function () { 
    inputctr.public.checkLogin();
var url = window.location.href;
var index = url.indexOf("flag")
if(index!="-1"){
    //成功更改账户
    var div=$(`
        <div id="message-box-slot">
            <div id="message_success" class="message success">
                <span></span>
                <h6 data-i18n-text="_body_success"></h6>
                <p data-i18n-text="_body_successContent">

                <br>

                </p>
            </div>
        </div>
        `);
    $(".ap_cnep_pagelet").before(div);

}



     $.ajax({
        url: baseUrl + '/InitialPreference',
        method: 'post',
        dataType: "json",
        data: {
            userid: amazon_userid,
        },

        success: function (res) {
               if (res.result == 1) {
                console.log(res)
                //初始化联系人
                InitialContactsInfo(res.data.order_sms_contact);
            } 
        }
    })
function InitialContactsInfo(contactId){
    $.ajax({
        url: baseUrl + '/InitialContactsInfo',
        method: 'post',
        dataType: "json",
        data: {
            userid: amazon_userid,
            contact_id:contactId,
        },
        success: function (res) {
          console.log(res)
          if (res.result == 1) {
           console.log("联系人数据成功取得");

            var data = res.data;
            $('.service_email').text(decodeURIComponent(data.strUserInfo.email))
            $('.shop_name').text(decodeURIComponent(data.strUserInfo.name))  
            if(decodeURIComponent(data.strUserInfo.telephone)==""){
                $('.service_phone').text("1");
            }
            else{
                $('.service_phone').text(decodeURIComponent(data.strUserInfo.telephone))
            }

            sessionStorage.setItem('shop_name',data.strUserInfo.name)
            sessionStorage.setItem('service_email',data.strUserInfo.email)     
            sessionStorage.setItem('password',data.strUserInfo.password)  
          }
        }
      })
}
 })
