$(function () { 
    $('.goBtn').click(function () {
        $(location).attr('href', '/seller/manage_inventory_checking_hide.html');
    })
    // 返回
    $('.returnBtn').click(function () {
        $(location).attr('href', '/seller/manage_inventory_labeling_goods.html');
    })
 })