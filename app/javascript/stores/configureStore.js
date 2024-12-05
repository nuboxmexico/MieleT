import { createStore, applyMiddleware } from "redux";
import { initCanCan } from 'redux-cancan';
import thunk from "redux-thunk";
const initialSelectedOptions = {invoiced:[], completed: '', requested: [], payment: []}
const initialState = {
	users: [],
	technicians: [],
	others_technicians: [],
	customers: [],
	user: {},
	technician: {},
	customer: {},
	page: 1,
	per_page: 10,
	current_user: {},
	products: [],
	spare_parts: [],
	selected_spare_parts: [],
	reintegrated_spare_parts: [],
	used_spare_parts: [],
	requested_spare_parts: [],
	total: 1,
	calendar_events: [],
	services: [],
	services_page: 1,
	services_per_page: 5,
	services_total: 1,
	survey_questions: [],
	notifications_page: 1,
	notifications_per_page: 10,
	notifications_total: 1,
	notifications: [],
	unread_notifications: [],
	downloads: [],
  finance_selected_options: initialSelectedOptions
};

function rootReducer(state, action) {
	switch (action.type){
    case '@FINANCE/SELECTED_OPTIONS':
      return {...state, finance_selected_options: action.payload}
		case "GET_CURRENT_USER":
			return {
        ...state, current_user: action.json
			}
		case "GET_USERS_SUCCESS":
			return { users: action.json.data,
					 page: action.json.page,
					 per_page: action.json.per_page,
					 total: action.json.total,
					 current_user: state.current_user
			}
		case "GET_TECHNICIANS_SUCCESS":
				return { 
						
						 technicians: action.json.data,
						 page: action.json.page,
						 per_page: action.json.per_page,
						 total: action.json.total,
						 calendar_events: state.calendar_events,
						 current_user: state.current_user
				}
		case "GET_TECHNICIANS_TAXONS_SUCCESS":
			return { technicians: action.json.data,
					 calendar_events: state.calendar_events,
					 others_technicians: action.json.others,
					 current_user: state.current_user
		}
		case "GET_CUSTOMERS_SUCCESS":
				return { customers: action.json.data,
						page: action.json.page,
						per_page: action.json.per_page,
						total: action.json.total,
						current_user: state.current_user
			}
		case "GET_USER_SUCCESS":
			return { user: action.json.data,
				current_user: state.current_user}
		case "GET_TECHNICIAN_SUCCESS":
			return { technician: action.json.data,
				current_user: state.current_user}
		case "GET_CUSTOMER_SUCCESS":
				return { customer: action.json.data,
					current_user: state.current_user}
		case "GET_PRODUCTS_SUCCESS":
			return { 
				...state,
				page: action.json.page,
				per_page: action.json.per_page,
				total: action.json.total,
				products: action.json.data,
				customer_products: state.customer_products
			}
		case "GET_SPARE_PARTS_SUCCESS":
			return { 
				...state,
				spare_parts: action.json.data
			}
		case "GET_REQUESTED_SPARE_PARTS_SUCCESS":
			return { 
				...state,
				requested_spare_parts: action.json.data
			}
		case "GET_SELECTED_SPARE_PARTS_SUCCESS":
			return { 
				...state,
				selected_spare_parts: action.json.data
			}
		case "GET_REINTEGRATED_SPARE_PARTS_SUCCESS":
			return { 
				...state,
				reintegrated_spare_parts: action.json.data
			}
		
		case "GET_USED_SPARE_PARTS_SUCCESS":
			return { 
				...state,
				used_spare_parts: action.json
			}
			
		case "EDITED_SPARE_PART":
			const service_spare_part_id_edit = action.response.data.id;
			let spare_parts_t = []
			let request_spare_parts_t = []
			if(state.spare_parts){
				spare_parts_t = state.spare_parts.map(function(item) { return item.id == service_spare_part_id_edit ? action.response.data : item; });
			}
			if(state.requested_spare_parts){
				request_spare_parts_t = state.requested_spare_parts.map(function(item) { return item.id == service_spare_part_id_edit ? action.response.data : item; });
			}
			return {
				...state,
				spare_parts: spare_parts_t,
				requested_spare_parts: request_spare_parts_t,
			};
		case "DELETED_SPARE_PART":
			const service_spare_part_id = action.response.data.service_spare_part_id;
			let spare_parts = state.spare_parts.filter(spare_part => spare_part.id !== service_spare_part_id);
			let requested_spare_parts = state.requested_spare_parts.filter(spare_part => spare_part.id !== service_spare_part_id);
			return {
				...state,
				spare_parts,
				requested_spare_parts
			};
		case "DELETED_REQUESTED_SPARE_PART":
			const service_requested_spare_part_id = action.response.data.id;
			let requested_spare_parts_delete = state.requested_spare_parts.filter(spare_part => spare_part.id !== service_requested_spare_part_id);
			return {
				...state,
				requested_spare_parts: requested_spare_parts_delete,
			};
		case "DELETED_REINTEGRATED_SPARE_PART":
			const service_reintegraed_spare_part_id = action.response.data.service_spare_part_id;
			let reintegrated_spare_parts_delete = state.reintegrated_spare_parts.filter(spare_part => spare_part.id !== service_reintegraed_spare_part_id);
			console.log(reintegrated_spare_parts_delete)
			return {
				...state,
				reintegrated_spare_parts: reintegrated_spare_parts_delete,
			};
		case "GET_SERVICES_SUCCESS":
			return { 
				...state,
        finance_selected_options: state.finance_selected_options || initialSelectedOptions,
				services_page: action.json.page,
				services_per_page: action.json.per_page,
				services_total: action.json.total,
				services: action.json.data
			}
		case "GET_USER_PRODUCTS_SUCCESS":
			return { 
				...state,
				products: state.products,
				customer_products: action.json.data
			}
		case "REDIRECT":
			return { redirectTo: action.payload };
		case 'DELETED_USER':
		  	const user_id = action.response.data.user_id;
		  	let users = state.users.filter(user => user.id !== user_id);
		  	return {
		        ...state, 
		        users
			};
		case 'DELETED_TECHNICIAN':
				const technician_id = action.response.data.technician_id;
				let technicians = state.technicians.filter(technician => technician.id !== technician_id);
				return {
				  ...state, 
				  technicians
			  };
		case 'DELETED_CUSTOMER':
				const customer_id = action.response.data.customer_id;
				let customers = state.customers.filter(customer => customer.id !== customer_id);
				return {
				  ...state, 
				  customers
			  };
		case "GET_CALENDAR_EVENTS_SUCCESS":
				return { 
					...state,
					calendar_events: action.json.data,
				};
		case "DELETED_CUSTOMER_PRODUCT":
				const customer_product_id = action.response.data.customer_product_id;
				let customer_products = state.customer_products.filter(customers_product => customers_product.id !== customer_product_id);
				return {
					...state,
					customer_products
				};
		case "EDITED_CUSTOMER_PRODUCT":
				const customer_product_id_edit = action.response.data.id;
				let customer_products_t = state.customer_products.map(function(item) { return item.id == customer_product_id_edit ? action.response.data : item; });
				return {
					...state,
					customer_products: customer_products_t
				};

		case "GET_SURVEY_QUESTIONS_SUCCESS":
			return {
				...state,
				survey_questions: action.json.data
			};
		case "GET_NOTIFICATIONS_SUCCESS":
			return { 
				...state,
				notifications_page: action.json.page,
				notifications_per_page: action.json.per_page,
				notifications_total: action.json.total,
				notifications: action.json.data
			}
		case "READ_NOTIFICATIONS_SUCCESS":
			const notification_t = action.json
			return { 
				...state,
				notifications: state.notifications.map(notification => {
					if (notification.id === notification_t.id) {
					  return {
						...notification_t
					  };
					}
					return notification;
				  })
			}
		case "GET_UNREAD_NOTIFICATIONS_SUCCESS":
			return { 
				...state,
				unread_notifications: action.json.data
			}
		case "GET_DOWNLOADS_SUCCESS":
			return { 
				...state,
				page: action.json.page,
				per_page: action.json.per_page,
				total: action.json.total,
				downloads: action.json.data,
			}		
			
		default: 
			return state
	}
}

export default function configureStore(current_user){
	initialState.current_user = current_user
	const store = createStore(rootReducer, initialState, applyMiddleware(thunk));
	initCanCan(store, require('./ability'));
	return store;
}
