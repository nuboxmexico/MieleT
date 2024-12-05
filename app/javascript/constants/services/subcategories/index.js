import * as serviceTypeSubcategoriesES from './es.js'
import * as serviceTypeSubcategoriesPT from './pt.js'

const serviceTypeSubcategoriesPerLng = {
  es: serviceTypeSubcategoriesES,
  pt: serviceTypeSubcategoriesPT
}

function serviceTypeSubcategories (lng) {
  const { installationSubcategories, maintenanceSubcategories, repairSubcategories, fallbackSubcategories } = serviceTypeSubcategoriesPerLng[lng]
  return {
    installation: installationSubcategories,
    maintenance: maintenanceSubcategories,
    repair: repairSubcategories,
    homeProgram: fallbackSubcategories,
    workshopRepairs: fallbackSubcategories,
    deliveries: fallbackSubcategories,
    maintenancePolicy: fallbackSubcategories
  }
}

export default serviceTypeSubcategories
