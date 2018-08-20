$(function(){
  inputctr.public.checkLogin(); 
  let timer = null;
  $('.a-declarative').hover(function(){
    clearTimeout(timer)
    $('#model').fadeIn(200).show();
  },function(){
    timer = setTimeout(function(){
      $('#model').fadeOut(200).hide();
    },300)
   
  })
  $('.a-icon-close').click(function(){
    $('#model').hide();
  })
  $('.startCheck').click(function(){
    $('.readyCheck').val(['0'])

    
  });

  $('.stopCheck').click(function(){
    $('.tostopCheck').val(['1'])

  })

 //取得当前假期信息
$.ajax({
        url: baseUrl + '/GetShopInfo',
        method: 'post',
        dataType: "json",
        data: {
            userid: amazon_userid,
        },
        success: function (res) {
               if (res.result == 1) {
  
                var vacation=res.data.vacation;
        
                if(vacation==0){
                  $("input[name='radio1']").eq(1).attr("checked","checked");
                }
                else{
                  $("input[name='radio1']").eq(0).attr("checked","checked");
                }

            } else {
                console.log(decodeURIComponent(res.error))
            }
        },
        error: function (res) {
            console.log(decodeURIComponent(res.error))
        }
    })





//保存按钮
  $(".a-button-primary").click(function(){
    $.ajax({
        url: baseUrl + '/HolidaySetting',
        method: 'post',
        dataType: "json",
        data: {
            userid: amazon_userid,
            vacation:$("input[name='radio1']:checked").val()
        },
        success: function (res) {
            if (res.result == 1) {
              console.log(res);
                console.log('success!')
                alert("保存成功");
               
            } else {
                console.log(decodeURIComponent(res.error))
            }
        },
        error: function (res) {
            console.log(decodeURIComponent(res.error))
        }
    })
  })
})