$(function () {
    inputctr.public.checkLogin();
    $.get('remote-nav-html.html', function (data) {
        $("#sc-masthead").html(data);
        $.post(baseUrl + "/InitSellerNav", { amazon_userid: amazon_userid }, function (data) {
            $(".shop_name").html(decodeURIComponent(data.shop_name));
        }, 'json');

        // Ŀ¼
        $('.sc-hover-nav').each(function (i) {
            $('.sc-hover-nav').eq([i]).attr('data-list', i)
            $('.sc-hover-nav').eq(i).hover(function () {
                $('.sc-hover-nav').eq([this.dataset.list])
				.find('.sc-nav-arrow').eq(0).css({
				    opacity: 1,
				    visibility: 'visible'
				});
                $('.sc-hover-nav').eq([this.dataset.list])
				.find('.sc-sub-nav').eq(0).css({
				    display: 'block'
				});
            }, function () {
                $('.sc-hover-nav').eq([this.dataset.list])
				.find('.sc-nav-arrow').eq(0).css({
				    opacity: 0,
				    visibility: 'hidden'
				});
                $('.sc-hover-nav').eq([this.dataset.list])
				.find('.sc-sub-nav').eq(0).css({
				    display: 'none'
				});
            })
        });
        inputctr.public.LangShow();
        inputctr.public.LoadLang();

         
        var timer_sc = null;
        $('#sc-ql-sz').hover(function () {
            $('.sc-nav-arrow-right').addClass('opacity_visibility')
            $('.sc-sub-nav-right').addClass('display_block');
        }, function () {
            timer_sc = setTimeout(function () {
                $('.sc-nav-arrow-right').removeClass('opacity_visibility')
                $('.sc-sub-nav-right').removeClass('display_block')
            }, 10)
        })

        $('#sc-sub-nav-right').hover(
		function () {
		    clearInterval(timer_sc); 
		},
		function () {
		    timer_sc = setTimeout(function () {
		        $('.sc-nav-arrow-right').removeClass('opacity_visibility')
		        $('#sc-sub-nav-right').removeClass('display_block')
		    }, 10)
		})
    })
    $.get('remote-footer-html.html', function (data) {
        $(".a-container-footer").html(data);
    })

})
