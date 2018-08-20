let manage_orders={};
$(function(){
	manage_orders.InitFilterCondition('.a-dropdown-container');
	
})
//初始化筛选条件
manage_orders.InitFilterCondition=function(target){
	let ctr_dom=$(target).find('.dropdown-menu').find('li a');
	ctr_dom.each(function(){
		$(this).click(function(){
			if($(this).parent('li').attr('aria-checked')=="true"){
				//没有改变筛选条件
				return true;
			}else{
				$(this).addClass('active');
				$(this).parent('li').attr('aria-checked',"true");
				$(this).parent('li').siblings('li').attr('aria-checked',"false");
				$(this).parent('li').siblings('li').find('a').removeClass('active');
				let val=$(this).attr('data-value');
				let tex=$(this).attr("replace-text");
				$(this).parents('.a-dropdown-container').attr('data-condition',val);
				$(this).parents('.a-dropdown-container').find('.a-dropdown-prompt').html(tex);
			}
		})
	})
}

//改变筛选条件
manage_orders.ChangeFilterCondition=function(){
	let condition=$('#myo-filters-form').find('input');
	let allCondition='';
	condition.each(function(){
	 	if($(this).parents('.a-row').hasClass('hide')){ 
	 	}else{
	 		if($(this).is(':checked')){
	 			let conditionTex=$(this).next('span').html();
	 			let conditionVal=$(this).val();
	 			allCondition+='<div class="myo-filter-topbar-badge" data-val="'+conditionVal+'" onclick="manage_orders.DeleteCondition(this)"><span class="margin-right">'
							+'<span>'+conditionTex+'</span></span><span class="delete-condition" ></span></div>';
	 		}
	 	}
	})
	$('.amazon-manage-order-filters-bar #dynamic-condition').html(allCondition);
	if($('.amazon-manage-order-filters-bar').hasClass('hide')){
		$('.amazon-manage-order-filters-bar').removeClass('hide');
	}
}
//删除筛选条件
manage_orders.DeleteCondition=function(target){
	let del_val=$(target).attr('data-val');
	let condition=$('#myo-filters-form').find('input');
	condition.each(function(){
 		if($(this).val()==del_val){
 			$(this).prop('checked',false);
	 	} 
	})
	$(target).remove();
	let len=$('#dynamic-condition').find('.myo-filter-topbar-badge').length;
	if(len==0){
		$('.amazon-manage-order-filters-bar').addClass('hide');
	}
}

//另存为快速筛选器
manage_orders.SaveQuickFilter=function(){
	let condition=$('#myo-filters-form');
	let shipByDate='';
	let shipByDateTxt='';
	if(!$(condition.find('.a-row')[0]).hasClass('hide')){
		shipByDate=$('input[name="shipByDate"]:checked').val();
		shipByDateTxt=$('input[name="shipByDate"]:checked').next('span').html();
	}
	let shipByChannel='';
	let shipByChannelTxt='';
	if($('#myo-filters-form').find('input[name="shipByChannel"]:checked').length>0){
		$('#myo-filters-form').find('input[name="shipByChannel"]:checked').each(function(){
			shipByChannel+=$(this).val()+',';
			shipByChannelTxt+=$(this).next('span').html()+','
		})
		shipByChannel=shipByChannel.substring(0,shipByChannel.length-1);
		shipByChannelTxt=shipByChannelTxt.substring(0,shipByChannelTxt.length-1);
	}
	let shippingService='';
	let shippingServiceTxt='';
	shippingService=$('#myo-filters-form input[name="shippingService"]:checked').val();
	shippingServiceTxt=$('#myo-filters-form input[name="shippingService"]:checked').next('span').html();
	let selectCondition=''
	if(!shipByDate){
	}else{
		selectCondition='<li><span class="a-text-bold">配送日期</span>: <span>'+shipByDateTxt+'</span></li>';
	}
	if(!shipByChannel){
	}else{
		selectCondition+='<li><span class="a-text-bold">销售渠道</span>: <span>'+shipByChannelTxt+'</span></li>';
	}
	if(!shippingService){
	}else{
		selectCondition+='<li><span class="a-text-bold">配送服务</span>: <span>'+shippingServiceTxt+'</span></li>';
	}
	$('#a-popover-myo-quickfilters-save').find('ul').html(selectCondition);
	$('#a-popover-myo-quickfilters-save').click(function(event){
		event.stopPropagation();
	})
}

//设置表格首选项
manage_orders.SetTablePreferences=function(){
	$('#amazon-manage-order-set-table-preferences').modal();
}
