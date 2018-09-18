$(function () {
    var country = $('.country_select option:selected').text(); //国家地区
    var name = $('.name').val(); // 名称
    var addressOne = $('.addressOne').val(); // 地址行1
    var city = $('.city').val(); // 城市
    var stateProvinceRegion = $('.stateProvinceRegion').val(); // 州/省/地区
    var zipCode = $('.zipCode').val(); // 邮编
    function inputValue() { 
        country = $('.country_select option:selected').text();
        name = $('.name').val();
        addressOne = $('.addressOne').val();
        city = $('.city').val();
        stateProvinceRegion = $('.stateProvinceRegion').val();
        zipCode = $('.zipCode').val();
    }
    function changeBtnColor(target) {
        $(target).blur(function () {
            inputValue();
            if (country && name && addressOne && city && stateProvinceRegion && zipCode) {
               $('.unfinishBtn').hide();
               $('.finishBtn').show()
            }
        })
    }
    changeBtnColor('.country')
    changeBtnColor('.name')
    changeBtnColor('.addressOne')
    changeBtnColor('.city')
    changeBtnColor('.stateProvinceRegion')
    changeBtnColor('.zipCode')
    $('.goBtn').click(function () {
        $(location).attr('href', '/seller/manage_inventory_restocking.html');
    })
})