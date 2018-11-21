$(function(){
    inputctr.public.checkLogin();
    var lookID = inputctr.public.getQueryString('view');
    $('.manage_claim_codes').click(function(){
        window.location.href = 'manage_claim_codes.html?manage='+lookID
    })
    var viewData = {
        seller_id:amazon_userid,
        id:lookID
    }
    function ViewPromotion(data){
        inputctr.public.SellerRegisterLoading();
        inputctr.public.AjaxMethods('GET', baseUrl + '/PromotionInfo', {json:JSON.stringify(data)}, function (data) {
            if(data.result == 1) {
                var val = data.data.promotion;
                $('.edit_promotion').click(function(){
                    window.location.href = 'edit_promotion.html?edit='+lookID+'&type='+val.type
                })
                var qualifying_items_ASIN = (val.qualifying_items_ASIN == '') ? '-' : val.qualifying_items_ASIN;
                var qualifying_items_quantity = (val.qualifying_items_quantity == '') ? '-' : val.qualifying_items_quantity;
                var conditions_html = '<table class="step-table a-row" border="1">'+
                                            '<tr>'+
                                                '<td class="left-td">Buyer purchases</td>'+
                                                '<td class="right-td">'+
                                                    '<span>'+val.buyer_purchases_text+'</span>'+
                                                    '<span style="margin-left:35px;">'+val.buyer_purchases_value+'</span>'+
                                                '</td>'+
                                            '</tr>'+
                                            '<tr>'+
                                                '<td class="left-td">Purchased Items</td>'+
                                                '<td class="right-td">'+
                                                    '<span>'+val.purchased_Items_text+'</span>'+
                                                '</td>'+
                                            '</tr>'+
                                            '<tr>'+
                                                '<td class="left-td">Buyer gets</td>'+
                                               ' <td class="right-td">'+
                                                    '<span>'+val.buyer_gets_text+'</span>'+
                                                    '<span style="margin-left:35px;">'+val.buyer_gets_value+'</span>'+
                                                '</td>'+
                                            '</tr>'+
                                            '<tr>'+
                                                '<td class="left-td">Applies to</td>'+
                                                '<td class="right-td">'+
                                                    '<span>'+val.applies_to_text+'</span>'+
                                                '</td>'+
                                            '</tr>'+
                                            '<tr>'+
                                                '<td class="left-td">Qualifying Item</td>'+
                                                '<td class="right-td">'+
                                                    '<span>'+qualifying_items_ASIN+'</span>'+
                                                    '<span style="margin-left:35px;">'+val.qualifying_items_quantity+'</span>'+
                                                '</td>'+
                                            '</tr>'+
                                            '<tr>'+
                                                '<td class="left-td">Buy benefit applies to a quantity of</td>'+
                                                '<td class="right-td">'+
                                                    '<span>'+qualifying_items_quantity+'</span>'+
                                                '</td>'+
                                            '</tr>'+
                                        '</table>'
                $('.conditions-view').html(conditions_html);
                var scheduling_html = ' <table class="step-table a-row" border="1">'+
                                            '<tr>'+
                                                '<td class="left-td">Start Date</td>'+
                                                '<td class="right-td">'+
                                                    '<span>'+val.start_date+'</span>'+
                                                '</td>'+
                                            '</tr>'+
                                            '<tr>'+
                                                '<td class="left-td">End Date</td>'+
                                                '<td class="right-td">'+
                                                    '<span>'+val.end_date+'</span>'+
                                                '</td>'+
                                            '</tr>'+
                                            '<tr>'+
                                               ' <td class="left-td">Internal Description</td>'+
                                                '<td class="right-td">'+
                                                    '<span>'+val.description+'</span>'+
                                                '</td>'+
                                            '</tr>'+
                                            '<tr>'+
                                                '<td class="left-td">Tracking ID</td>'+
                                                '<td class="right-td">'+
                                                    '<span>'+val.tracking_id+'</span>'+
                                                '</td>'+
                                            '</tr>'+
                                        '</table>'
                $('.scheduling-view').html(scheduling_html);
            }else{
                alert(data.error);
            }
            inputctr.public.SellerRegisterLoadingRemove();
        }, function (error) {
            alert(error.statusText);
        })
    }ViewPromotion(viewData)
})