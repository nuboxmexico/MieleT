import axios from 'axios';
import { flash_alert } from 'components/App';
import { csrf, headers} from "constants/csrf"


export function callMastercardGateway(provider, object_id, customer_id, amount, object_class) {
    checkoutLightbox(provider, object_id, customer_id, amount, object_class);
}

export function checkoutLightbox(provider, object_id, customer_id, amount, object_class) {  
    return axios.get(`/mastercard_lightbox/${provider}/${object_id}.json?customer_id=${customer_id}&amount=${amount}&object_class=${object_class}`)
        .then(json => {
            let script = document.getElementById(provider)
            if(script == null){
                script = document.createElement('script');
                script.src = json.data.checkout_url;
                script.setAttribute("id", provider)
                script.setAttribute("data-error", `${json.data.error_callback_url}?object_id=${object_id}&customer_id=${customer_id}`)
                script.setAttribute("data-cancel", `${json.data.cancel_callback_url}?object_id=${object_id}&customer_id=${customer_id}`)
                script.setAttribute("data-complete", `${json.data.complete_callback_url}?object_id=${object_id}&customer_id=${customer_id}`)
                
                document.body.appendChild(script);
            }
            
            script.addEventListener('load', function() {
                Checkout.configure(json.data.checkout_configuration);
                Checkout.showLightbox();
            });

        })
        .catch(e => {
            flash_alert("Error", "Ha ocurrido un error intentando procesar el pago.", "danger")
                
    });    
}

export function savePaymentData(resultIndicator, sessionVersion, provider_id, payment_id, setRedirect){
    var body = new FormData();
    body.set('payment_id', payment_id);
    body.set('result_indicator', resultIndicator);
    body.set('session_version', sessionVersion);
    body.set('provider_id', provider_id);
    
    return axios.post('/payment/save_data', body, { headers: headers})
        .then(response => {
            console.log(response)
            flash_alert("Creado", "EL pago se ha realizado satisfactoriamente", "success")
                setRedirect(true);
            })
        .catch(e => {
            flash_alert("Error", "Ha ocurrido un error intentando procesar el pago.", "danger")
                
    });
}
