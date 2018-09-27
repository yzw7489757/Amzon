$(function () {
    var baseUrl = 'http://192.168.2.164:8096/QAMZNAPI.asmx';
    var country = $('.country_select option:selected').text(); //国家地区
    var name = $('.name').val(); // 名称
    var addressOne = $('.addressOne').val(); // 地址行1
    var addressTwo = $('.addressTwo').val(); // 地址行2
    var city = $('.city').val(); // 城市
    var stateProvinceRegion = $('.stateProvinceRegion').val(); // 州/省/地区
    var zipCode = $('.zipCode').val(); // 邮编
    var phone = $('.phone').val(); // 电话
    var adrId;
    

    function inputValue() {
        country = $('.country_select option:selected').text();
        name = $('.name').val().trim();
        addressOne = $('.addressOne').val().trim();
        addressTwo = $('.addressTwo').val().trim();
        city = $('.city').val().trim();
        stateProvinceRegion = $('.stateProvinceRegion').val().trim();
        zipCode = $('.zipCode').val().trim();
        phone = $('.phone').val();
    }

    function changeBtnColor(target) {
        $(target).blur(function () {
            inputValue();
            if (country && name && addressOne && city && stateProvinceRegion && zipCode) {
                $('.unfinishBtn').hide();
                $('.finishBtn').show()
                if (window.sessionStorage) {
                    adrId = sessionStorage.getItem('adrId')
                }
            }
        })
    }
    changeBtnColor('.country')
    changeBtnColor('.name')
    changeBtnColor('.addressOne')
    changeBtnColor('.city')
    changeBtnColor('.stateProvinceRegion')
    changeBtnColor('.zipCode')

    function DelDistributionAddress() {
        inputValue()
        if(country && addressOne && name && city && stateProvinceRegion && zipCode){
           
            $.post(baseUrl + '/UpdateDistributionAddress', {
                addressId: adrId,
                country: country,
                address: addressOne,
                address2: addressTwo,
                city: city,
                province: stateProvinceRegion,
                zipcode: zipCode,
                phone: phone,
                email: '',
                name: name
            }, function (res) {
                console.log(res);
                if (res.result == '1') {  
                    $(location).attr('href', '/seller/manage_inventory_restocking.html');   
                }
            }, 'json')
        }
        
    }

    $('.country_select').change(function(){
        console.log($(this).val())
        console.log($(this).find('option:selected').text())
    })
    function setOption(str){
        $(".country_select").find("option").each(function (data) {
            var $this = $(this);
            if($this.text() === str) {
                $this.attr("selected", true);
            }
        }); 
    }
    
    // 获取地址列表
    $.post(baseUrl + '/GetAdrList', function (res) {
        console.log(res);
        detail = res.adrInfo;
        let detailTmpl = doT.template($('#addArray').text());
        $('#addTmpl').html(detailTmpl(detail));
        $('#addTmpl .editBtn').each(function (i) {
            $('#addTmpl .editBtn').eq(i).click(function () {
                adrId = $(this).parents('.adds').attr('adrId');
                // 国家地区
                var detailCountry = $(this).parents('.adds').find('.detailCountry').text();
                console.log(detailCountry)
                setOption(detailCountry)
              
                // 名称
                $('.name').val($(this).parents('.adds').find('.detailName').text());
                // 地址行1
                $('.addressOne').val($(this).parents('.adds').find('.detailAddress').text().split('-')[2]);
                // 地址行2
                $('.addressTwo').val($(this).parents('.adds').find('.detailAddress2').text());
                // 城市
                $('.city').val($(this).parents('.adds').find('.detailAddress').text().split('-')[1]);
                // 州/省/地区
                $('.stateProvinceRegion').val($(this).parents('.adds').find('.detailAddress').text().split('-')[0]);
                // 邮编
                $('.zipCode').val($(this).parents('.adds').find('.detailAddress').text().split('-')[3]);
                // 电话
                $('.phone').val($(this).parents('.adds').find('.detailPhone').text())
                // 从该地址发货
                $('.unfinishBtn').hide();
                $('.finishBtn').show()
                if (window.sessionStorage) {
                    sessionStorage.setItem('adrId', adrId)
                }
                $('.sendBtn').click(function () { 
                    DelDistributionAddress();
                 })
            })
        })
    }, 'json')
    
    $('.goBtn').click(function () {
        $(location).attr('href', '/seller/manage_inventory_restocking.html');
    })
})