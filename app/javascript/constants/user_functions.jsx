export function is_TM(current_user) {
	switch (current_user && current_user.get_roles_names) {
        case 'Administrador':
            return true
        case 'Contact Center':
            return false
        case 'Field Service':
            return false
        case 'Technical Management':
            return true
        case 'Técnico':    
            return false
        case "Entregas/Despacho":    
            return false
        default:
            return false
    }
}

export function is_CS(current_user) {
    switch (current_user && current_user.get_roles_names) {
        case 'Administrador':
            return true
        case 'Contact Center':
            return true
        case 'Field Service':
            return true
        case 'Technical Management':
            return false
        case 'Técnico':    
            return false
        case "Entregas/Despacho":    
            return false
        default:
            return false
    }
}

export function is_Delivery(current_user) {
	switch (current_user && current_user.get_roles_names) {
        case "Entregas/Despacho":    
            return true
        default:
            return false
    }
}