
export function spare_part_delivery_status_label(value){
	let label = "";
	if(value == "waiting" ){
		label = "En espera";
	}else if(value == "in_transit" ){
		label = "En transito";
	}else if(value == "delivered" ){
		label = "En bodega ";
	}else{
		label = value
	}

	return label
}

