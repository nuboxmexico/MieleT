import moment from 'moment-timezone';
import { CURRENCY_SYMBOLS, currencyFormatter } from './currency';

export const csrf = (document.querySelector("meta[name='csrf-token']") == undefined) ? "" : document.querySelector("meta[name='csrf-token']").getAttribute("content")
export const headers = {
	   'Content-Type': 'application/json',
	   'X-CSRF-Token': csrf
	 }

export const headers_www_form = {
	'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
	'X-CSRF-Token': csrf
}

export const noPaymentsOptions = [
	"Garantía de producto/manufactura", 
	"Garantía Instalación/Reparación", 
	"Instalación sin costo", 
	"Cortesía", 
	"Segunda visita póliza", 
	"Ingreso a taller para diagnóstico", 
	"Visita pagada",
  "Pagado en cotización"
];
	
export function api_token(environment) {
	switch (environment) {
		case "staging":
		  	return "kdOQrQZ1tQr2C0DXBYj3kAtt"
			break;
		case "production":
		  	return "NOXTr4Z8iwQKTdcFTPhQpgtt"
			break;
		default:
		  	return "dIwBMltsWrVznfqqKd95GQtt"
			break;
	  }
}

export function site_url(environment) {
	switch (environment) {
		case "staging":
		  	return "https://mieletickets.garagelabs.cl"
			break;
		case "pre_production":
      return "https://preprod.mieletickets.garagelabs.cl"
		case "production":
		  	return "https://tickets.mielecustomers.cl"
			break;
		default:
		  	return "http://localhost:3000"
			break;
	  }
}

export function b2b_site_url(environment) {
	switch (environment) {
		case "staging":
		  	return "https://miele.garagelabs.cl"
			break;
		case "production":
		  	return "https://www.mielecustomers.cl"
			break;
		default:
		  	return "http://localhost:3000"
			break;
	  }
}


export function getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
		  color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
}


export function getTechiniansInfo(technicians){
	var tech_info = " "
	if (technicians){
		technicians.map((technician) => {
			tech_info = tech_info +" "+ technician.user.fullname
		});    
	}
	return tech_info
}
	
export function getProductsInfo(products){
	var prod_info = " "
	if (products){
		products.map((product) => {
			prod_info = prod_info +" "+ product.product.name
		});    
	}
	return prod_info
}
/*
* Parse and integer to money format by country
*
* @param {string} country_code - must be an ISO code, ex: MX, CL, BR.
* */
export function money_format(country_code, value){
	if(Number.isNaN(Number(value))) {
		return value;
	}
	
 	const symbol = CURRENCY_SYMBOLS[country_code];
  const formatter = currencyFormatter(country_code);
  value = country_code === 'CLP' ? Math.trunc(value) : value;
	
  return `${symbol} ${formatter.format(value)}`
}

export function custom_money_format(country_code, value){

	if(Number.isNaN(Number(value))) {
		return value;
	}
	var formatter = new Intl.NumberFormat('es-CL',{ maximumFractionDigits: 0})
	if (country_code == 'CL'){
		value = Math.trunc(value);
		formatter = new Intl.NumberFormat('es-CL',{ maximumFractionDigits: 0})
	}
	else if (country_code == 'MX'){
		formatter = new Intl.NumberFormat('es-MX',{ minimumFractionDigits: 2, maximumFractionDigits: 2 })
	}
	
	var value_temp = formatter.format(value)
	if (country_code == 'CLP' && value_temp.length == 4){
		return value_temp.replace(/(.)(?=(\d{3})+$)/g,'$1.')
	
	}else{
		return formatter.format(value)
	}
}

export function product_price(product, country, quantity = 1){
	let price = null
	if(product.product_prices.length > 0){
		price = product.product_prices.filter(price => (price.country.iso == country))
	}
	if (price && price[0] ){
		return money_format(country, (price[0].sale_price != null ? price[0].sale_price: price[0].price) * quantity)
	}else{
		return money_format(country, 0)
	}

}

export function product_price_no_format(product, country, quantity = 1){
	let price = null
	if(product.product_prices && product.product_prices.length > 0){
		price = product.product_prices.filter(price => (price.country.iso == country))
	}
	if (price && price[0] ){
		return ((price[0].sale_price != null ? price[0].sale_price: price[0].price) * quantity)
	}else{
		return 0.0
	}

}

export function quotation_spare_part_price(quotation_spare_part, country, quantity = 1){
	let product = quotation_spare_part.spare_part
	if (quotation_spare_part.price != null){
		return money_format(country, quotation_spare_part.price * quantity)
	}else{
		return product_price(product, country, quantity)
	}

}

export function quotation_spare_part_price_no_format(quotation_spare_part, country, quantity = 1){
	let product = quotation_spare_part.spare_part
	if (quotation_spare_part.price != null){
		return quotation_spare_part.price * quantity
	}else{
		return product_price_no_format(product, country, quantity)
	}
}


export function date_format(value){

	return new Intl.DateTimeFormat('es', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(new Date(value))
}

export function date_format_without_time(value){
	return new Intl.DateTimeFormat('es', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(new Date(value))
}

export function date_format_without_time_and_zone(value){
	return (moment.tz(value, "America/New_York").format("DD/MM/YYYY"))
}

export function date_format_without_zone(value){
	return (moment.tz(value, "America/New_York").format("DD/MM/YYYY HH:mm:ss"))
}


export function date_without_time_and_zone(value){
	return (moment.tz(value, "America/New_York"))
}




export function date_format_without_time_and_zone_eng(value){
	return (moment.tz(value, "America/New_York").format("YYYY-MM-DD"))
}




export function date_event_format(start, end){
	let start_event = new Intl.DateTimeFormat('es', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(new Date(start))
	let end_event = new Intl.DateTimeFormat('es', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(new Date(end))
	
	if(start_event == end_event){
		return ((moment(start).format("DD/MM/YYYY HH:mm")) + " - " + (moment(end).format("HH:mm")))	
	}else{
		return ((moment(start).format("DD/MM/YYYY HH:mm")) + " - " + (moment(end).format("DD/MM/YYYY HH:mm")))	
	
	}
	
}

export function payment_channel_label(value){

  const labels = {
    online: 'Online',
		transfer: 'Transferencia',
		phone: 'Por teléfono',
		pay_at_home: 'Cliente paga en domicilio',
    bank_deposit: 'Cliente realiza depósito bancario'
  }

  return labels[value] ? labels[value] : value
}


export function check_payment_method_name(channel_label, method_name){
	if(channel_label == "online" || channel_label == "phone"){
		payment_channel_label(channel_label)
		return payment_channel_label(channel_label) + " - " + method_name
	}else{
		return payment_channel_label(channel_label)
	}
  
} 

export function date_difference_in_hours(start, end){
	let startDate = moment(start);
	let timeEnd = moment(end);
	let diff = timeEnd.diff(startDate);
	let diffDuration = moment.duration(diff);
	return diffDuration.asHours().toFixed(0)
}

export function isFloat(val) {
    var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
    if (!floatRegex.test(val))
        return false;

    val = parseFloat(val);
    if (isNaN(val))
        return false;
    return true;
}

export function isInt(val) {
    var intRegex = /^-?\d+$/;
    if (!intRegex.test(val))
        return false;

    var intVal = parseInt(val, 10);
    return parseFloat(val) == intVal && !isNaN(intVal);
}
