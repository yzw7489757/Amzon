$(function () {
    inputctr.public.checkLogin();
    var service_email = sessionStorage.getItem('service_email')
    var password=sessionStorage.getItem('password')

    $('.emailAddress').text(decodeURIComponent(service_email))
    $('.newEmailAddress').val(decodeURIComponent(service_email))

    $('.submitBtn').click(function (e) {
        e.preventDefault();
        if($(" input[ type='email' ] ").val()!=$(" input[ type='againEmail' ] ").val()){
            errorAlert(1);
            return 0;
        }
        else if($(" input[ type='email' ] ").val()==$('.emailAddress').text()){
            errorAlert(3);
             return 0;

        }
        else if($(" input[ type='password' ] ").val()!=password) {
         errorAlert(2);
         return 0;
        }

       
        $.ajax({
            url: baseUrl + '/UpdateEmail',
            method: 'post',
            dataType: "json",
            data: {
                userid: amazon_userid,
                email: $(" input[ type='email' ] ").val(),
                pwd: password,
            },
            success: function (res) {
                console.log(res)
                console.log(decodeURIComponent(res.error))
                if (res.result == 1) {
                    sessionStorage.setItem('service_email', $(" input[ type='email' ] ").val(),)
                    window.location.replace("./landing_settings.html"+"?flag");
                }

            }
           
        })
    })




    function errorAlert(type){
        $(".message").remove();
        var h6,p;
        if(type==1){
          h6=$(` 
                <h6>出现了一个问题</h6>
                `)
          p=$(`
                <p>
                邮箱地址不一致，请重试。<br>
                </p>
                `)
        }
        else if(type==2){
            h6=$(` 
                <h6>出现了一个问题</h6>
                `)
            p=$(`
                <p>
               密码错误，请重试。<br>
                </p>
                `)

        }
        else{
                 h6=$(` 
                <h6>出现了一个问题</h6>
                `)
            p=$(`
                <p>
                邮箱已存在<br>
                </p>
                `)

        }
        var div=$(`
            <div class="message error">
            <span></span>
            </div>
            `);
        div.append(h6).append(p);
        $("body").prepend(div);
    }

})