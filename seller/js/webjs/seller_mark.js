$(function () { 
    inputctr.public.checkLogin(); 
    $.ajax({
        url: baseUrl + '/GetToken',
        method: 'post',
        dataType: "json",
        data: {
            userid: amazon_userid,
        },
        success: function (res) {
            console.log(res)
            if (res.result == 1) {
                $('.token').text(res.token)
                console.log('success!')
               
            } else {
                console.log(decodeURIComponent(res.error))
            }
        },
        error: function (res) {
            console.log(decodeURIComponent(res.error))
        }
    })
 })