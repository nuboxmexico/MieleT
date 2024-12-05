export default store => {
  const {current_user} = store.getState();

  if (current_user) {
    switch (true) {
      case current_user.get_roles_list.includes('Administrador'):
        return ["/", "/home", "/notifications", "/downloads", "/users", "/users/new", "/users/:id/edit", "/technicians", "/technicians/:id/edit", "/technicians/new", "/customers", "/customers/:id/edit", "/customers/new", "/services", "/services/cancel", "/services/add_spare_part", "/services/confirm_visit", "/calendar", "/services/edit_spare_part", "/services/edit_request_spare_part", "/surveys", "/finance"];
      case current_user.get_roles_list.includes('Finanzas'):
        return ["/", "/home", "/notifications", "/downloads", "/users", "/users/new", "/users/:id/edit", "/technicians", "/technicians/:id/edit", "/technicians/new", "/customers", "/customers/:id/edit", "/customers/new", "/services", "/services/cancel", "/services/add_spare_part", "/services/confirm_visit", "/calendar", "/services/edit_spare_part", "/services/edit_request_spare_part", "/surveys", "/finance"];
      case current_user.get_roles_list.includes('Contact Center'):
        return ["/home", "/notifications", "/downloads", "/technicians", "/technicians/:id/edit", "/technicians/new", "/customers", "/customers/:id/edit", "/customers/new", "/services", "/services/cancel", "/services/add_spare_part", "/services/confirm_visit", "/calendar", "/surveys"];
      case current_user.get_roles_list.includes('Field Service'):
        return ['/home', "/notifications", "/downloads", '/customers', "/technicians", "/technicians/:id/edit", "/technicians/new", "/customers", "/customers/:id/edit", "/services", "/services/cancel", "/services/add_spare_part", "/services/edit_request_spare_part", "/calendar"];
      case current_user.get_roles_list.includes('Technical Management'):
        return ['/home', "/notifications", "/downloads", '/customers', "/services", "/calendar", "/services/add_spare_part", "/services/edit_spare_part"];
      case current_user.get_roles_list.includes('Técnico'):
        return ['/home', "/notifications", "/downloads", '/customers', "/services", "/calendar"];
      case current_user.get_roles_list.includes('Entregas/Despacho'):
        return ['/home', "/notifications", "/downloads", '/customers', "/services", "/calendar"];
      default:
        return ['/home', "/notifications", "/downloads", '/customers'];
    }
  }

  return ['/home'];
};

