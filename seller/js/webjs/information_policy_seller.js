$(function () {
    var baseUrl = "http://192.168.2.164:8096/QAMZNAPI.asmx"
    var aboutSellerContent = $("input[name='attrValue']").val() 
    // 获取关于卖家内容
    $.ajax({
        url: baseUrl + '/GetAboutSeller',
        method: 'post',
        dataType: "json",
        data: {
            userid: amazon_userid,
        },
        success: function (res) {
            if (res) {
                inputctr.public.judgeBegaintask('1106');
            }
            console.log(res);
            console.log(decodeURIComponent(res.aboutSellerContent))
            aboutSellerContent = $("input[name='attrValue']").val(decodeURIComponent(res.aboutSellerContent))
        },
        error: function (res) {
            console.log(decodeURIComponent(res.error))
        }
    })
   
    //设置关于卖家内容
    $('.saveBtn').click(function (e) {
        e.preventDefault(); 
        inputctr.public.judgeRecodertask('1106', '编写关于卖家信息用于展示买家开始');
        aboutSellerContent = document.getElementById("editattrValue").contentWindow.document.body.innerHTML
        $.ajax({
            url: baseUrl + '/SetAboutSeller',
            method: 'post',
            dataType: "json",
            data: {
                userid: amazon_userid,
                aboutSellerContent:aboutSellerContent
            },
            success: function (res) {
                console.log(res);
                if(res.result == 1){
                    $('.submitInfo').show()
                    inputctr.public.judgeFinishtask('1106');
                } 
            },
            error: function (res) {
                console.log(decodeURIComponent(res.error))
            }
        })
    })
})