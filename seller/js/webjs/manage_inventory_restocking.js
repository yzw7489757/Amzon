$(function () {
    var baseUrl = 'http://192.168.2.164:8096/QAMZNAPI.asmx';
    var packMethod;

    if (window.sessionStorage) {
        var goodsIds = sessionStorage.getItem('skuIds');
        var adrId = sessionStorage.getItem('adrId')
        var goodIds = goodId + ',';
        sessionStorage.setItem('goodIds', goodIds)
        var goodId = sessionStorage.getItem('goodId')
        var skuId = sessionStorage.getItem('skuId')

    }
   
    var strGoodsJson = JSON.stringify({
        goodsArr: [{
            goodsId: goodId,
            goodsNum: 10
        }]
    });
    // 初始化转化商品信息
    $.post(baseUrl + '/GetGoodsInfo', {
        goodsIds: goodIds
    }, function (res) {
        console.log(res);
        var data = res.goodsInfo[0];
        if (data) {
            // 卖家sku
            $('.sellerSku').text(data.sellerSku)
            // 商品名称
            $('.goodName').text(decodeURIComponent(data.goodName))
            // 配送类型：-1 所有 1卖家 2 亚马逊
            if (data.shippingMode == '-1') {
                $('.shippingMode').text('所有')
            } else if (data.shippingMode == '1') {
                $('.shippingMode').text('卖家')
            } else if (data.shippingMode == '2') {
                $('.shippingMode').text('亚马逊')
            }
        }

    }, 'json')
    // 获取地址详情
    $.post(baseUrl + '/GetAdr', {
        adrId: adrId
    }, function (res) {
        console.log(res);
        $('.name').text(decodeURIComponent(res.name))
        $('.address').text(decodeURIComponent(res.address))
        $('.address2').text(decodeURIComponent(res.address2))
        $('.cityProvince').text(`${decodeURIComponent(res.city)} ${decodeURIComponent(res.province)}`)
        $('.zipcode').text(decodeURIComponent(res.zipcode))
        $('.country').text(decodeURIComponent(res.country))
    }, 'json')

    $("input[name=type]").click(function () {
        if ($(this).val() == 'mixing') {
            packMethod = 1;
        } else {
            packMethod = 2;
        }
    })

    $('.goBtn').click(function () {
        if (!packMethod) {
            alert('请选择包装类型!!')
        } else {
            // 选择发货地址和包裹类型
            $.post(baseUrl + '/SelectAdr', {
                sellerId: 1,
                deliveryAddressId:adrId,
                packMethod: packMethod,
                strGoodsJson: strGoodsJson
            }, function (res) {
                console.log(res);
                if (res.result == '1') {
                    if (window.sessionStorage) {
                        sessionStorage.setItem('planId', res.planId)
                    }
                    $(window).attr('location', '/seller/manage_inventory_setNumber.html')
                }
            }, 'json')
        }
    })
})