/**
 * ==========================================================
 * Copyright
 * 组件集合
 * Author: fwc
 * Date: 2015-09-02 
 * ==========================================================
 */

define(['lib/dialog/dialog', 'lib/placeholder/placeholder','lib/calendar/ECode.calendar','lib/lazy/lazyLoad','lib/pager/pager'], function(dialog, placeholder,calendar,lazyLoad,pager) {
	return {
		dialog: dialog,
		placeholder: placeholder,
		calendar: calendar,
		lazyLoad:lazyLoad,
		pager:pager
	};
});